import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { supabase } from '../lib/supabase'

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
      product_id: product.id,
      buyer_name: buyerName,
      buyer_contact: buyerContact,
      quantity,
    })

    setSubmitting(false)
    if (error) {
      setSubmitError('Could not send request. Try again.')
    } else {
      setDone(true)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-sm text-stone-400">
        Loading…
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <p className="text-sm text-red-600 mb-4">Product not found.</p>
        <Link to="/" className="text-sm text-teal-800 underline">Back to marketplace</Link>
      </div>
    )
  }

  const priceFormatted = Number(product.price).toLocaleString('en-NA', { minimumFractionDigits: 0 })
  const shop = product.shops

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-stone-500 hover:text-stone-700 mb-5 flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden mb-4">
        {/* Product image */}
        <div className="h-56 bg-stone-50 flex items-center justify-center">
          {product.photo_url ? (
            <img
              src={product.photo_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-stone-200 text-5xl">▢</span>
          )}
        </div>

        {/* Product info */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h1 className="text-lg font-medium text-stone-900">{product.name}</h1>
            <span className="text-lg font-medium text-stone-900 whitespace-nowrap">
              N${priceFormatted}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs bg-stone-50 text-stone-400 px-2 py-0.5 rounded border border-stone-100">
              {product.stock_count > 0 ? `${product.stock_count} in stock` : 'Out of stock'}
            </span>
            <span className="text-xs text-stone-400 capitalize">{product.category_id}</span>
          </div>

          {product.description && (
            <p className="text-sm text-stone-600 mb-4">{product.description}</p>
          )}

          {/* Shop info */}
          {shop && (
            <div className="border-t border-stone-100 pt-4 mt-4">
              <p className="text-xs text-stone-400 mb-1">Sold by</p>
              <p className="text-sm font-medium text-stone-900">{shop.name}</p>
              <p className="text-xs text-stone-500">{shop.location}</p>
              {shop.whatsapp_number && (
                <a
                  href={`https://wa.me/${shop.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-teal-800 mt-1.5 underline"
                >
                  WhatsApp the shop
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order form */}
      {product.stock_count > 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5">
          {!done ? (
            <>
              <h2 className="text-sm font-medium text-stone-900 mb-3">Request to buy</h2>
              <form onSubmit={handleOrder} className="space-y-3">
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Your name</label>
                  <input
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Phone or email</label>
                  <input
                    required
                    value={buyerContact}
                    onChange={(e) => setBuyerContact(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="081 234 5678"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={product.stock_count}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                {submitError && <p className="text-xs text-red-600">{submitError}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-teal-900 text-teal-50 rounded-lg py-2 text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? 'Sending…' : 'Send request'}
                </button>
                <p className="text-xs text-stone-400 text-center">
                  The shop will contact you to arrange payment and pickup.
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm font-medium text-stone-900 mb-1">Request sent!</p>
              <p className="text-sm text-stone-500 mb-3">
                {shop?.name} will reach out to you shortly.
              </p>
              <Link to="/" className="text-sm text-teal-800 underline">
                Back to marketplace
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
