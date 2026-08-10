import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Eye, Sparkles } from 'lucide-react'
import { getShopType } from '../lib/shopTypes'
import { useCurrency } from '../hooks/useCurrency'
import WishlistButton from './WishlistButton'
import QuickViewModal from './QuickViewModal'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { format } = useCurrency()
  const [quickView, setQuickView] = useState(false)
  const shopName = product.shops?.name ?? 'Unknown shop'
  const shopType = getShopType(product.shops?.shop_type)
  const inStock = product.stock_count > 0
  const isSale = product.original_price && Number(product.original_price) > Number(product.price)
  const discountPct = isSale ? Math.round((1 - Number(product.price) / Number(product.original_price)) * 100) : 0
  const isNew = !isSale && !product.is_featured && product.created_at && (Date.now() - new Date(product.created_at).getTime()) < 14 * 86400000

  return (
    <div
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
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s var(--ease-expo)' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #111 0%, #1A1500 100%)' }}>
            <shopType.icon size={32} strokeWidth={1.5} color="var(--gold-dark)" />
          </div>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="tag" style={{ color: 'var(--white-dim)', border: '1px solid var(--black-border)', padding: '4px 10px', borderRadius: 99 }}>Out of stock</span>
          </div>
        )}

        {/* Category + sale/new badges */}
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 10, background: 'rgba(10,10,10,0.7)', color: 'var(--gold)', padding: '2px 8px', borderRadius: 99, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em', textTransform: 'uppercase', border: '1px solid rgba(201,168,76,0.2)' }}>
            {product.category_id}
          </span>
          {product.is_featured && (
            <span style={{ fontSize: 10, fontWeight: 700, background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)', color: 'var(--black)', padding: '2px 8px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Sparkles size={9} strokeWidth={2.5} /> FEATURED
            </span>
          )}
          {isSale && (
            <span style={{ fontSize: 10, fontWeight: 700, background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: 99 }}>
              {discountPct}% OFF
            </span>
          )}
          {isNew && (
            <span style={{ fontSize: 10, fontWeight: 700, background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)', color: 'var(--black)', padding: '2px 8px', borderRadius: 99 }}>
              NEW
            </span>
          )}
        </div>

        {/* Wishlist */}
        <WishlistButton productId={product.id} price={product.price} style={{ position: 'absolute', top: 8, right: 8 }} />

        {/* Quick view */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickView(true) }}
          aria-label="Quick view"
          style={{ position: 'absolute', top: 8, right: 44, width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(10,10,10,0.7)', color: 'var(--white-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Eye size={13} strokeWidth={1.75} />
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', lineHeight: 1.3, marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </p>
        <p style={{ fontSize: 11, color: 'var(--white-dim)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shopName}</span>
          {product.shops?.is_verified && <ShieldCheck size={11} strokeWidth={2} color="var(--gold)" style={{ flexShrink: 0 }} />}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span className="gold-text" style={{ fontSize: 15, fontWeight: 700 }}>{format(product.price)}</span>
            {isSale && <span style={{ fontSize: 11, color: 'var(--white-dim)', textDecoration: 'line-through' }}>{format(product.original_price)}</span>}
          </span>
          {inStock && (
            <span className="tag" style={{ color: 'var(--gold-dark)', background: 'rgba(201,168,76,0.08)', padding: '2px 7px', borderRadius: 6, border: '1px solid rgba(201,168,76,0.15)' }}>
              {product.stock_count} left
            </span>
          )}
        </div>
      </div>

      {quickView && (
        <QuickViewModal productId={product.id} onClose={() => setQuickView(false)} />
      )}
    </div>
  )
}
