import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { SHOP_TYPES } from '../lib/shopTypes'

const INPUT = {
  width: '100%',
  padding: '10px 14px',
  fontSize: 14,
  background: 'var(--black-card)',
  border: '1px solid var(--black-border)',
  borderRadius: 10,
  color: 'var(--white)',
  outline: 'none',
}

const LABEL = { fontSize: 11, color: 'var(--white-dim)', display: 'block', marginBottom: 6 }

export default function ShopForm({ userId, onCreated }) {
  const [name, setName] = useState('')
  const [shopType, setShopType] = useState('electronics')
  const [location, setLocation] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const { data, error } = await supabase
      .from('shops')
      .insert({
        owner_id: userId,
        name,
        shop_type: shopType,
        location,
        whatsapp_number: whatsapp,
        description,
      })
      .select()
      .single()

    setSubmitting(false)
    if (error) { setError('Could not create your shop. Try again.'); return }
    onCreated(data)
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2 className="font-display" style={{ fontSize: 20, color: 'var(--white)', marginBottom: 4 }}>Set up your shop</h2>
      <p style={{ fontSize: 13, color: 'var(--white-dim)', marginBottom: 20 }}>What buyers will see on NamMarketHub.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Shop type */}
        <div>
          <label style={LABEL}>Shop type</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {SHOP_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setShopType(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10,
                  fontSize: 13, cursor: 'pointer', transition: 'all 0.2s ease',
                  border: shopType === t.id ? 'none' : '1px solid var(--black-border)',
                  background: shopType === t.id ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'var(--black-card)',
                  color: shopType === t.id ? 'var(--black)' : 'var(--white-dim)',
                }}
              >
                <t.icon size={15} strokeWidth={1.75} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={LABEL}>Shop name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={INPUT}
            placeholder="Incredible Connection Windhoek"
          />
        </div>
        <div>
          <label style={LABEL}>Location</label>
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={INPUT}
            placeholder="Windhoek"
          />
        </div>
        <div>
          <label style={LABEL}>WhatsApp number</label>
          <input
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            style={INPUT}
            placeholder="+264 81 234 5678"
          />
        </div>
        <div>
          <label style={LABEL}>Description (optional)</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...INPUT, resize: 'vertical' }}
            placeholder="What do you sell?"
          />
        </div>

        {error && <p style={{ fontSize: 12, color: '#ef4444' }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="btn-gold"
          style={{ padding: '12px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          {submitting ? 'Creating…' : <>Create shop <ArrowRight size={15} strokeWidth={1.75} /></>}
        </button>
      </form>
    </div>
  )
}
