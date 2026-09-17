import { Link, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import ProductsPage from './pages/ProductsPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import ProductFormPage from './pages/ProductFormPage'
import CartPage from './pages/CartPage'

export default function App() {
  const [cart, setCart] = useState([])

  function addToCart(product) {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id)
      if (exists) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      return [...prev, { product, quantity: 1 }]
    })
  }

  return <>
    <header className="nav"><Link to="/">Mini Commerce</Link><nav><Link to="/">Products</Link><Link to="/products/new">Add</Link><Link to="/cart">Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})</Link></nav></header>
    <main className="container">
      <Routes>
        <Route path="/" element={<ProductsPage onAddToCart={addToCart} />} />
        <Route path="/products/new" element={<ProductFormPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage onAddToCart={addToCart} />} />
        <Route path="/products/:id/edit" element={<ProductFormPage />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
      </Routes>
    </main>
  </>
}
