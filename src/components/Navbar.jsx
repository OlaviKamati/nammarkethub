import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user } = useAuth()
  const location = useLocation()
  const onSell = location.pathname === '/sell'

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.svg" alt="NamMarketHub" style={{ height: 36 }} />
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} className="pulse-dot" />
            LIVE
          </div>

          <Link
            to="/sell"
            style={{
              fontSize: 13,
              fontWeight: 600,
              padding: '7px 18px',
              borderRadius: 99,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              ...(onSell
                ? { background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)', color: 'var(--black)' }
                : { border: '1px solid var(--gold-dark)', color: 'var(--gold)' })
            }}
          >
            {user ? 'My Shop' : 'List your shop'}
          </Link>
        </div>
      </div>
    </nav>
  )
}
