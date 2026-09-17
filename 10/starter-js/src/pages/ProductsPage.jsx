import { useEffect, useState } from 'react'
import { getProducts } from '../api/products.api'
import ProductCard from '../components/ProductCard'
import SearchBox from '../components/SearchBox'
import CategoryFilter from '../components/CategoryFilter'

export default function ProductsPage({ onAddToCart }) {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    async function load() {
      try { setLoading(true); setError(''); const result = await getProducts(search, category); if (!ignore) setProducts(result.data) }
      catch (error) { if (!ignore) setError(error.message) }
      finally { if (!ignore) setLoading(false) }
    }
    load(); return () => { ignore = true }
  }, [search, category])

  return <section><div className="hero"><div><p className="eyebrow">JS → TSX workshop</p><h1>Products</h1></div></div>
    <div className="toolbar"><SearchBox value={search} onChange={setSearch} /><CategoryFilter value={category} onChange={setCategory} /></div>
    {loading && <div className="state">Loading...</div>}{error && <div className="state error">{error}</div>}
    <div className="grid">{products.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />)}</div>
  </section>
}
