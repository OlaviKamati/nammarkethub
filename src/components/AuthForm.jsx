import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthForm() {
  const [mode, setMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = mode === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (error) setError(error.message)
  }

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--black-card)', borderRadius: 12, padding: 4, marginBottom: 24, border: '1px solid var(--black-border)' }}>
        {['signup', 'login'].map((m) => (
          <button key={m} onClick={() => setMode(m)}
            style={{ flex: 1, fontSize: 13, fontWeight: 600, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: mode === m ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' : 'transparent',
              color: mode === m ? 'var(--black)' : 'var(--white-dim)' }}>
            {m === 'signup' ? 'Create account' : 'Log in'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontSize: 11, color: 'var(--white-dim)', display: 'block', marginBottom: 6 }}>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="input-dark" style={{ width: '100%', padding: '11px 14px', fontSize: 14 }} placeholder="you@example.com" />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--white-dim)', display: 'block', marginBottom: 6 }}>Password</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="input-dark" style={{ width: '100%', padding: '11px 14px', fontSize: 14 }} placeholder="At least 6 characters" />
        </div>
        {error && <p style={{ fontSize: 12, color: '#ef4444' }}>{error}</p>}
        <button type="submit" disabled={submitting} className="btn-gold" style={{ padding: '12px', fontSize: 14, marginTop: 4 }}>
          {submitting ? 'Please wait…' : mode === 'signup' ? 'Create account →' : 'Log in →'}
        </button>
      </form>
    </div>
  )
}
