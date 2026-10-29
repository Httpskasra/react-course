import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import type { Product, Order, User } from './types';
const BASE = process.env.API_URL || 'http://localhost:4001';
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init });
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return res.json() as Promise<T>;
}
export async function getProducts(): Promise<Product[]> {
  'use cache';
  cacheLife('minutes'); cacheTag('products');
  return request<Product[]>('/api/products');
}
export async function getFeatured(): Promise<Product[]> {
  'use cache';
  cacheLife('minutes'); cacheTag('products');
  return request<Product[]>('/api/products?featured=1');
}
export async function getProduct(id: string): Promise<Product | null> {
  'use cache';
  cacheLife('minutes'); cacheTag('products', `product-${id}`);
  const res = await fetch(`${BASE}/api/products/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Unable to load product');
  return res.json();
}
export async function getOrders(token: string): Promise<Order[]> {
  return request<Order[]>('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
}
export async function getUsers(token: string): Promise<User[]> {
  return request<User[]>('/api/users', { headers: { Authorization: `Bearer ${token}` } });
}
export async function apiMutation<T>(path: string, token: string, method: string, body?: unknown): Promise<T> {
  return request<T>(path, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
}
