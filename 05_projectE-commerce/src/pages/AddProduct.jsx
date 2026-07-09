import { ArrowLeft, Save } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'

const initialForm = {
  title: '',
  price: '',
  category: '',
  description: '',
  image: '',
  stock: '',
}

export default function AddProduct() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      }
      const createdProduct = await productService.createProduct(payload)
      navigate(`/products/${createdProduct.id}`)
    } catch (err) {
      setError(err.message || 'Could not create product')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/products" className="btn-secondary gap-2">
        <ArrowLeft size={16} /> Back to products
      </Link>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Add Product</h2>
          <p className="text-sm text-slate-500">Controlled components form with React state.</p>
        </div>

        {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Title</span>
            <input required name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="Laptop" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Price</span>
            <input required min="0" name="price" value={form.price} onChange={handleChange} type="number" className="input-field" placeholder="1200" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Category</span>
            <input required name="category" value={form.category} onChange={handleChange} className="input-field" placeholder="Tech" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Stock</span>
            <input required min="0" name="stock" value={form.stock} onChange={handleChange} type="number" className="input-field" placeholder="10" />
          </label>
        </div>

        <label className="space-y-2 block">
          <span className="text-sm font-semibold text-slate-700">Image URL</span>
          <input required name="image" value={form.image} onChange={handleChange} className="input-field" placeholder="https://example.com/image.jpg" />
        </label>

        <label className="space-y-2 block">
          <span className="text-sm font-semibold text-slate-700">Description</span>
          <textarea required name="description" value={form.description} onChange={handleChange} className="input-field min-h-32" placeholder="Write product description..." />
        </label>

        <button disabled={submitting} className="btn-primary gap-2" type="submit">
          <Save size={16} /> {submitting ? 'Saving...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}
