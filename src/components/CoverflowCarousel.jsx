import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// 3D coverflow carousel — drag/flick to browse, cards tilt and recede as they
// move away from center. Pure DOM transform writes on a rAF loop (no React
// re-render per frame); React state only tracks which index is selected.
export default function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = 'clamp(148px, 22vw, 260px)',
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  label = 'Cover carousel',
  onSelect,
}) {
  const count = slides.length

  const frameRef = useRef(null)
  const cardRefs = useRef([])
  const posRef = useRef(0)
  const targetRef = useRef(0)
  const widthRef = useRef(0)
  const rafRef = useRef(null)
  const dragRef = useRef(null)

  const [selected, setSelected] = useState(0)

  const indexAt = useCallback((pos) => ((Math.round(pos) % count) + count) % count, [count])

  const paint = useCallback(() => {
    const width = widthRef.current
    if (!width) return
    const pitch = width * (1 + gap)
    const pos = posRef.current

    cardRefs.current.forEach((card, index) => {
      if (!card) return

      let offset = index - pos
      if (loop) {
        offset = ((offset % count) + count) % count
        if (offset > count / 2) offset -= count
      }

      const distance = Math.abs(offset)
      const ramp = Math.pow(distance, falloff)
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset)

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`

      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge)
      card.style.zIndex = String(100 - Math.round(distance))
    })
  }, [count, depth, fade, falloff, gap, loop, rotate])

  const settle = useCallback(
    (target) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      targetRef.current = target
      setSelected(indexAt(target))

      const step = () => {
        const remaining = target - posRef.current
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target
          paint()
          rafRef.current = null
          return
        }
        posRef.current += remaining * 0.16
        paint()
        rafRef.current = requestAnimationFrame(step)
      }
      rafRef.current = requestAnimationFrame(step)
    },
    [indexAt, paint]
  )

  const clamp = useCallback((pos) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))), [count, loop])

  const goTo = useCallback(
    (index) => {
      const target = loop ? index + Math.round((targetRef.current - index) / count) * count : index
      settle(clamp(target))
    },
    [clamp, count, loop, settle]
  )

  const nudge = useCallback((by) => settle(clamp(Math.round(targetRef.current) + by)), [clamp, settle])

  function onPointerDown(event) {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.style.cursor = 'grabbing'
    targetRef.current = posRef.current
    dragRef.current = { id: event.pointerId, x: event.clientX, pos: posRef.current, v: 0, t: performance.now(), moved: false }
  }

  function onPointerMove(event) {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return

    const pitch = widthRef.current * (1 + gap)
    if (!pitch) return

    const now = performance.now()
    const previous = posRef.current
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch)
    if (Math.abs(event.clientX - drag.x) > 4) drag.moved = true
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000
    drag.t = now

    const index = indexAt(posRef.current)
    if (index !== selected) setSelected(index)
    paint()
  }

  function endDrag(event) {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    event.currentTarget.style.cursor = 'grab'
    dragRef.current = null
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18))
    settle(clamp(Math.round(posRef.current + carried)))
  }

  function handleCardClick(index, wasDragging) {
    if (wasDragging) return
    if (index === selected) {
      onSelect?.(slides[index], index)
    } else {
      goTo(index)
    }
  }

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const measure = () => {
      const card = cardRefs.current[0]
      if (!card) return
      widthRef.current = card.offsetWidth
      paint()
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [paint])

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
  }, [])

  const active = slides[selected]

  return (
    <div style={{ width: '100%', ['--cf-card']: cardWidth }} role="region" aria-roledescription="carousel" aria-label={label}>
      <div style={{ position: 'relative' }}>
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); nudge(-1) }
            else if (event.key === 'ArrowRight') { event.preventDefault(); nudge(1) }
          }}
          style={{
            cursor: 'grab', overflow: 'hidden', padding: '40px 0', outline: 'none',
            perspective: `calc(var(--cf-card) * ${perspective})`, touchAction: 'pan-y',
          }}
        >
          <div style={{ position: 'relative', userSelect: 'none', height: 'var(--cf-card)', transformStyle: 'preserve-3d' }}>
            {slides.map((slide, index) => (
              <div
                key={index}
                ref={(node) => { cardRefs.current[index] = node }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                onClick={() => handleCardClick(index, dragRef.current?.moved)}
                style={{
                  position: 'absolute', left: '50%', top: 0, aspectRatio: '1', overflow: 'hidden',
                  borderRadius: 16, background: 'var(--black-card)', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.5)',
                  willChange: 'transform', width: 'var(--cf-card)', cursor: 'pointer',
                }}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  draggable={false}
                  loading="lazy"
                  style={{ height: '100%', width: '100%', userSelect: 'none', objectFit: 'cover', display: 'block' }}
                />
              </div>
            ))}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 200, borderRadius: '50%', border: 'none', background: 'rgba(10,10,10,0.7)', color: 'var(--nav-ink)', padding: 8, backdropFilter: 'blur(8px)', cursor: 'pointer', display: 'flex' }}
            >
              <ChevronLeft size={18} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 200, borderRadius: '50%', border: 'none', background: 'rgba(10,10,10,0.7)', color: 'var(--nav-ink)', padding: 8, backdropFilter: 'blur(8px)', cursor: 'pointer', display: 'flex' }}
            >
              <ChevronRight size={18} strokeWidth={1.75} />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <div key={selected} className="fade-in" style={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
          <p style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--white)', textAlign: 'center' }}>{active.title}</p>
          {active.subtitle && (
            <p style={{ marginTop: 4, fontSize: 13, color: 'var(--white-dim)' }}>{active.subtitle}</p>
          )}
          {active.meta && active.meta.length > 0 && (
            <dl style={{ marginTop: 14, width: '100%', maxWidth: 230, fontSize: 12 }}>
              {active.meta.map((row) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                  <dt style={{ color: 'var(--white-dim)' }}>{row.label}</dt>
                  <dd style={{ fontWeight: 600, color: 'var(--white)' }}>{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {showPagination && (
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              style={{ width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'var(--gold)', opacity: index === selected ? 1 : 0.3, transition: 'opacity 0.2s' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
