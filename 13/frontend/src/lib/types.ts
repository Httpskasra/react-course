export type Role = "admin" | "manager" | "staff" | "customer";
export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  color: string;
  badge?: string;
  description: string;
  stock: number;
  rating: number;
};
export type Order = {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  date: string;
  items: { id: string; quantity: number }[];
};
export type User = { id: string; name: string; email: string; role: Role };
export type ActionState = { error?: string; success?: string };
export const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
export const roleLabels: Record<Role, string> = {
  admin: "Administrator",
  manager: "Store Manager",
  staff: "Team Member",
  customer: "Customer",
};
