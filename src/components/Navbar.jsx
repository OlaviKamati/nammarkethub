import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user } = useAuth()
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span className="font-semibold text-stone-900 tracking-tight">NamMarketHub</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot inline-block" />
            Live
          </div>

          <Link
            to="/sell"
            className={
              'text-sm px-4 py-1.5 rounded-full transition-colors ' +
              (location.pathname === '/sell'
                ? 'bg-stone-900 text-white'
                : 'border border-stone-200 text-stone-700 hover:border-stone-300')
            }
          >
            {user ? 'My Shop' : 'List your shop'}
          </Link>
        </div>
      </div>
    </nav>
  )
}
