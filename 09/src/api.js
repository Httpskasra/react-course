const API_URL = import.meta.env.VITE_API_URL;
export async function getProducts(param = {}, signal) {
  const queryParam = new URLSearchParams();

  Object.entries(param).forEach(([key, val]) => {
    if (val !== "" && val !== undefined && val !== null) {
      queryParam.set(key, String(val));
    }
  });

  const response = await fetch(`${API_URL}/products?${queryParam.toString()}`, {
    signal,
  });
  if (!response.ok) {
    throw new Error("خطای سرور");
  }
  return response.json();
}
