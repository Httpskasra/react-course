import { NavLink, Route, Routes } from 'react-router-dom'
import PaginationPage from './pages/PaginationPage'
import InfiniteScrollPage from './pages/InfiniteScrollPage'
import AdvancedSearchPage from './pages/AdvancedSearchPage'

const links = [
  ['/', 'Pagination'],
  ['/infinite-scroll', 'Infinite Scroll'],
  ['/advanced-search', 'Advanced Search'],
]

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-black">React Data Explorer</h1>
            <p className="text-sm text-slate-400">
              Pagination • Infinite Scroll • Advanced Search
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? 'bg-white text-slate-950'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Routes>
          <Route path="/" element={<PaginationPage />} />
          <Route path="/infinite-scroll" element={<InfiniteScrollPage />} />
          <Route path="/advanced-search" element={<AdvancedSearchPage />} />
        </Routes>
      </main>
    </div>
  )
}
