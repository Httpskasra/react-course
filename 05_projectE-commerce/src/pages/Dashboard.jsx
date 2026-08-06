import { AlertCircle, Boxes, DollarSign, Tags } from 'lucide-react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import useFetch from '../hooks/useFetch'
import { productService } from '../services/productService'

export default function Dashboard() {
  const { data: products, loading, error, refetch } = useFetch(() => productService.getAllProducts(), [])

  if (loading) return <Loading text="Loading dashboard..." />
  if (error) return <ErrorMessage message={error} onRetry={refetch} />
  if (!products || products.length === 0) return <EmptyState title="No products yet" description="Add your first product to see dashboard statistics." />

  const categories = [...new Set(products.map((product) => product.category))]
  const lowStockProducts = products.filter((product) => Number(product.stock) <= 5)
  const totalValue = products.reduce((sum, product) => sum + Number(product.price) * Number(product.stock || 0), 0)
  const recentProducts = products.slice(-4).reverse()


  
  const stats = [
    { title: 'Total Products', value: products.length, icon: Boxes, color: 'bg-indigo-50 text-indigo-700' },
    { title: 'Total Categories', value: categories.length, icon: Tags, color: 'bg-emerald-50 text-emerald-700' },
    { title: 'Low Stock Products', value: lowStockProducts.length, icon: AlertCircle, color: 'bg-orange-50 text-orange-700' },
    { title: 'Inventory Value', value: `$${totalValue.toLocaleString()}`, icon: DollarSign, color: 'bg-sky-50 text-sky-700' },
  ]

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`rounded-2xl p-3 ${stat.color}`}>
                  <Icon size={26} />
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="card xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Products</h3>
              <p className="text-sm text-slate-500">Latest products added to the store.</p>
            </div>
            <Link to="/products" className="btn-secondary">View all</Link>
          </div>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 transition hover:border-indigo-100 hover:bg-indigo-50/40">
                <img src={product.image} alt={product.title} className="h-16 w-16 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-semibold text-slate-900">{product.title}</h4>
                  <p className="text-sm text-slate-500">{product.category}</p>
                </div>
                <p className="font-bold text-slate-900">${product.price}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-slate-900">Low Stock</h3>
          <p className="text-sm text-slate-500">Products that need attention.</p>
          <div className="mt-5 space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">All products have enough stock.</p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="rounded-xl bg-orange-50 p-4">
                  <p className="font-semibold text-orange-900">{product.title}</p>
                  <p className="text-sm text-orange-700">Only {product.stock} left in stock</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
