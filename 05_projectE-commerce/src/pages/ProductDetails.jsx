import { ArrowLeft, Pencil } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import useFetch from '../hooks/useFetch'
import { productService } from '../services/productService'

export default function ProductDetails() {
  const { id } = useParams()
  const { data: product, loading, error, refetch } = useFetch(() => productService.getProductById(id), [id])

  if (loading) return <Loading text="Loading product details..." />
  if (error) return <ErrorMessage message={error} onRetry={refetch} />
  if (!product) return <EmptyState title="Product not found" />

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link to="/products" className="btn-secondary gap-2">
          <ArrowLeft size={16} /> Back
        </Link>
        <Link to={`/products/${product.id}/edit`} className="btn-primary gap-2">
          <Pencil size={16} /> Edit Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <img src={product.image} alt={product.title} className="h-80 w-full object-cover" />
        <div className="grid gap-8 p-6 lg:grid-cols-3 lg:p-8">
          <div className="lg:col-span-2">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">{product.category}</span>
            <h1 className="mt-4 text-3xl font-bold text-slate-900">{product.title}</h1>
            <p className="mt-4 leading-7 text-slate-600">{product.description}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Price</p>
            <p className="mt-1 text-4xl font-bold text-slate-900">${product.price}</p>
            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-sm font-medium text-slate-500">Available Stock</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{product.stock}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
