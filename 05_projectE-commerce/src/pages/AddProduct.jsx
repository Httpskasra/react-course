import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


import ProductForm from '../components/Form/ProductForm'
import { productService } from '../services/productService'

function AddProductPage() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')

  const handleCreateProduct = async (productData) => {
    try {
      setSubmitError('')

      const createdProduct =
        await productService.createProduct(productData)

      navigate(`/products/${createdProduct.id}`)
    } catch (error) {
      console.error(error)

      setSubmitError(
        error.response?.data?.message ||
        'Could not create the product. Please try again.'
      )
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Add Product
        </h1>

        <p className="mt-1 text-gray-600">
          Enter the product information.
        </p>
      </div>

      {submitError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {submitError}
        </div>
      )}

      <ProductForm
        onSubmit={handleCreateProduct}
        submitText="Create Product"
      />
    </section>
  )
}

export default AddProductPage
