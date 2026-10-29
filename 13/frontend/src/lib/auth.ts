import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Role, User } from './types';
const BASE = process.env.API_URL || 'http://localhost:4001';
export async function session(): Promise<{ token: string; user: User } | null> {
  const token = (await cookies()).get('nova_session')?.value;
  if (!token) return null;
  try {
    const response = await fetch(`${BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
    if (!response.ok) return null;
    return { token, user: await response.json() as User };
  } catch { return null; }
}
export async function requireRole(roles: Role[]) {
  const current = await session();
  if (!current) redirect('/login?next=/dashboard');
  if (!roles.includes(current.user.role)) redirect('/forbidden');
  return current;
}
