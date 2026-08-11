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
  const counts = [5, 4, 3, 2, 1].map((n) => reviews.filter((r) => r.rating === n).length)

  return (
    <div>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)', marginBottom: 16 }}>Reviews</h2>

      {reviews.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'center', background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 16, padding: '18px 20px', marginBottom: 20 }}>
          <div style={{ textAlign: 'center', paddingRight: 24, borderRight: '1px solid var(--black-border)' }}>
            <p className="gold-text" style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{average.toFixed(1)}</p>
            <div style={{ margin: '6px 0' }}><StarRating value={average} size={13} /></div>
            <p style={{ fontSize: 11, color: 'var(--white-dim)' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[5, 4, 3, 2, 1].map((n, i) => {
              const pct = reviews.length ? Math.round((counts[i] / reviews.length) * 100) : 0
              return (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                  <span style={{ color: 'var(--white-dim)', width: 10 }}>{n}</span>
                  <div style={{ flex: 1, height: 5, background: 'var(--black-border)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold-dark), var(--gold))', borderRadius: 99 }} />
                  </div>
                  <span style={{ color: 'var(--white-dim)', width: 24, textAlign: 'right' }}>{counts[i]}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

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
            <Link to="/account" style={{ color: 'var(--gold-ink)' }}>Log in</Link> to leave a review.
          </p>
        )}
      </div>

      {!loading && reviews.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--white-dim)' }}>No reviews yet — be the first to share your experience.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reviews.map((r) => (
          <div key={r.id} style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: r.comment ? 8 : 0 }}>
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
