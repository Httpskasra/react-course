import api from '../api/axios'

export const productService = {
  getAllProducts: async (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : ''
    const response = await api.get(`/products${query}`)
    return response.data
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  createProduct: async (product) => {
    const response = await api.post('/products', product)
    return response.data
  },

  updateProduct: async (id, product) => {
    const response = await api.patch(`/products/${id}`, product)
    return response.data
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
}