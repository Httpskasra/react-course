import { LayoutDashboard, Package, PlusCircle, ShoppingBag } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/products/add', label: 'Add Product', icon: PlusCircle },
]

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white px-5 py-6 lg:block">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
          <ShoppingBag size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Shop Admin</h1>
          <p className="text-xs text-slate-500">Mini E-Commerce</p>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon size={20} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
