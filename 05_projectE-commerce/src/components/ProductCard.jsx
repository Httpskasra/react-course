import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, onDelete }) {
  return (
    <article className="card overflow-hidden p-0">
      <img src={product.image} alt={product.title} className="h-48 w-full object-cover" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">{product.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{product.category}</p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700">${product.price}</span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-slate-500">{product.description}</p>
        <div className="mt-5 flex items-center gap-2">
          <Link to={`/products/${product.id}`} className="btn-secondary flex-1 gap-2">
            <Eye size={16} /> View
          </Link>
          <Link to={`/products/${product.id}/edit`} className="btn-secondary px-3">
            <Pencil size={16} />
          </Link>
          <button onClick={() => onDelete(product.id)} className="btn-secondary px-3 text-red-600 hover:bg-red-50">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}
