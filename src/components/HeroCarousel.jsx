import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function HeroCarousel() {
  const [slides, setSlides] = useState([])
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, price, photo_url, description, category_id, shops(name)')
      .eq('is_active', true)
      .not('photo_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setSlides(data ?? []))
  }, [])

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (paused || slides.length < 2) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [paused, next, slides.length])

  if (slides.length === 0) return null

  const slide = slides[current]
  const priceFormatted = Number(slide.price).toLocaleString('en-NA', { minimumFractionDigits: 0 })

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-stone-900 mb-8"
      style={{ minHeight: 320 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          key={slide.id}
          src={slide.photo_url}
          alt={slide.name}
          className="w-full h-full object-cover opacity-50 carousel-slide"
          style={{ filter: 'blur(0px)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col justify-end h-full" style={{ minHeight: 320 }}>
        <div className="fade-up" key={slide.id}>
          <span className="tag inline-block bg-white/10 text-white/70 px-2.5 py-1 rounded-full mb-3">
            {slide.shops?.name ?? 'NamMarketHub'}
          </span>
          <h2 className="text-white text-2xl font-semibold tracking-tight mb-1 max-w-sm">
            {slide.name}
          </h2>
          {slide.description && (
            <p className="text-white/60 text-sm mb-3 max-w-xs line-clamp-2">
              {slide.description}
            </p>
          )}
          <div className="flex items-center gap-3">
            <span className="text-white text-lg font-medium">N${priceFormatted}</span>
            <button
              onClick={() => navigate(`/product/${slide.id}`)}
              className="bg-white text-stone-900 text-sm font-medium px-4 py-1.5 rounded-full hover:bg-stone-100 transition-colors"
            >
              View product
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors z-20"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors z-20"
            aria-label="Next"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={
              'w-1.5 rounded-full transition-all duration-300 ' +
              (i === current ? 'bg-white w-4 h-1.5' : 'bg-white/40 h-1.5')
            }
          />
        ))}
      </div>
    </div>
  )
}
