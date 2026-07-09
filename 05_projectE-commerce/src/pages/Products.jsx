import { Grid2X2, List, Search } from 'lucide-react'
import { useCallback, useState } from 'react'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import ProductCard from '../components/ProductCard'
import ProductTable from '../components/ProductTable'
import useDebounce from '../hooks/useDebounce'
import useFetch from '../hooks/useFetch'
import { productService } from '../services/productService'

export default function Products() {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('table')
  const debouncedSearch = useDebounce(search, 500)

  const fetchProducts = useCallback(() => productService.getAllProducts(debouncedSearch), [debouncedSearch])
  const { data: products, loading, error, refetch, setData } = useFetch(fetchProducts, [fetchProducts])

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?')
    if (!confirmed) return

    await productService.deleteProduct(id)
    setData((currentProducts) => currentProducts.filter((product) => product.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Products</h2>
          <p className="text-sm text-slate-500">Search, view, edit, and delete store products.</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('table')} className={`btn-secondary px-3 ${viewMode === 'table' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : ''}`}>
            <List size={18} />
          </button>
          <button onClick={() => setViewMode('grid')} className={`btn-secondary px-3 ${viewMode === 'grid' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : ''}`}>
            <Grid2X2 size={18} />
          </button>
        </div>
      </div>

      <div className="card flex items-center gap-3 p-3">
        <Search size={20} className="text-slate-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products by title, category, or description..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {loading && <Loading text="Loading products..." />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && !error && products?.length === 0 && (
        <EmptyState title="No products found" description="Try another search keyword or add a new product." />
      )}
      {!loading && !error && products?.length > 0 && (
        viewMode === 'table' ? (
          <ProductTable products={products} onDelete={handleDelete} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => <ProductCard key={product.id} product={product} onDelete={handleDelete} />)}
          </div>
        )
      )}
    </div>
  )
}
