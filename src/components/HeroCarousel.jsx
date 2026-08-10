import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, ChevronLeft, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCurrency } from '../hooks/useCurrency'

export default function HeroCarousel() {
  const { format } = useCurrency()
  const [allProducts, setAllProducts] = useState([])
  const [tab, setTab] = useState('latest')
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, price, original_price, photo_url, description, category_id, shops(name, shop_type, is_verified)')
      .eq('is_active', true)
      .not('photo_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(24)
      .then(({ data }) => setAllProducts(data ?? []))
  }, [])

  const saleProducts = allProducts.filter((p) => p.original_price > p.price)
  const slides = (tab === 'sale' ? saleProducts : allProducts).slice(0, 8)

  function handleTab(next) {
    setTab(next)
    setCurrent(0)
  }

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

  const heroHeight = 'clamp(420px, 62vh, 680px)'

  if (allProducts.length === 0) {
    return (
      <div style={{ height: heroHeight, background: 'var(--black-card)', borderRadius: 20, border: '1px solid var(--black-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
        <div style={{ textAlign: 'center' }}>
          <ShoppingBag size={40} strokeWidth={1.5} color="var(--white-dim)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--white-dim)', fontSize: 14 }}>Add products with photos to see them featured here</p>
        </div>
      </div>
    )
  }

  const slide = slides[current]

  return (
    <div
      style={{ position: 'relative', height: heroHeight, borderRadius: 20, overflow: 'hidden', marginBottom: 32, cursor: 'pointer', background: 'var(--black-card)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* BG Image — contain so the full product is always visible, never cropped */}
      <div style={{ position: 'absolute', inset: 0, opacity: transitioning ? 0 : 1, transition: 'opacity 0.3s ease' }}>
        {/* Blurred, zoomed backdrop fills the frame so contain-mode doesn't leave flat empty bars */}
        <img
          src={slide.photo_url}
          alt=""
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(40px) brightness(0.9) saturate(1.05)', transform: 'scale(1.15)' }}
        />
        {/* Sharp product image, always fully visible */}
        <img
          src={slide.photo_url}
          alt={slide.name}
          style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain' }}
        />
        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.2) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)', pointerEvents: 'none' }} />
      </div>

      {/* Gold corner accent */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle at top right, rgba(201,168,76,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Tabs */}
      {saleProducts.length > 0 && (
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 20, display: 'flex', gap: 6 }}>
          {[['latest', 'Latest'], ['sale', 'On Sale']].map(([val, label]) => (
            <button
              key={val}
              onClick={(e) => { e.stopPropagation(); handleTab(val) }}
              style={{
                fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 99, cursor: 'pointer',
                border: tab === val ? 'none' : '1px solid rgba(201,168,76,0.3)',
                background: tab === val ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' : 'rgba(10,10,10,0.5)',
                color: tab === val ? 'var(--black)' : 'var(--gold)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2rem' }}>
        <div key={current} className="fade-up">
          {/* Shop tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 99, padding: '4px 12px', marginBottom: 12 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
            <span style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {slide.shops?.name ?? 'Featured'}
            </span>
            {slide.shops?.is_verified && <ShieldCheck size={12} strokeWidth={2} color="var(--gold)" />}
          </div>

          <h2 className="font-display" style={{ color: 'var(--white)', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', letterSpacing: '-0.02em', marginBottom: 8, maxWidth: 480, lineHeight: 1.2 }}>
            {slide.name}
          </h2>

          {slide.description && (
            <p style={{ color: 'rgba(250,250,248,0.6)', fontSize: 14, marginBottom: 16, maxWidth: 380 }}>
              {slide.description.slice(0, 100)}{slide.description.length > 100 ? '…' : ''}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span className="gold-text" style={{ fontSize: 24, fontWeight: 700 }}>{format(slide.price)}</span>
            {slide.original_price > slide.price && (
              <span style={{ fontSize: 15, color: 'rgba(250,250,248,0.5)', textDecoration: 'line-through' }}>{format(slide.original_price)}</span>
            )}
            <button
              onClick={() => navigate(`/product/${slide.id}`)}
              className="btn-gold"
              style={{ fontSize: 13, padding: '8px 20px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              View product <ArrowRight size={14} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', cursor: 'pointer', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}><ChevronLeft size={20} strokeWidth={1.75} /></button>
          <button onClick={next} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', cursor: 'pointer', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}><ChevronRight size={20} strokeWidth={1.75} /></button>
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
