import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Image</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Title</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Price</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Category</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Stock</th>
              <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <img src={product.image} alt={product.title} className="h-14 w-14 rounded-xl object-cover" />
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">{product.title}</p>
                  <p className="max-w-xs truncate text-sm text-slate-500">{product.description}</p>
                </td>
                <td className="px-5 py-4 font-bold text-slate-900">${product.price}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{product.category}</span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{product.stock}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link to={`/products/${product.id}`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                      <Eye size={18} />
                    </Link>
                    <Link to={`/products/${product.id}/edit`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-700">
                      <Pencil size={18} />
                    </Link>
                    <button onClick={() => onDelete(product.id)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
