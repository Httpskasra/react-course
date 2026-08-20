import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

import ProductForm from '../components/Form/ProductForm'
import { productService } from '../services/productService'

function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setLoadError('')

        const productData =
          await productService.getProductById(id)

        setProduct(productData)
      } catch (error) {
        console.error(error)
        setLoadError('Could not load the product.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const handleUpdateProduct = async (productData) => {
    try {
      setSubmitError('')

      await productService.updateProduct(id, productData)

      navigate(`/products/${id}`)
    } catch (error) {
      console.error(error)

      setSubmitError(
        error.response?.data?.message ||
        'Could not update the product.'
      )
    }
  }

  if (loading) {
    return <Loading />
  }

  if (loadError) {
    return <ErrorMessage message={loadError} />
  }

  if (!product) {
    return (
      <ErrorMessage message="Product was not found." />
    )
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Product
        </h1>

        <p className="mt-1 text-gray-600">
          Update the product information.
        </p>
      </div>

      {submitError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {submitError}
        </div>
      )}

      <ProductForm
        initialValues={product}
        onSubmit={handleUpdateProduct}
        submitText="Update Product"
      />
    </section>
  )
}

export default EditProductPage
