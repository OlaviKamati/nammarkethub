import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { X, Package, ShoppingCart, Check, ArrowRight, ShieldCheck, Scale } from 'lucide-react'
import { useProduct } from '../hooks/useProduct'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useCurrency } from '../hooks/useCurrency'
import { useCompare } from '../hooks/useCompare'
import { MAX_ANONYMOUS_CART_ITEMS } from '../lib/cart'
import WishlistButton from './WishlistButton'

export default function QuickViewModal({ productId, onClose }) {
  const navigate = useNavigate()
  const { product, loading } = useProduct(productId)
  const { user } = useAuth()
  const { items, addItem } = useCart()
  const { format } = useCurrency()
  const { addToCompare, removeFromCompare, isComparing } = useCompare()

  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [added, setAdded] = useState(false)

  useEffect(() => { setQuantity(1); setSelectedOptions({}); setAdded(false) }, [productId])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const optionGroups = product?.options ?? []
  const allOptionsSelected = optionGroups.every((g) => selectedOptions[g.name])

  function handleAddToCart(e) {
    e.preventDefault()
    if (!allOptionsSelected) return
    const optionsKey = JSON.stringify(optionGroups.length > 0 ? selectedOptions : {})
    const alreadyInCart = items.some((i) => i.product.id === product.id && JSON.stringify(i.selectedOptions ?? {}) === optionsKey)

    if (!user && !alreadyInCart && items.length >= MAX_ANONYMOUS_CART_ITEMS) {
      onClose()
      navigate('/account', { state: { reason: 'cart-limit' } })
      return
    }

    addItem(product, quantity, optionGroups.length > 0 ? selectedOptions : null)
    setAdded(true)
  }

  return createPortal(
    <div
      onClick={(e) => { e.stopPropagation(); onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up"
        style={{ width: '100%', maxWidth: 420, maxHeight: '88vh', overflowY: 'auto', background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 20, position: 'relative' }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(10,10,10,0.7)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={16} strokeWidth={1.75} />
        </button>

        {loading || !product ? (
          <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--white-dim)', fontSize: 14 }}>Loading…</div>
        ) : (
          <>
            <div style={{ position: 'relative', aspectRatio: '1', background: '#0D0D0D', borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
              {product.photo_url ? (
                <img src={product.photo_url} alt={product.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={40} strokeWidth={1.5} color="var(--white-dim)" />
                </div>
              )}
              <WishlistButton productId={product.id} price={product.price} style={{ position: 'absolute', top: 12, left: 12 }} />
              <button
                onClick={() => isComparing(product.id) ? removeFromCompare(product.id) : addToCompare(product)}
                aria-label={isComparing(product.id) ? 'Remove from compare' : 'Add to compare'}
                title={isComparing(product.id) ? 'Remove from compare' : 'Add to compare'}
                style={{
                  position: 'absolute', top: 12, left: 52, width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: 'rgba(10,10,10,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isComparing(product.id) ? 'var(--gold)' : 'var(--white-dim)',
                }}
              >
                <Scale size={13} strokeWidth={1.75} />
              </button>
            </div>

            <div style={{ padding: 20 }}>
              {product.shops?.name && (
                <p style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {product.shops.name}
                  {product.shops.is_verified && <ShieldCheck size={11} strokeWidth={2} />}
                </p>
              )}
              <h2 className="font-display" style={{ fontSize: 19, color: 'var(--white)', lineHeight: 1.25, marginBottom: 10 }}>{product.name}</h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                <span className="gold-text" style={{ fontSize: 22, fontWeight: 700 }}>{format(product.price)}</span>
                {product.original_price > product.price && (
                  <span style={{ fontSize: 13, color: 'var(--white-dim)', textDecoration: 'line-through' }}>{format(product.original_price)}</span>
                )}
                <span className="tag" style={{ color: product.stock_count > 0 ? 'var(--gold-dark)' : 'var(--white-dim)', background: product.stock_count > 0 ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: 6, border: `1px solid ${product.stock_count > 0 ? 'rgba(201,168,76,0.2)' : 'var(--black-border)'}` }}>
                  {product.stock_count > 0 ? `${product.stock_count} in stock` : 'Out of stock'}
                </span>
              </div>

              {optionGroups.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  {optionGroups.map((group) => (
                    <div key={group.name} style={{ marginBottom: 12 }}>
                      <p style={{ fontSize: 11, color: 'var(--white-dim)', marginBottom: 6 }}>
                        {group.name}{selectedOptions[group.name] ? `: ${selectedOptions[group.name]}` : ''}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {group.values.map((value) => {
                          const active = selectedOptions[group.name] === value
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setSelectedOptions((s) => ({ ...s, [group.name]: value }))}
                              style={{
                                fontSize: 12, padding: '6px 13px', borderRadius: 99, cursor: 'pointer',
                                border: active ? 'none' : '1px solid var(--black-border)',
                                background: active ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' : 'var(--black)',
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

              {product.stock_count > 0 ? (
                <form onSubmit={handleAddToCart} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--black)', border: '1px solid var(--black-border)', borderRadius: 10, padding: '4px 6px', width: 'fit-content' }}>
                    <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      style={{ width: 26, height: 26, borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--white)', cursor: 'pointer' }}>−</button>
                    <span style={{ fontSize: 13, color: 'var(--white)', minWidth: 20, textAlign: 'center' }}>{quantity}</span>
                    <button type="button" onClick={() => setQuantity((q) => Math.min(product.stock_count, q + 1))}
                      style={{ width: 26, height: 26, borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--white)', cursor: 'pointer' }}>+</button>
                  </div>

                  <button type="submit" disabled={!allOptionsSelected} className="btn-gold" style={{ padding: '11px', fontSize: 14, opacity: !allOptionsSelected ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {added ? <><Check size={15} strokeWidth={2} /> Added</> : <><ShoppingCart size={15} strokeWidth={1.75} /> Add to cart</>}
                  </button>
                  {added && (
                    <p style={{ fontSize: 12, color: 'var(--gold)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      Added · <Link to="/cart" onClick={onClose} style={{ color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>View cart <ArrowRight size={12} strokeWidth={1.75} /></Link>
                    </p>
                  )}
                </form>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--white-dim)', textAlign: 'center', padding: '8px 0' }}>Out of stock</p>
              )}

              <Link to={`/product/${product.id}`} onClick={onClose} style={{ display: 'block', textAlign: 'center', fontSize: 12, color: 'var(--white-dim)', textDecoration: 'none', marginTop: 14 }}>
                View full details
              </Link>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}
