import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Heart, User, ShoppingCart, Check, TrendingDown, FileText, Link2, Sun, Moon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useMyOrders } from '../hooks/useMyOrders'
import { useWishlist } from '../hooks/useWishlist'
import { useProfile } from '../hooks/useProfile'
import { useCurrency } from '../hooks/useCurrency'
import { useTheme } from '../hooks/useTheme'
import { CURRENCIES } from '../lib/currency'
import Navbar from '../components/Navbar'
import AuthForm from '../components/AuthForm'
import ProductCard from '../components/ProductCard'
import ProfileSettingsForm from '../components/ProfileSettingsForm'
import EmptyState from '../components/EmptyState'
import Footer from '../components/Footer'
import LaybyProgressBar from '../components/LaybyProgressBar'
import OrderSummaryModal from '../components/OrderSummaryModal'

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
  const { format } = useCurrency()
  const [products, setProducts] = useState([])
  const [priceAtAdd, setPriceAtAdd] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wishlistLoading) return
    const ids = Array.from(productIds)
    if (ids.length === 0) { setProducts([]); setLoading(false); return }
    Promise.all([
      supabase
        .from('products')
        .select('id, name, description, price, original_price, is_featured, photo_url, stock_count, category_id, created_at, shops(id, name, location, shop_type, is_verified)')
        .in('id', ids)
        .eq('is_active', true),
      supabase.from('wishlist_items').select('product_id, price_at_add').eq('buyer_id', userId).in('product_id', ids),
    ]).then(([{ data: productsData }, { data: wishlistRows }]) => {
      setProducts(productsData ?? [])
      setPriceAtAdd(Object.fromEntries((wishlistRows ?? []).map((r) => [r.product_id, r.price_at_add])))
      setLoading(false)
    })
  }, [wishlistLoading, productIds, userId])

  if (loading) return <p style={{ fontSize: 13, color: 'var(--white-dim)' }}>Loading…</p>

  if (products.length === 0) {
    return (
      <EmptyState
        compact
        variant="basket"
        title="No saved products yet"
        description="Tap the heart on any product to save it here for later."
      />
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
      {products.map((p) => {
        const savedAt = priceAtAdd[p.id]
        const droppedPrice = savedAt != null && Number(p.price) < Number(savedAt)
        return (
          <div key={p.id}>
            {droppedPrice && (
              <p style={{ fontSize: 11, color: 'var(--gold)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingDown size={12} strokeWidth={2} /> Dropped from {format(savedAt)}
              </p>
            )}
            <ProductCard product={p} />
          </div>
        )
      })}
    </div>
  )
}

function OrdersTab({ userId }) {
  const { orders, loading } = useMyOrders(userId)
  const [summaryOrder, setSummaryOrder] = useState(null)

  if (loading) return <p style={{ fontSize: 13, color: 'var(--white-dim)' }}>Loading…</p>

  return (
    <div>
      <p style={{ fontSize: 12, color: 'var(--white-dim)', marginBottom: 16 }}>
        Only requests placed while logged in appear here.
      </p>
      {orders.length === 0 ? (
        <EmptyState
          compact
          variant="basket"
          title="No orders yet"
          description="Requests you send to shops will show up here once you're logged in."
          actionLabel="Browse products"
          actionTo="/"
        />
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
              {o.deposit_paid != null && (
                <div style={{ marginTop: 10 }}>
                  <LaybyProgressBar compact paid={o.deposit_paid} total={Number(o.products?.price ?? 0) * o.quantity} />
                </div>
              )}
              <button
                onClick={() => setSummaryOrder(o)}
                style={{ fontSize: 11, color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <FileText size={11} strokeWidth={1.75} /> View order summary
              </button>
            </div>
          ))}
        </div>
      )}

      {summaryOrder && <OrderSummaryModal order={summaryOrder} onClose={() => setSummaryOrder(null)} />}
    </div>
  )
}

function PreferencesTab({ userId }) {
  const { currency, setCurrency } = useCurrency()
  const { theme, setTheme } = useTheme()
  const [copied, setCopied] = useState(false)
  const referralLink = `${window.location.origin}/?ref=${userId}`

  async function handleCopyLink() {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 16, padding: 20, maxWidth: 420 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>Appearance</p>
        <p style={{ fontSize: 12, color: 'var(--white-dim)', marginBottom: 14, lineHeight: 1.5 }}>
          Switch between dark and light.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['dark', Moon, 'Dark'], ['light', Sun, 'Light']].map(([val, Icon, label]) => (
            <button
              key={val}
              onClick={() => setTheme(val)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontSize: 13, padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                border: theme === val ? '1px solid var(--gold-dark)' : '1px solid var(--black-border)',
                background: theme === val ? 'rgba(201,168,76,0.1)' : 'transparent',
                color: theme === val ? 'var(--gold)' : 'var(--white-dim)',
              }}
            >
              <Icon size={14} strokeWidth={1.75} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 16, padding: 20, maxWidth: 420 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>Display currency</p>
        <p style={{ fontSize: 12, color: 'var(--white-dim)', marginBottom: 14, lineHeight: 1.5 }}>
          Changes how prices are shown while browsing. Shops still arrange payment directly with you in N$ or R.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.values(CURRENCIES).map((c) => (
            <button
              key={c.code}
              onClick={() => setCurrency(c.code)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left',
                fontSize: 13, padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                border: currency === c.code ? '1px solid var(--gold-dark)' : '1px solid var(--black-border)',
                background: currency === c.code ? 'rgba(201,168,76,0.1)' : 'transparent',
                color: currency === c.code ? 'var(--gold)' : 'var(--white-dim)',
              }}
            >
              {c.label}
              {currency === c.code && <Check size={14} strokeWidth={2} />}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 16, padding: 20, maxWidth: 420 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>Invite a friend</p>
        <p style={{ fontSize: 12, color: 'var(--white-dim)', marginBottom: 14, lineHeight: 1.5 }}>
          Share NamMarketHub with someone who'd like it.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input readOnly value={referralLink} className="input-dark" style={{ flex: 1, padding: '10px 14px', fontSize: 12 }} onFocus={(e) => e.target.select()} />
          <button onClick={handleCopyLink} className="btn-outline" style={{ fontSize: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            {copied ? <Check size={13} strokeWidth={2} /> : <Link2 size={13} strokeWidth={1.75} />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}

const GATE_MESSAGES = {
  'cart-limit': { icon: ShoppingCart, text: "You've added 3 items to your cart — create a free account to keep going." },
  wishlist: { icon: Heart, text: 'Sign up to save products to your wishlist.' },
}

export default function Account() {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading, refetch: refetchProfile } = useProfile(user?.id)
  const location = useLocation()
  const [tab, setTab] = useState('orders')
  const gate = GATE_MESSAGES[location.state?.reason]

  // Nudge new accounts to set a username instead of quietly showing their email everywhere
  useEffect(() => {
    if (!profileLoading && !profile) setTab('profile')
  }, [profileLoading, profile])

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
            <h1 className="gold-shimmer font-display" style={{ fontSize: 28, marginBottom: 8 }}>Your account</h1>
            <p style={{ color: 'var(--white-dim)', fontSize: 14 }}>Sign in to track your orders and wishlist</p>
          </div>
          {gate && (
            <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 14, padding: '14px 16px', marginBottom: 24, textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <gate.icon size={15} strokeWidth={1.75} /> {gate.text}
              </p>
            </div>
          )}
          <AuthForm />
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }} className="page-enter">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: 'var(--black-card)', border: '1px solid var(--black-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={20} strokeWidth={1.75} color="var(--white-dim)" />}
            </div>
            <div>
              <h1 className="font-display" style={{ fontSize: 20, color: 'var(--white)', marginBottom: 2 }}>
                {profile?.username ? `@${profile.username}` : 'Your account'}
              </h1>
              <p style={{ fontSize: 12, color: 'var(--white-dim)' }}>
                {profile?.full_name ? `${profile.full_name} · ` : ''}{user.email}
              </p>
            </div>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="btn-outline" style={{ fontSize: 13, padding: '7px 16px' }}>
            Log out
          </button>
        </div>

        <div style={{ display: 'flex', gap: 4, background: 'var(--black-card)', borderRadius: 14, padding: 4, width: 'fit-content', marginBottom: 24, border: '1px solid var(--black-border)' }}>
          {[['orders', 'Orders'], ['wishlist', 'Wishlist'], ['profile', 'Profile'], ['preferences', 'Preferences']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)}
              style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: tab === val ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'transparent',
                color: tab === val ? 'var(--black)' : 'var(--white-dim)' }}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'orders' && <OrdersTab userId={user.id} />}
        {tab === 'wishlist' && <WishlistTab userId={user.id} />}
        {tab === 'profile' && <ProfileSettingsForm userId={user.id} profile={profile} onSaved={refetchProfile} />}
        {tab === 'preferences' && <PreferencesTab userId={user.id} />}

        <Footer />
      </div>
    </>
  )
}
