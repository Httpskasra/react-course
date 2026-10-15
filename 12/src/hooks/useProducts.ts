import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { productsApi } from "../api/products";
import type {
  Product,
  ProductFilters,
  ProductInput,
  ProductsResponse,
} from "../types/product";
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  infinite: (q: string, category: string) =>
    [...productKeys.all, "infinite", { q, category }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

export const productListOptions = (filters: ProductFilters) =>
  queryOptions({
    queryKey: productKeys.list(filters),
    queryFn: ({ signal }) => productsApi.list(filters, signal),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
export const productDetailOptions = (id: number) =>
  queryOptions({
    queryKey: productKeys.detail(id),
    queryFn: ({ signal }) => productsApi.detail(id, signal),
    enabled: id > 0,
    staleTime: 60_000,
  });
export const productInfiniteOptions = (q: string, category: string) =>
  infiniteQueryOptions({
    queryKey: productKeys.infinite(q, category),
    queryFn: ({ pageParam, signal }) =>
      productsApi.list({ q, category, page: pageParam, limit: 8 }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 30_000,
  });
export const useProducts = (filters: ProductFilters) =>
  useQuery(productListOptions(filters));
export const useProduct = (id: number) => useQuery(productDetailOptions(id));
export const useInfiniteProducts = (q: string, category: string) =>
  useInfiniteQuery(productInfiniteOptions(q, category));
export function useCreateProduct() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: (created) => {
      client.setQueryData(productKeys.detail(created.id), created);
      return client.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
export function useUpdateProduct() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductInput> }) =>
      productsApi.update(id, data),
    onSuccess: (updated) => {
      client.setQueryData(productKeys.detail(updated.id), updated);
      return client.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
export function useDeleteProduct() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: productsApi.remove,
    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: productKeys.lists() });
      const snapshots = client.getQueriesData<ProductsResponse>({
        queryKey: productKeys.lists(),
      });
      client.setQueriesData<ProductsResponse>(
        { queryKey: productKeys.lists() },
        (old) =>
          old ?
            {
              ...old,
              items: old.items.filter((p) => p.id !== id),
              total: Math.max(
                0,
                old.total - (old.items.some((p) => p.id === id) ? 1 : 0),
              ),
            }
          : old,
      );
      return { snapshots };
    },
    onError: (_error, _id, context) => {
      context?.snapshots.forEach(([key, data]) =>
        client.setQueryData(key, data),
      );
    },
    onSettled: () => client.invalidateQueries({ queryKey: productKeys.all }),
  });
}
export function useToggleStock() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ product, stock }: { product: Product; stock: number }) =>
      productsApi.update(product.id, { stock }),
    onMutate: async ({ product, stock }) => {
      await client.cancelQueries({ queryKey: productKeys.all });
      const lists = client.getQueriesData<ProductsResponse>({
        queryKey: productKeys.lists(),
      });
      const infinite = client.getQueriesData({
        queryKey: [...productKeys.all, "infinite"],
      });
      const oldDetail = client.getQueryData<Product>(
        productKeys.detail(product.id),
      );
      client.setQueriesData<ProductsResponse>(
        { queryKey: productKeys.lists() },
        (old) =>
          old ?
            {
              ...old,
              items: old.items.map((p) =>
                p.id === product.id ? { ...p, stock } : p,
              ),
            }
          : old,
      );
      client.setQueriesData<{
        pages: ProductsResponse[];
        pageParams: unknown[];
      }>({ queryKey: [...productKeys.all, "infinite"] }, (old) =>
        old ?
          {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((p) =>
                p.id === product.id ? { ...p, stock } : p,
              ),
            })),
          }
        : old,
      );
      client.setQueryData<Product>(productKeys.detail(product.id), (old) =>
        old ? { ...old, stock } : old,
      );
      return { lists, infinite, oldDetail };
    },
    onError: (_error, { product }, context) => {
      context?.lists.forEach(([key, value]) => client.setQueryData(key, value));
      context?.infinite.forEach(([key, value]) =>
        client.setQueryData(key, value),
      );
      if (context?.oldDetail)
        client.setQueryData(productKeys.detail(product.id), context.oldDetail);
    },
    onSettled: () => client.invalidateQueries({ queryKey: productKeys.all }),
  });
}
