import { LogIn, LogOut, Menu, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, login, logout } = useAuth()

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden">
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Admin Dashboard</h2>
            <p className="text-sm text-slate-500">Manage your products, inventory, and store data.</p>
          </div>
        </div>

        <div className="hidden min-w-72 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search size={18} className="text-slate-400" />
          <span className="text-sm text-slate-400">Search is available on products page</span>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/products/add" className="btn-primary hidden sm:inline-flex">
                Add Product
              </Link>
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <button onClick={logout} className="btn-secondary gap-2">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <button onClick={login} className="btn-primary gap-2">
              <LogIn size={16} />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
