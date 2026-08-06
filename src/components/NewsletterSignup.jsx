import { useState } from 'react'
import { Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    await supabase.from('newsletter_signups').upsert({ email }, { onConflict: 'email', ignoreDuplicates: true })
    setSubmitting(false)
    setDone(true)
  }

  return (
    <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)', marginBottom: 6 }}>Stay in the loop</p>
      <p style={{ fontSize: 13, color: 'var(--white-dim)', marginBottom: 16 }}>New shops, new products, no spam.</p>
      {done ? (
        <p style={{ fontSize: 13, color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>You're subscribed <Check size={14} strokeWidth={2} /></p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, maxWidth: 360, margin: '0 auto' }}>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="input-dark" style={{ flex: 1, padding: '10px 14px', fontSize: 13 }} placeholder="you@example.com"
          />
          <button type="submit" disabled={submitting} className="btn-gold" style={{ fontSize: 13, padding: '10px 18px', flexShrink: 0 }}>
            {submitting ? '…' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  )
}
