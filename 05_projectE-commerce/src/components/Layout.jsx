import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Navbar />
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>زی 
    </div>
  )
}
