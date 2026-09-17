const BASE_URL = 'http://localhost:4000'

export async function getProducts(search = '', category = 'all') {
  const params = new URLSearchParams({ search, category })
  const response = await fetch(`${BASE_URL}/products?${params}`)
  if (!response.ok) throw new Error('Failed to load products')
  return response.json()
}
export async function getProduct(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`)
  if (!response.ok) throw new Error('Product not found')
  return response.json()
}
export async function createProduct(input) {
  const response = await fetch(`${BASE_URL}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })
  if (!response.ok) throw new Error('Failed to create product')
  return response.json()
}
export async function updateProduct(id, input) {
  const response = await fetch(`${BASE_URL}/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })
  if (!response.ok) throw new Error('Failed to update product')
  return response.json()
}
export async function deleteProduct(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete product')
  return response.json()
}
