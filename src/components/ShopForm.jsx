import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { SHOP_TYPES } from '../lib/shopTypes'

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
    <div className="max-w-sm mx-auto">
      <h2 className="text-lg font-semibold text-stone-900 mb-1">Set up your shop</h2>
      <p className="text-sm text-stone-500 mb-5">What buyers will see on NamMarketHub.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Shop type */}
        <div>
          <label className="text-xs font-medium text-stone-500 block mb-2">Shop type</label>
          <div className="grid grid-cols-2 gap-2">
            {SHOP_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setShopType(t.id)}
                className={
                  'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors ' +
                  (shopType === t.id
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300')
                }
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-stone-500 block mb-1">Shop name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400"
            placeholder="Incredible Connection Windhoek"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-stone-500 block mb-1">Location</label>
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400"
            placeholder="Windhoek"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-stone-500 block mb-1">WhatsApp number</label>
          <input
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400"
            placeholder="+264 81 234 5678"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-stone-500 block mb-1">Description (optional)</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400"
            placeholder="What do you sell?"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-stone-900 text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-50 hover:bg-stone-800 transition-colors"
        >
          {submitting ? 'Creating…' : 'Create shop →'}
        </button>
      </form>
    </div>
  )
}
