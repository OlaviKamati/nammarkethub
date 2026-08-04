import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useMyOrders } from '../hooks/useMyOrders'
import { useWishlist } from '../hooks/useWishlist'
import Navbar from '../components/Navbar'
import AuthForm from '../components/AuthForm'
import ProductCard from '../components/ProductCard'

const STATUS_LABEL = {
  pending: 'Pending', attending: 'Attending', in_progress: 'In Progress',
  completed: 'Resolved', cancelled: 'Cancelled',
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'today'
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-NA', { month: 'short', year: 'numeric' })
}

function WishlistTab({ userId }) {
  const { productIds, loading: wishlistLoading } = useWishlist(userId)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wishlistLoading) return
    const ids = Array.from(productIds)
    if (ids.length === 0) { setProducts([]); setLoading(false); return }
    supabase
      .from('products')
      .select('id, name, description, price, photo_url, stock_count, category_id, shops(id, name, location, shop_type)')
      .in('id', ids)
      .eq('is_active', true)
      .then(({ data }) => { setProducts(data ?? []); setLoading(false) })
  }, [wishlistLoading, productIds])

  if (loading) return <p style={{ fontSize: 13, color: 'var(--white-dim)' }}>Loading…</p>

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <p style={{ fontSize: 28, marginBottom: 10 }}>♡</p>
        <p style={{ fontSize: 14, color: 'var(--white-dim)' }}>No saved products yet.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}

function OrdersTab({ userId }) {
  const { orders, loading } = useMyOrders(userId)

  if (loading) return <p style={{ fontSize: 13, color: 'var(--white-dim)' }}>Loading…</p>

  return (
    <div>
      <p style={{ fontSize: 12, color: 'var(--white-dim)', marginBottom: 16 }}>
        Only requests placed while logged in appear here.
      </p>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ fontSize: 28, marginBottom: 10 }}>📦</p>
          <p style={{ fontSize: 14, color: 'var(--white-dim)' }}>No orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {orders.map((o) => (
            <div key={o.id} style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="tag" style={{ color: 'var(--gold)', background: 'rgba(201,168,76,0.1)', padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(201,168,76,0.2)' }}>
                  {STATUS_LABEL[o.status] ?? o.status}
                </span>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)' }}>{o.products?.name ?? 'Product'}</p>
              </div>
              <p style={{ fontSize: 12, color: 'var(--white-dim)' }}>
                {o.products?.shops?.name} · qty {o.quantity} · {timeAgo(o.created_at)}
              </p>
              {o.selected_options && Object.keys(o.selected_options).length > 0 && (
                <p style={{ fontSize: 11, color: 'var(--white-dim)', marginTop: 2 }}>
                  {Object.entries(o.selected_options).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Account() {
  const { user, loading: authLoading } = useAuth()
  const [tab, setTab] = useState('orders')

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 440, margin: '80px auto', textAlign: 'center', color: 'var(--white-dim)', fontSize: 14 }}>Loading…</div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 440, margin: '0 auto', padding: '60px 24px' }} className="page-enter">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 className="gold-shimmer" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Your account</h1>
            <p style={{ color: 'var(--white-dim)', fontSize: 14 }}>Sign in to track your orders and wishlist</p>
          </div>
          <AuthForm />
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }} className="page-enter">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--white)', marginBottom: 2 }}>Your account</h1>
            <p style={{ fontSize: 12, color: 'var(--white-dim)' }}>{user.email}</p>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="btn-outline" style={{ fontSize: 13, padding: '7px 16px' }}>
            Log out
          </button>
        </div>

        <div style={{ display: 'flex', gap: 4, background: 'var(--black-card)', borderRadius: 14, padding: 4, width: 'fit-content', marginBottom: 24, border: '1px solid var(--black-border)' }}>
          {[['orders', 'Orders'], ['wishlist', 'Wishlist']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)}
              style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: tab === val ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'transparent',
                color: tab === val ? 'var(--black)' : 'var(--white-dim)' }}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'orders' ? <OrdersTab userId={user.id} /> : <WishlistTab userId={user.id} />}
      </div>
    </>
  )
}
