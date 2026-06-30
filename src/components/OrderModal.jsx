import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function OrderModal({ product, onClose }) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [done, setDone] = useState(false)

  if (!product) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    const { error } = await supabase.from('orders').insert({
      product_id: product.id,
      buyer_name: name,
      buyer_contact: contact,
      quantity,
    })

    setSubmitting(false)

    if (error) {
      setSubmitError('Could not send your request. Try again.')
      return
    }

    setDone(true)
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-sm w-full p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {!done ? (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-base font-medium text-stone-900">{product.name}</div>
                <div className="text-sm text-stone-500">{product.shops?.name}</div>
              </div>
              <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-stone-500 block mb-1">Your name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">Phone or email</label>
                <input
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="081 234 5678"
                />
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {submitError && <div className="text-xs text-red-600">{submitError}</div>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-900 text-teal-50 rounded-lg py-2 text-sm font-medium disabled:opacity-50"
              >
                {submitting ? 'Sending…' : 'Request to buy'}
              </button>
              <p className="text-xs text-stone-400 text-center">
                The shop will contact you directly to arrange payment and pickup.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-base font-medium text-stone-900 mb-1">Request sent</div>
            <p className="text-sm text-stone-500 mb-4">
              {product.shops?.name} will reach out to you shortly.
            </p>
            <button
              onClick={onClose}
              className="text-sm font-medium text-teal-900 underline"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
