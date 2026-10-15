export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: string;
};
export type ProductInput = Pick<
  Product,
  "title" | "description" | "price" | "category" | "stock"
>;
export type ProductsResponse = {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  nextPage: number | null;
};
export type ProductFilters = {
  q: string;
  category: string;
  page: number;
  limit: number;
};
