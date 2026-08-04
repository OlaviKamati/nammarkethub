import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import WishlistButton from '../components/WishlistButton'
import ShareButtons from '../components/ShareButtons'
import ProductReviews from '../components/ProductReviews'

// Anonymous browsers get a taste of the cart, then are asked to sign up to keep going.
const MAX_ANONYMOUS_CART_ITEMS = 5

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, loading, error } = useProduct(id)
  const { user } = useAuth()
  const { items, addItem } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [added, setAdded] = useState(false)

  const optionGroups = product?.options ?? []
  const allOptionsSelected = optionGroups.every((g) => selectedOptions[g.name])

  function handleAddToCart(e) {
    e.preventDefault()
    if (!allOptionsSelected) return

    const optionsKey = JSON.stringify(optionGroups.length > 0 ? selectedOptions : {})
    const alreadyInCart = items.some((i) => i.product.id === product.id && JSON.stringify(i.selectedOptions ?? {}) === optionsKey)

    if (!user && !alreadyInCart && items.length >= MAX_ANONYMOUS_CART_ITEMS) {
      navigate('/account', { state: { reason: 'cart-limit' } })
      return
    }

    addItem(product, quantity, optionGroups.length > 0 ? selectedOptions : null)
    setAdded(true)
    setTimeout(() => setAdded(false), 3000)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 800, margin: '60px auto', textAlign: 'center', color: 'var(--white-dim)', fontSize: 14 }}>Loading…</div>
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 800, margin: '60px auto', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontSize: 14, marginBottom: 16 }}>Product not found.</p>
          <Link to="/" style={{ color: 'var(--gold)', fontSize: 14 }}>Back to marketplace</Link>
        </div>
      </>
    )
  }

  const price = Number(product.price).toLocaleString('en-NA', { minimumFractionDigits: 0 })
  const shop = product.shops
  const productUrl = `${window.location.origin}/product/${product.id}`

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }} className="page-enter">
        <button
          onClick={() => navigate(-1)}
          style={{ fontSize: 13, color: 'var(--white-dim)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          ← Back
        </button>

        <div className='product-detail-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

          {/* Left — image */}
          <div>
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--black-border)', aspectRatio: '1', background: 'var(--black-card)' }}>
              {product.photo_url ? (
                <img src={product.photo_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, background: 'linear-gradient(135deg, #111, #1A1500)' }}>📦</div>
              )}
              <WishlistButton productId={product.id} style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, fontSize: 16 }} />
            </div>

            {/* Shop info below image */}
            {shop && (
              <div style={{ marginTop: 16, padding: '16px 20px', background: 'var(--black-card)', borderRadius: 16, border: '1px solid var(--black-border)' }}>
                <p style={{ fontSize: 10, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Sold by</p>
                <Link to={`/shop/${shop.id}`} style={{ fontSize: 15, fontWeight: 600, color: 'var(--white)', marginBottom: 2, display: 'block', textDecoration: 'none' }}>{shop.name}</Link>
                <p style={{ fontSize: 12, color: 'var(--white-dim)', marginBottom: shop.whatsapp_number ? 12 : 0 }}>{shop.location}</p>
                {shop.whatsapp_number && (
                  <a
                    href={`https://wa.me/${shop.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gold)', textDecoration: 'none', padding: '6px 14px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 99, background: 'rgba(201,168,76,0.08)' }}
                  >
                    💬 WhatsApp the shop
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right — info + order form */}
          <div>
            <div style={{ marginBottom: 8 }}>
              <span className="tag" style={{ color: 'var(--gold)', background: 'rgba(201,168,76,0.1)', padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(201,168,76,0.2)', display: 'inline-block', marginBottom: 12 }}>
                {product.category_id}
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--white)', lineHeight: 1.2, marginBottom: 12 }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span className="gold-text" style={{ fontSize: 28, fontWeight: 700 }}>N${price}</span>
              <span className="tag" style={{ color: product.stock_count > 0 ? 'var(--gold-dark)' : 'var(--white-dim)', background: product.stock_count > 0 ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: 6, border: `1px solid ${product.stock_count > 0 ? 'rgba(201,168,76,0.2)' : 'var(--black-border)'}` }}>
                {product.stock_count > 0 ? `${product.stock_count} in stock` : 'Out of stock'}
              </span>
            </div>

            {product.description && (
              <p style={{ fontSize: 14, color: 'var(--white-dim)', lineHeight: 1.6, marginBottom: 24 }}>{product.description}</p>
            )}

            {optionGroups.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                {optionGroups.map((group) => (
                  <div key={group.name} style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 12, color: 'var(--white-dim)', marginBottom: 8 }}>
                      {group.name}{selectedOptions[group.name] ? `: ${selectedOptions[group.name]}` : ''}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {group.values.map((value) => {
                        const active = selectedOptions[group.name] === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSelectedOptions((s) => ({ ...s, [group.name]: value }))}
                            style={{
                              fontSize: 13, padding: '7px 16px', borderRadius: 99, cursor: 'pointer',
                              border: active ? 'none' : '1px solid var(--black-border)',
                              background: active ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' : 'var(--black-card)',
                              color: active ? 'var(--black)' : 'var(--white-dim)',
                            }}
                          >
                            {value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <ShareButtons productName={product.name} url={productUrl} />
            </div>

            <div className="gold-divider" style={{ marginBottom: 24 }} />

            {/* Add to cart */}
            {product.stock_count > 0 && (
              <div style={{ background: 'var(--black-card)', borderRadius: 16, border: '1px solid var(--black-border)', padding: 20 }}>
                <form onSubmit={handleAddToCart} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: 'var(--white-dim)', display: 'block', marginBottom: 6 }}>Quantity</label>
                    <input type="number" min={1} max={product.stock_count} value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="input-dark" style={{ width: '100%', padding: '10px 14px', fontSize: 14 }} />
                  </div>
                  <button type="submit" disabled={!allOptionsSelected} className="btn-gold" style={{ padding: '12px', fontSize: 14, marginTop: 4, opacity: !allOptionsSelected ? 0.5 : 1 }}>
                    {added ? 'Added ✓' : 'Add to cart 🛒'}
                  </button>
                  {added && (
                    <p style={{ fontSize: 12, color: 'var(--gold)', textAlign: 'center' }}>
                      Added to cart · <Link to="/cart" style={{ color: 'var(--gold)' }}>View cart →</Link>
                    </p>
                  )}
                  <p style={{ fontSize: 11, color: 'var(--white-dim)', textAlign: 'center' }}>
                    Add more items, then check out from your cart. The shop will contact you to arrange payment & pickup.
                  </p>
                </form>
              </div>
            )}

            <div style={{ marginTop: 32 }}>
              <ProductReviews productId={product.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
