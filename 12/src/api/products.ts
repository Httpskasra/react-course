import { http } from "./http";
import type {
  Product,
  ProductInput,
  ProductFilters,
  ProductsResponse,
} from "../types/product";
export const productsApi = {
  list: (filters: ProductFilters, signal?: AbortSignal) => {
    const qs = new URLSearchParams({
      q: filters.q,
      category: filters.category,
      page: String(filters.page),
      limit: String(filters.limit),
    });
    return http<ProductsResponse>(`/api/products?${qs}`, { signal });
  },
  detail: (id: number, signal?: AbortSignal) =>
    http<Product>(`/api/products/${id}`, { signal }),
  create: (input: ProductInput) =>
    http<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: number, input: Partial<ProductInput>) =>
    http<Product>(`/api/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: number) =>
    http<{ success: boolean }>(`/api/products/${id}`, { method: "DELETE" }),
};
