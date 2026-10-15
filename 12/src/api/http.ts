const BASE_URL = import.meta.env.VITE_API_URL ?? "";
export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(error.error ?? `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}
