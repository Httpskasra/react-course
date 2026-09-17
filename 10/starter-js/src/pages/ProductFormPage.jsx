import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProduct, getProduct, updateProduct } from '../api/products.api'
const empty = { title: '', description: '', price: 0, category: 'electronics', image: 'https://picsum.photos/seed/new/640/420', stock: 0 }
export default function ProductFormPage() {
  const { id } = useParams(); const navigate = useNavigate(); const [form, setForm] = useState(empty); const [error, setError] = useState('')
  useEffect(() => { if (id) getProduct(id).then(r => setForm(r.data)).catch(e => setError(e.message)) }, [id])
  function change(event) { const { name, value } = event.target; setForm(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value })) }
  async function submit(event) { event.preventDefault(); try { if (id) await updateProduct(id, form); else await createProduct(form); navigate('/') } catch (e) { setError(e.message) } }
  return <form className="form" onSubmit={submit}><h1>{id ? 'Edit product' : 'Add product'}</h1>{error && <div className="state error">{error}</div>}
    <label>Title<input className="input" name="title" value={form.title} onChange={change}/></label><label>Description<textarea className="input" name="description" value={form.description} onChange={change}/></label><label>Price<input className="input" type="number" name="price" value={form.price} onChange={change}/></label><label>Stock<input className="input" type="number" name="stock" value={form.stock} onChange={change}/></label><label>Category<select className="input" name="category" value={form.category} onChange={change}><option value="electronics">Electronics</option><option value="clothing">Clothing</option><option value="books">Books</option><option value="home">Home</option></select></label><label>Image URL<input className="input" name="image" value={form.image} onChange={change}/></label><button>Save</button>
  </form>
}
