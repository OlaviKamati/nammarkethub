import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, loading, error } = useProduct(id)

  const [buyerName, setBuyerName] = useState('')
  const [buyerContact, setBuyerContact] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [done, setDone] = useState(false)

  async function handleOrder(e) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    const { error } = await supabase.from('orders').insert({
      product_id: product.id, buyer_name: buyerName, buyer_contact: buyerContact, quantity
    })
    setSubmitting(false)
    if (error) setSubmitError('Could not send request. Try again.')
    else setDone(true)
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

          {/* Left — image */}
          <div>
            <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--black-border)', aspectRatio: '1', background: 'var(--black-card)' }}>
              {product.photo_url ? (
                <img src={product.photo_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, background: 'linear-gradient(135deg, #111, #1A1500)' }}>📦</div>
              )}
            </div>

            {/* Shop info below image */}
            {shop && (
              <div style={{ marginTop: 16, padding: '16px 20px', background: 'var(--black-card)', borderRadius: 16, border: '1px solid var(--black-border)' }}>
                <p style={{ fontSize: 10, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Sold by</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--white)', marginBottom: 2 }}>{shop.name}</p>
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

            <div className="gold-divider" style={{ marginBottom: 24 }} />

            {/* Order form */}
            {product.stock_count > 0 && (
              <div style={{ background: 'var(--black-card)', borderRadius: 16, border: '1px solid var(--black-border)', padding: 20 }}>
                {!done ? (
                  <>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', marginBottom: 16 }}>Request to buy</p>
                    <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                      <div>
                        <label style={{ fontSize: 11, color: 'var(--white-dim)', display: 'block', marginBottom: 6 }}>Quantity</label>
                        <input type="number" min={1} max={product.stock_count} value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className="input-dark" style={{ width: '100%', padding: '10px 14px', fontSize: 14 }} />
                      </div>
                      {submitError && <p style={{ fontSize: 12, color: '#ef4444' }}>{submitError}</p>}
                      <button type="submit" disabled={submitting} className="btn-gold" style={{ padding: '12px', fontSize: 14, marginTop: 4 }}>
                        {submitting ? 'Sending…' : 'Send request →'}
                      </button>
                      <p style={{ fontSize: 11, color: 'var(--white-dim)', textAlign: 'center' }}>
                        The shop will contact you to arrange payment & pickup.
                      </p>
                    </form>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <p style={{ fontSize: 24, marginBottom: 12 }}>✅</p>
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--white)', marginBottom: 6 }}>Request sent!</p>
                    <p style={{ fontSize: 13, color: 'var(--white-dim)', marginBottom: 20 }}>{shop?.name} will reach out shortly.</p>
                    <Link to="/" style={{ color: 'var(--gold)', fontSize: 13, textDecoration: 'none' }}>← Back to marketplace</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
