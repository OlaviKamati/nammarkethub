import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Home, Store } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useMyShop } from '../hooks/useMyShop'
import { useCart } from '../hooks/useCart'

export default function Navbar() {
  const { user } = useAuth()
  const { shop } = useMyShop(user?.id)
  const { itemCount } = useCart()
  const location = useLocation()
  const onSell = location.pathname === '/sell'
  const onAccount = location.pathname === '/account'
  const onHome = location.pathname === '/'
  const onCart = location.pathname === '/cart'

  return (
    <>
      <nav className="glass-nav sticky top-0 z-50">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.svg" alt="NamMarketHub" style={{ height: 36 }} />
          </Link>

          {/* Right side — hidden on mobile, replaced by the fixed bottom tab bar */}
          <div className="desktop-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Live indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} className="pulse-dot" />
              LIVE
            </div>

            {/* Cart icon */}
            <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 10, border: '1px solid var(--black-border)', textDecoration: 'none', color: 'var(--white)' }}>
              <ShoppingCart size={16} strokeWidth={1.75} />
              {itemCount > 0 && (
                <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--gold)', color: 'var(--black)', fontSize: 10, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Account icon */}
            <Link
              to="/account"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 10,
                textDecoration: 'none',
                border: onAccount ? 'none' : '1px solid var(--black-border)',
                background: onAccount ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' : 'transparent',
                color: onAccount ? 'var(--black)' : 'var(--white)',
              }}
            >
              <User size={16} strokeWidth={1.75} />
            </Link>

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
              {shop ? 'My Shop' : 'List your shop'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab bar — hidden by default, shown under the mobile breakpoint via CSS */}
      <div className="mobile-tab-bar">
        <Link to="/" className={onHome ? 'active' : ''}>
          <Home size={20} strokeWidth={1.75} />
          Home
        </Link>
        <Link to="/cart" className={onCart ? 'active' : ''} style={{ position: 'relative' }}>
          <ShoppingCart size={20} strokeWidth={1.75} />
          Cart
          {itemCount > 0 && (
            <span style={{ position: 'absolute', top: 2, right: '28%', background: 'var(--gold)', color: 'var(--black)', fontSize: 9, fontWeight: 700, width: 14, height: 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </Link>
        <Link to="/sell" className={onSell ? 'active' : ''}>
          <Store size={20} strokeWidth={1.75} />
          {shop ? 'My Shop' : 'Sell'}
        </Link>
        <Link to="/account" className={onAccount ? 'active' : ''}>
          <User size={20} strokeWidth={1.75} />
          Account
        </Link>
      </div>
    </>
  )
}
