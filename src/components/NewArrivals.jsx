import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCurrency } from '../hooks/useCurrency'
import { useScrollReveal } from '../hooks/useScrollReveal'
import CoverflowCarousel from './CoverflowCarousel'

export default function NewArrivals() {
  const [products, setProducts] = useState([])
  const { format } = useCurrency()
  const navigate = useNavigate()
  const revealRef = useScrollReveal(0.1, [products.length])

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, price, stock_count, photo_url, shops(name)')
      .eq('is_active', true)
      .not('photo_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(12)
      .then(({ data }) => setProducts(data ?? []))
  }, [])

  if (products.length === 0) return null

  const slides = products.map((p) => ({
    id: p.id,
    src: p.photo_url,
    alt: p.name,
    title: p.name,
    subtitle: p.shops?.name ?? 'NamMarketHub shop',
    meta: [
      { label: 'Price', value: format(p.price) },
      { label: 'Stock', value: `${p.stock_count} left` },
    ],
  }))

  return (
    <div ref={revealRef}>
      <section className="reveal" style={{ marginBottom: 40 }}>
        <h2 className="gold-shimmer font-display" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', textAlign: 'center', marginBottom: 6 }}>
          New arrivals
        </h2>
        <p style={{ fontSize: 12, color: 'var(--white-dim)', textAlign: 'center', marginBottom: 8 }}>
          Fresh listings, just landed. Drag to browse, tap a cover to view it
        </p>
        <CoverflowCarousel
          slides={slides}
          showCaption
          showNavigation
          showPagination
          label="New arrivals"
          onSelect={(slide) => navigate(`/product/${slide.id}`)}
        />
      </section>
    </div>
  )
}
