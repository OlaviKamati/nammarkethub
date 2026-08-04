import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart()
  const { user } = useAuth()

  const [buyerName, setBuyerName] = useState(user?.user_metadata?.full_name ?? '')
  const [buyerContact, setBuyerContact] = useState(user?.user_metadata?.phone ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [done, setDone] = useState(false)

  // Group line items by shop, for display only
  const groups = items.reduce((acc, item) => {
    const shopId = item.product.shops?.id ?? 'unknown'
    if (!acc[shopId]) acc[shopId] = { shop: item.product.shops, lines: [] }
    acc[shopId].lines.push(item)
    return acc
  }, {})

  async function handleCheckout(e) {
    e.preventDefault()
    setSubmitError(null)

    // Guard against combined quantity (across option variants) exceeding stock
    const totalsByProduct = {}
    for (const item of items) {
      totalsByProduct[item.product.id] = (totalsByProduct[item.product.id] ?? 0) + item.quantity
    }
    const overStock = items.find((item) => totalsByProduct[item.product.id] > item.product.stock_count)
    if (overStock) {
      setSubmitError(`Only ${overStock.product.stock_count} of "${overStock.product.name}" left in stock.`)
      return
    }

    setSubmitting(true)
    const groupId = crypto.randomUUID()
    const rows = items.map((item) => ({
      product_id: item.product.id,
      buyer_name: buyerName,
      buyer_contact: buyerContact,
      quantity: item.quantity,
      selected_options: Object.keys(item.selectedOptions ?? {}).length > 0 ? item.selectedOptions : null,
      group_id: groupId,
      buyer_id: user?.id ?? null,
    }))

    const { error } = await supabase.from('orders').insert(rows)
    setSubmitting(false)

    if (error) {
      setSubmitError('Could not send your request. Try again.')
      return
    }

    clearCart()
    setDone(true)
  }

  if (done) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 24px' }} className="page-enter">
          <p style={{ fontSize: 32, marginBottom: 12 }}>✅</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>Request sent!</p>
          <p style={{ fontSize: 14, color: 'var(--white-dim)', marginBottom: 24 }}>
            The shop{Object.keys(groups).length > 1 ? 's' : ''} will contact you shortly to arrange payment & pickup.
          </p>
          <Link to="/" style={{ color: 'var(--gold)', fontSize: 14, textDecoration: 'none' }}>← Back to marketplace</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }} className="page-enter">
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--white)', marginBottom: 24 }}>Your cart</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>🛒</p>
            <p style={{ color: 'var(--white-dim)', fontSize: 14, marginBottom: 16 }}>Your cart is empty.</p>
            <Link to="/" style={{ color: 'var(--gold)', fontSize: 14, textDecoration: 'none' }}>Browse products →</Link>
          </div>
        ) : (
          <>
            {Object.entries(groups).map(([shopId, group]) => (
              <div key={shopId} style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                  {group.shop?.name ?? 'Unknown shop'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {group.lines.map((item) => (
                    <div key={item.key} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 14, padding: 12 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 10, background: '#0D0D0D', flexShrink: 0, overflow: 'hidden' }}>
                        {item.product.photo_url ? (
                          <img src={item.product.photo_url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📦</div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</p>
                        {Object.keys(item.selectedOptions ?? {}).length > 0 && (
                          <p style={{ fontSize: 11, color: 'var(--white-dim)' }}>
                            {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                          </p>
                        )}
                        <p style={{ fontSize: 12, color: 'var(--gold)' }}>N${Number(item.product.price).toLocaleString('en-NA')}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <button type="button" onClick={() => updateQuantity(item.key, Math.max(1, item.quantity - 1))}
                          style={{ width: 26, height: 26, borderRadius: 8, border: '1px solid var(--black-border)', background: 'transparent', color: 'var(--white)', cursor: 'pointer' }}>−</button>
                        <span style={{ fontSize: 13, color: 'var(--white)', minWidth: 18, textAlign: 'center' }}>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.key, Math.min(item.product.stock_count, item.quantity + 1))}
                          style={{ width: 26, height: 26, borderRadius: 8, border: '1px solid var(--black-border)', background: 'transparent', color: 'var(--white)', cursor: 'pointer' }}>+</button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.key)}
                        style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="gold-divider" style={{ marginBottom: 20 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <span style={{ fontSize: 14, color: 'var(--white-dim)' }}>Subtotal</span>
              <span className="gold-text" style={{ fontSize: 18, fontWeight: 700 }}>N${subtotal.toLocaleString('en-NA')}</span>
            </div>

            <form onSubmit={handleCheckout} style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)' }}>Your details</p>
              <div>
                <label style={{ fontSize: 11, color: 'var(--white-dim)', display: 'block', marginBottom: 6 }}>Your name</label>
                <input required value={buyerName} onChange={(e) => setBuyerName(e.target.value)}
                  className="input-dark" style={{ width: '100%', padding: '10px 14px', fontSize: 14 }} placeholder="Your name" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--white-dim)', display: 'block', marginBottom: 6 }}>Phone or email</label>
                <input required value={buyerContact} onChange={(e) => setBuyerContact(e.target.value)}
                  className="input-dark" style={{ width: '100%', padding: '10px 14px', fontSize: 14 }} placeholder="081 234 5678" />
              </div>
              {submitError && <p style={{ fontSize: 12, color: '#ef4444' }}>{submitError}</p>}
              <button type="submit" disabled={submitting} className="btn-gold" style={{ padding: '12px', fontSize: 14, marginTop: 4 }}>
                {submitting ? 'Sending…' : 'Send request →'}
              </button>
              <p style={{ fontSize: 11, color: 'var(--white-dim)', textAlign: 'center' }}>
                Shops will contact you directly to arrange payment & pickup.
              </p>
            </form>
          </>
        )}
      </div>
    </>
  )
}
