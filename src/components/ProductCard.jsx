import { useNavigate } from 'react-router-dom'
import { getShopType } from '../lib/shopTypes'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const shopName = product.shops?.name ?? 'Unknown shop'
  const shopType = getShopType(product.shops?.shop_type)
  const priceFormatted = Number(product.price).toLocaleString('en-NA', { minimumFractionDigits: 0 })
  const inStock = product.stock_count > 0

  return (
    <button
      onClick={() => navigate(`/product/${product.id}`)}
      className="card"
      style={{ textAlign: 'left', width: '100%', padding: 0, overflow: 'hidden', cursor: 'pointer' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1', background: '#0D0D0D', overflow: 'hidden' }}>
        {product.photo_url ? (
          <img
            src={product.photo_url}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s var(--ease-expo)' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, background: 'linear-gradient(135deg, #111 0%, #1A1500 100%)' }}>
            {shopType.emoji}
          </div>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="tag" style={{ color: 'var(--white-dim)', border: '1px solid var(--black-border)', padding: '4px 10px', borderRadius: 99 }}>Out of stock</span>
          </div>
        )}

        {/* Category badge */}
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <span style={{ fontSize: 10, background: 'rgba(10,10,10,0.7)', color: 'var(--gold)', padding: '2px 8px', borderRadius: 99, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em', textTransform: 'uppercase', border: '1px solid rgba(201,168,76,0.2)' }}>
            {product.category_id}
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', lineHeight: 1.3, marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </p>
        <p style={{ fontSize: 11, color: 'var(--white-dim)', marginBottom: 10 }}>{shopName}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="gold-text" style={{ fontSize: 15, fontWeight: 700 }}>N${priceFormatted}</span>
          {inStock && (
            <span className="tag" style={{ color: 'var(--gold-dark)', background: 'rgba(201,168,76,0.08)', padding: '2px 7px', borderRadius: 6, border: '1px solid rgba(201,168,76,0.15)' }}>
              {product.stock_count} left
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
