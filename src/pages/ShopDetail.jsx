import { useParams, useNavigate, Link } from 'react-router-dom'
import { useShop } from '../hooks/useShop'
import { getShopType } from '../lib/shopTypes'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'

export default function ShopDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { shop, products, loading, error } = useShop(id)

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 800, margin: '60px auto', textAlign: 'center', color: 'var(--white-dim)', fontSize: 14 }}>Loading…</div>
      </>
    )
  }

  if (error || !shop) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 800, margin: '60px auto', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontSize: 14, marginBottom: 16 }}>Shop not found.</p>
          <Link to="/" style={{ color: 'var(--gold)', fontSize: 14 }}>Back to marketplace</Link>
        </div>
      </>
    )
  }

  const type = getShopType(shop.shop_type)

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }} className="page-enter">
        <button
          onClick={() => navigate(-1)}
          style={{ fontSize: 13, color: 'var(--white-dim)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          ← Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, var(--gold-dark), #1A1500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, border: '1px solid rgba(201,168,76,0.2)', flexShrink: 0, overflow: 'hidden' }}>
            {shop.logo_url ? (
              <img src={shop.logo_url} alt={shop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : type.emoji}
          </div>
          <div>
            <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>
              {shop.name}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--white-dim)' }}>{shop.location} · {type.label}</p>
          </div>
        </div>

        {shop.description && (
          <p style={{ fontSize: 14, color: 'var(--white-dim)', lineHeight: 1.6, maxWidth: 640, marginBottom: 16 }}>{shop.description}</p>
        )}

        {shop.whatsapp_number && (
          <a
            href={`https://wa.me/${shop.whatsapp_number.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gold)', textDecoration: 'none', padding: '6px 14px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 99, background: 'rgba(201,168,76,0.08)', marginBottom: 24 }}
          >
            💬 WhatsApp the shop
          </a>
        )}

        <div className="gold-divider" style={{ marginBottom: 28, marginTop: shop.whatsapp_number ? 0 : 16 }} />

        <p style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
          {products.length} listing{products.length !== 1 ? 's' : ''}
        </p>

        {products.length === 0 ? (
          <p style={{ color: 'var(--white-dim)', fontSize: 14, padding: '32px 0' }}>This shop has no listings yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
