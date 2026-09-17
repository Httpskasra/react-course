export default function CartPage({ cart, setCart }) {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  function change(id, delta) { setCart(prev => prev.map(item => item.product.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)) }
  return <section><h1>Cart</h1>{cart.length === 0 && <div className="state">Your cart is empty.</div>}{cart.map(item => <div className="cart-row" key={item.product.id}><div><strong>{item.product.title}</strong><div>${item.product.price}</div></div><div className="actions"><button onClick={() => change(item.product.id, -1)}>-</button><span>{item.quantity}</span><button onClick={() => change(item.product.id, 1)}>+</button></div></div>)}<h2>Total: ${total.toFixed(2)}</h2></section>
}
