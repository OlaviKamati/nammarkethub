import { useState } from 'react'
import { supabase } from '../lib/supabase'
import ImageUpload from './ImageUpload'

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

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/

export default function ProfileSettingsForm({ userId, profile, onSaved }) {
  const [username, setUsername] = useState(profile?.username ?? '')
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSave(e) {
    e.preventDefault()
    setError(null)

    if (!USERNAME_RE.test(username)) {
      setError('Username must be 3-20 characters: letters, numbers, underscores only.')
      return
    }

    setSaving(true)
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, username, full_name: fullName || null, avatar_url: avatarUrl || null }, { onConflict: 'id' })
      .select()
      .single()

    setSaving(false)
    if (error) {
      setError(error.code === '23505' ? 'That username is already taken.' : 'Could not save. Try again.')
      return
    }
    onSaved?.(data)
  }

  return (
    <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 16, padding: 20, maxWidth: 440 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', marginBottom: 16 }}>
        {profile ? 'Edit profile' : 'Set up your profile'}
      </h3>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={LABEL}>Profile picture</label>
          <ImageUpload value={avatarUrl} onChange={setAvatarUrl} folder="avatars" />
        </div>
        <div>
          <label style={LABEL}>Username</label>
          <input required value={username} onChange={(e) => setUsername(e.target.value)} style={INPUT} placeholder="e.g. tanja_w" />
        </div>
        <div>
          <label style={LABEL}>Display name (optional)</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={INPUT} placeholder="Your name" />
        </div>

        {error && <p style={{ fontSize: 12, color: '#ef4444' }}>{error}</p>}

        <button type="submit" disabled={saving} className="btn-gold" style={{ fontSize: 13, padding: '10px 20px', width: 'fit-content' }}>
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  )
}
