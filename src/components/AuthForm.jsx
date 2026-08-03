import { useState } from 'react'
import { supabase } from '../lib/supabase'

const PASSWORD_RULES = [
  { test: (pw) => pw.length >= 8, label: 'At least 8 characters' },
  { test: (pw) => /[A-Z]/.test(pw), label: 'One uppercase letter' },
  { test: (pw) => /[a-z]/.test(pw), label: 'One lowercase letter' },
  { test: (pw) => /[0-9]/.test(pw), label: 'One number' },
  { test: (pw) => /[^A-Za-z0-9]/.test(pw), label: 'One special character' },
]

function getPasswordErrors(password) {
  return PASSWORD_RULES.filter((rule) => !rule.test(password)).map((rule) => rule.label)
}

export default function AuthForm() {
  const [mode, setMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [confirmEmailSent, setConfirmEmailSent] = useState(false)

  const passwordErrors = mode === 'signup' ? getPasswordErrors(password) : []

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (mode === 'signup' && passwordErrors.length > 0) {
      setError('Password does not meet the requirements below.')
      return
    }

    setSubmitting(true)
    const { data, error } = mode === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)

    if (error) {
      setError(error.message)
      return
    }

    if (mode === 'signup' && !data.session) {
      setConfirmEmailSent(true)
    }
  }

  if (confirmEmailSent) {
    return (
      <div
        style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 16, padding: '32px 24px', textAlign: 'center' }}
      >
        <p style={{ fontSize: 32, marginBottom: 12 }}>📩</p>
        <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--white)', marginBottom: 8 }}>Check your email</p>
        <p style={{ fontSize: 13, color: 'var(--white-dim)', lineHeight: 1.6, marginBottom: 4 }}>
          We sent a confirmation link to <strong style={{ color: 'var(--white)' }}>{email}</strong>.
        </p>
        <p style={{ fontSize: 13, color: 'var(--white-dim)', lineHeight: 1.6 }}>
          Open it and confirm your account before logging in — don't forget to check your spam folder.
        </p>
        <button
          onClick={() => { setConfirmEmailSent(false); setMode('login'); setPassword('') }}
          className="btn-outline"
          style={{ fontSize: 13, padding: '8px 18px', marginTop: 20 }}
        >
          Back to log in
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--black-card)', borderRadius: 12, padding: 4, marginBottom: 24, border: '1px solid var(--black-border)' }}>
        {['signup', 'login'].map((m) => (
          <button key={m} onClick={() => { setMode(m); setError(null) }}
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
          <input type="password" required minLength={mode === 'signup' ? 8 : undefined} value={password} onChange={(e) => setPassword(e.target.value)}
            className="input-dark" style={{ width: '100%', padding: '11px 14px', fontSize: 14 }} placeholder={mode === 'signup' ? 'Create a strong password' : 'Your password'} />
          {mode === 'signup' && (
            <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {PASSWORD_RULES.map((rule) => {
                const met = password.length > 0 && rule.test(password)
                return (
                  <li key={rule.label} style={{ fontSize: 11, color: met ? 'var(--gold)' : 'var(--white-dim)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{met ? '✓' : '·'}</span>{rule.label}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        {error && <p style={{ fontSize: 12, color: '#ef4444' }}>{error}</p>}
        <button type="submit" disabled={submitting} className="btn-gold" style={{ padding: '12px', fontSize: 14, marginTop: 4 }}>
          {submitting ? 'Please wait…' : mode === 'signup' ? 'Create account →' : 'Log in →'}
        </button>
      </form>
    </div>
  )
}
