import { Link } from 'react-router-dom'
export default function ProductCard({ product, onAddToCart }) {
  return <article className="card">
    <img src={product.image} alt={product.title} />
    <div className="card-body"><span className="pill">{product.category}</span><h3>{product.title}</h3><p>{product.description}</p><strong>${product.price}</strong>
      <div className="actions"><Link className="button secondary" to={`/products/${product.id}`}>Details</Link><button onClick={() => onAddToCart(product)}>Add to cart</button></div>
    </div>
  </article>
}
