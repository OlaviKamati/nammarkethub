import { useState } from 'react'
import { Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getShopType } from '../lib/shopTypes'
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

export default function ShopSettingsForm({ shop, onUpdated }) {
  const [name, setName] = useState(shop.name)
  const [location, setLocation] = useState(shop.location)
  const [whatsapp, setWhatsapp] = useState(shop.whatsapp_number ?? '')
  const [description, setDescription] = useState(shop.description ?? '')
  const [logoUrl, setLogoUrl] = useState(shop.logo_url ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  const type = getShopType(shop.shop_type)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)

    const { data, error } = await supabase
      .from('shops')
      .update({
        name,
        location,
        whatsapp_number: whatsapp || null,
        description: description || null,
        logo_url: logoUrl || null,
      })
      .eq('id', shop.id)
      .select()
      .single()

    setSaving(false)
    if (error) { setError('Could not save changes. Try again.'); return }
    setSaved(true)
    onUpdated?.(data)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ background: 'var(--black-soft)', border: '1px solid var(--black-border)', borderRadius: 16, padding: 20, maxWidth: 480 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>Shop profile</h3>
      <p style={{ fontSize: 12, color: 'var(--white-dim)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
        <type.icon size={13} strokeWidth={1.75} /> {type.label} · shop type can't be changed here
      </p>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={LABEL}>Shop logo / photo</label>
          <ImageUpload value={logoUrl} onChange={setLogoUrl} folder="shops" />
        </div>
        <div>
          <label style={LABEL}>Shop name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} style={INPUT} />
        </div>
        <div>
          <label style={LABEL}>Location</label>
          <input required value={location} onChange={(e) => setLocation(e.target.value)} style={INPUT} placeholder="Windhoek" />
        </div>
        <div>
          <label style={LABEL}>WhatsApp number</label>
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} style={INPUT} placeholder="+264 81 234 5678" />
        </div>
        <div>
          <label style={LABEL}>Description</label>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...INPUT, resize: 'vertical' }} placeholder="What do you sell?" />
        </div>

        {error && <p style={{ fontSize: 12, color: '#ef4444' }}>{error}</p>}
        {saved && <p style={{ fontSize: 12, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}><Check size={13} strokeWidth={2} /> Saved</p>}

        <button type="submit" disabled={saving} className="btn-gold" style={{ fontSize: 13, padding: '10px 20px', width: 'fit-content' }}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
