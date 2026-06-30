import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthForm() {
  const [mode, setMode] = useState('signup') // 'signup' | 'login'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error } =
      mode === 'signup'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })

    setSubmitting(false)

    if (error) {
      setError(error.message)
    }
    // On success, useAuth's onAuthStateChange listener picks up the
    // new session automatically — no manual redirect needed here.
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex gap-1 mb-5 bg-stone-100 rounded-full p-1">
        <button
          onClick={() => setMode('signup')}
          className={
            'flex-1 text-sm py-1.5 rounded-full transition-colors ' +
            (mode === 'signup' ? 'bg-white shadow-sm font-medium' : 'text-stone-500')
          }
        >
          Create account
        </button>
        <button
          onClick={() => setMode('login')}
          className={
            'flex-1 text-sm py-1.5 rounded-full transition-colors ' +
            (mode === 'login' ? 'bg-white shadow-sm font-medium' : 'text-stone-500')
          }
        >
          Log in
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-stone-500 block mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-xs text-stone-500 block mb-1">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm"
            placeholder="At least 6 characters"
          />
        </div>

        {error && <div className="text-xs text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-teal-900 text-teal-50 rounded-lg py-2 text-sm font-medium disabled:opacity-50"
        >
          {submitting
            ? 'Please wait…'
            : mode === 'signup'
              ? 'Create account'
              : 'Log in'}
        </button>
      </form>
    </div>
  )
}
