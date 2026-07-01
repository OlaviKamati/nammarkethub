import { useAuth } from '../hooks/useAuth'
import { useMyShop } from '../hooks/useMyShop'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AuthForm from '../components/AuthForm'
import ShopForm from '../components/ShopForm'
import ShopDashboard from '../components/ShopDashboard'
import { getShopType } from '../lib/shopTypes'

export default function Sell() {
  const { user, loading: authLoading } = useAuth()
  const { shop, loading: shopLoading, refetch } = useMyShop(user?.id)

  if (authLoading || shopLoading) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center', color: 'var(--white-dim)', fontSize: 14 }}>Loading…</div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 440, margin: '0 auto', padding: '60px 24px' }} className="page-enter">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 className="gold-shimmer" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>List your shop</h1>
            <p style={{ color: 'var(--white-dim)', fontSize: 14 }}>Reach buyers across Namibia on NamMarketHub</p>
          </div>
          <AuthForm />
        </div>
      </>
    )
  }

  if (!shop) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 440, margin: '0 auto', padding: '60px 24px' }} className="page-enter">
          <ShopForm userId={user.id} onCreated={refetch} />
        </div>
      </>
    )
  }

  const type = getShopType(shop.shop_type)

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }} className="page-enter">
        {/* Shop header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, var(--gold-dark), #1A1500)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              {type.emoji}
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--white)', marginBottom: 2 }}>{shop.name}</h1>
              <p style={{ fontSize: 12, color: 'var(--white-dim)', fontFamily: 'ui-monospace, monospace' }}>{shop.location} · {type.label}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/" style={{ fontSize: 13, color: 'var(--white-dim)', textDecoration: 'none', padding: '7px 16px', border: '1px solid var(--black-border)', borderRadius: 99, transition: 'border-color 0.2s' }}>
              ← Marketplace
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="btn-outline"
              style={{ fontSize: 13, padding: '7px 16px' }}
            >
              Log out
            </button>
          </div>
        </div>

        <ShopDashboard shop={shop} />
      </div>
    </>
  )
}
