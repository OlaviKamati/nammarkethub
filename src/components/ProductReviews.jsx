import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import StarRating from './StarRating'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'today'
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-NA', { month: 'short', year: 'numeric' })
}

export default function ProductReviews({ productId }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [myRating, setMyRating] = useState(0)
  const [myComment, setMyComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function fetchReviews() {
    setLoading(true)
    const { data } = await supabase
      .from('reviews')
      .select('id, buyer_id, rating, comment, created_at')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    setReviews(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [productId])

  useEffect(() => {
    if (!user) return
    const mine = reviews.find((r) => r.buyer_id === user.id)
    if (mine) { setMyRating(mine.rating); setMyComment(mine.comment ?? '') }
  }, [user, reviews])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!myRating) return
    setSubmitting(true)
    await supabase.from('reviews').upsert(
      { product_id: productId, buyer_id: user.id, rating: myRating, comment: myComment || null },
      { onConflict: 'product_id,buyer_id' }
    )
    setSubmitting(false)
    fetchReviews()
  }

  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>Reviews</h2>
        {reviews.length > 0 && (
          <>
            <StarRating value={average} />
            <span style={{ fontSize: 12, color: 'var(--white-dim)' }}>
              {average.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          </>
        )}
      </div>

      {/* Leave a review */}
      <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 16, padding: 16, marginBottom: 20 }}>
        {user ? (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: 12, color: 'var(--white-dim)', marginBottom: 8 }}>Your rating</p>
            <StarRating value={myRating} onChange={setMyRating} size={20} />
            <textarea
              rows={2}
              value={myComment}
              onChange={(e) => setMyComment(e.target.value)}
              placeholder="Share your experience (optional)"
              className="input-dark"
              style={{ width: '100%', padding: '10px 14px', fontSize: 13, marginTop: 12, resize: 'vertical' }}
            />
            <button type="submit" disabled={!myRating || submitting} className="btn-gold" style={{ fontSize: 13, padding: '8px 18px', marginTop: 10 }}>
              {submitting ? 'Saving…' : 'Submit review'}
            </button>
          </form>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--white-dim)' }}>
            <Link to="/account" style={{ color: 'var(--gold)' }}>Log in</Link> to leave a review.
          </p>
        )}
      </div>

      {!loading && reviews.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--white-dim)' }}>No reviews yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reviews.map((r) => (
          <div key={r.id} style={{ borderBottom: '1px solid var(--black-border)', paddingBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <StarRating value={r.rating} size={13} />
              <span style={{ fontSize: 11, color: 'var(--white-dim)' }}>{timeAgo(r.created_at)}</span>
            </div>
            {r.comment && <p style={{ fontSize: 13, color: 'var(--white)', lineHeight: 1.5 }}>{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
