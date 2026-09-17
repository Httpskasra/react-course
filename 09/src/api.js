const API_URL = import.meta.env.VITE_API_URL;
export async function getProducts(page = 1, limit = 8, signal) {
  const response = await fetch(
    `${API_URL}/products?page=${page}&limit=${limit}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error("خطای سرور");
  }
  return response.json();
}
