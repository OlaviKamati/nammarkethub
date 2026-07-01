import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function HeroCarousel() {
  const [slides, setSlides] = useState([])
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, price, photo_url, description, category_id, shops(name, shop_type)')
      .eq('is_active', true)
      .not('photo_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => setSlides(data ?? []))
  }, [])

  const goTo = useCallback((idx) => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(idx)
      setTransitioning(false)
    }, 300)
  }, [transitioning])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, slides.length, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, slides.length, goTo])

  useEffect(() => {
    if (paused || slides.length < 2) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [paused, next, slides.length])

  if (slides.length === 0) {
    return (
      <div style={{ height: 360, background: 'var(--black-card)', borderRadius: 20, border: '1px solid var(--black-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
          <p style={{ color: 'var(--white-dim)', fontSize: 14 }}>Add products with photos to see them featured here</p>
        </div>
      </div>
    )
  }

  const slide = slides[current]
  const priceFormatted = Number(slide.price).toLocaleString('en-NA', { minimumFractionDigits: 0 })

  return (
    <div
      style={{ position: 'relative', height: 380, borderRadius: 20, overflow: 'hidden', marginBottom: 32, cursor: 'pointer' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* BG Image */}
      <div style={{ position: 'absolute', inset: 0, opacity: transitioning ? 0 : 1, transition: 'opacity 0.3s ease' }}>
        <img
          src={slide.photo_url}
          alt={slide.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.2) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)' }} />
      </div>

      {/* Gold corner accent */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle at top right, rgba(201,168,76,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2rem' }}>
        <div key={current} className="fade-up">
          {/* Shop tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 99, padding: '4px 12px', marginBottom: 12 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
            <span style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {slide.shops?.name ?? 'Featured'}
            </span>
          </div>

          <h2 style={{ color: 'var(--white)', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8, maxWidth: 480, lineHeight: 1.2 }}>
            {slide.name}
          </h2>

          {slide.description && (
            <p style={{ color: 'rgba(250,250,248,0.6)', fontSize: 14, marginBottom: 16, maxWidth: 380 }}>
              {slide.description.slice(0, 100)}{slide.description.length > 100 ? '…' : ''}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="gold-text" style={{ fontSize: 24, fontWeight: 700 }}>N${priceFormatted}</span>
            <button
              onClick={() => navigate(`/product/${slide.id}`)}
              className="btn-gold"
              style={{ fontSize: 13, padding: '8px 20px' }}
            >
              View product →
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', fontSize: 18, cursor: 'pointer', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>‹</button>
          <button onClick={next} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', fontSize: 18, cursor: 'pointer', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>›</button>
        </>
      )}

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 20 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              height: 4, borderRadius: 99, border: 'none', cursor: 'pointer',
              background: i === current ? 'var(--gold)' : 'rgba(201,168,76,0.3)',
              width: i === current ? 24 : 6,
              transition: 'all 0.3s var(--ease-expo)'
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
        <span className="tag" style={{ color: 'var(--gold)', background: 'rgba(10,10,10,0.6)', padding: '4px 10px', borderRadius: 99, border: '1px solid rgba(201,168,76,0.2)' }}>
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
