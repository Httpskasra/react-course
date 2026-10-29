'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath, revalidateTag, updateTag } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { apiMutation } from '@/lib/api';
import type { ActionState, Order, Product } from '@/lib/types';
const BASE = process.env.API_URL || 'http://localhost:4001';
const loginSchema = z.object({ email: z.email(), password: z.string().min(4) });
export async function loginAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({ email: form.get('email'), password: form.get('password') });
  if (!parsed.success) return { error: 'Enter a valid email and password.' };
  let token: string;
  try {
    const res = await fetch(`${BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data), cache: 'no-store' });
    if (!res.ok) return { error: 'Incorrect credentials.' };
    token = (await res.json() as { token: string }).token;
  } catch { return { error: 'API is unavailable. Start the backend first.' }; }
  (await cookies()).set('nova_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 12 });
  redirect('/dashboard');
}
export async function logoutAction() { (await cookies()).delete('nova_session'); redirect('/'); }
const productSchema = z.object({ name: z.string().min(2), category: z.string().min(2), price: z.coerce.number().positive(), stock: z.coerce.number().int().nonnegative(), description: z.string().min(3), image: z.url(), color: z.string().default('#c8d4d8') });
export async function createProductAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { token } = await requireRole(['admin', 'manager']);
  const parsed = productSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || 'Invalid data' };
  try { await apiMutation<Product>('/api/products', token, 'POST', parsed.data); } catch { return { error: 'Failed to save product.' }; }
  updateTag('products'); revalidatePath('/shop');
  return { success: 'Product created successfully.' };
}
export async function updateOrderAction(form: FormData) {
  const { token } = await requireRole(['admin', 'manager', 'staff']);
  const id = String(form.get('id') || ''); const status = String(form.get('status') || '');
  if (!z.enum(['pending','processing','shipped','delivered']).safeParse(status).success) return;
  await apiMutation<Order>(`/api/orders/${encodeURIComponent(id)}`, token, 'PATCH', { status });
  revalidatePath('/dashboard/orders');
}
export async function refreshCatalogAction() {
  await requireRole(['admin','manager']);
  revalidateTag('products', 'max');
  revalidatePath('/shop');
}
export async function createOrderAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const current = await requireRole(['admin','manager','staff','customer']);
  const productId = String(form.get('productId') || '');
  const quantity = Number(form.get('quantity') || 1);
  if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) return { error: 'Invalid quantity' };
  try { await apiMutation('/api/orders', current.token, 'POST', { items: [{ id: productId, quantity }] }); }
  catch { return { error: 'Could not place order. Check inventory.' }; }
  redirect('/dashboard/orders');
}
