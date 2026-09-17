import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct } from '../api/products.api'
export default function ProductDetailsPage({ onAddToCart }) {
  const { id } = useParams(); const [product, setProduct] = useState(null); const [error, setError] = useState('')
  useEffect(() => { getProduct(id).then(r => setProduct(r.data)).catch(e => setError(e.message)) }, [id])
  if (error) return <div className="state error">{error}</div>; if (!product) return <div className="state">Loading...</div>
  return <div className="detail"><img src={product.image} alt={product.title}/><div><span className="pill">{product.category}</span><h1>{product.title}</h1><p>{product.description}</p><h2>${product.price}</h2><p>Stock: {product.stock}</p><div className="actions"><button onClick={() => onAddToCart(product)}>Add to cart</button><Link className="button secondary" to={`/products/${product.id}/edit`}>Edit</Link></div></div></div>
}
