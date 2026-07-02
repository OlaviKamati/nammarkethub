import { useState } from 'react'
import Navbar from '../components/Navbar'
import HeroCarousel from '../components/HeroCarousel'
import ShopStrip from '../components/ShopStrip'
import CategoryFilter from '../components/CategoryFilter'
import ProductGrid from '../components/ProductGrid'
import AnimatedCounter from '../components/AnimatedCounter'
import { SHOP_TYPES } from '../lib/shopTypes'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Home() {
  const [shopType, setShopType] = useState('all')
  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const statsRef = useScrollReveal(0.2)

  function handleShopType(type) {
    setShopType(type)
    setCategory('all')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }} className="page-enter">
      <Navbar />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Stats bar */}
        <div
          ref={statsRef}
          className='stats-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--black-border)', borderRadius: 16, overflow: 'hidden', marginBottom: 40, border: '1px solid var(--black-border)' }}
        >
          {[
            { label: 'Shops', value: 50, suffix: '+' },
            { label: 'Products', value: 500, suffix: '+' },
            { label: 'Categories', value: 22, suffix: '' },
            { label: 'Cities', value: 8, suffix: '' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="reveal"
              style={{ background: 'var(--black-card)', padding: '20px 24px', textAlign: 'center', transitionDelay: `${i * 100}ms` }}
            >
              <div className="gold-text" style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--white-dim)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Gold divider */}
        <div className="gold-divider" style={{ marginBottom: 32 }} />

        {/* Shop type filter */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Shop by category
          </p>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            <button
              onClick={() => handleShopType('all')}
              style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: shopType === 'all' ? 600 : 400,
                padding: '8px 16px', borderRadius: 99, cursor: 'pointer',
                border: shopType === 'all' ? 'none' : '1px solid var(--black-border)',
                background: shopType === 'all' ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' : 'var(--black-card)',
                color: shopType === 'all' ? 'var(--black)' : 'var(--white-dim)',
                transition: 'all 0.2s var(--ease-expo)',
              }}
            >
              🏬 All shops
            </button>
            {SHOP_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleShopType(t.id)}
                style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: shopType === t.id ? 600 : 400,
                  padding: '8px 16px', borderRadius: 99, cursor: 'pointer',
                  border: shopType === t.id ? 'none' : '1px solid var(--black-border)',
                  background: shopType === t.id ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' : 'var(--black-card)',
                  color: shopType === t.id ? 'var(--black)' : 'var(--white-dim)',
                  transition: 'all 0.2s var(--ease-expo)',
                }}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shops near you */}
        <section style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Shops near you
          </p>
          <ShopStrip shopType={shopType} />
        </section>

        <div className="gold-divider" style={{ marginBottom: 28 }} />

        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ position: 'relative', maxWidth: 480 }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--white-dim)' }}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="input-dark"
              style={{ width: '100%', paddingLeft: 44, paddingRight: 16, paddingTop: 10, paddingBottom: 10, fontSize: 14 }}
            />
          </div>
        </div>

        {/* Category filter */}
        <div style={{ marginBottom: 24 }}>
          <CategoryFilter active={category} onChange={setCategory} shopType={shopType} />
        </div>

        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {searchQuery ? `Results for "${searchQuery}"` : 'All products'}
          </p>
        </div>

        {/* Product grid */}
        <ProductGrid category={category} searchQuery={searchQuery} shopType={shopType} />

        {/* Footer */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid var(--black-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <img src="/logo.svg" alt="NamMarketHub" style={{ height: 28, opacity: 0.7 }} />
          <p style={{ fontSize: 11, color: 'var(--white-dim)', fontFamily: 'ui-monospace, monospace' }}>
            © {new Date().getFullYear()} NAMMARKETHUB · MADE IN NAMIBIA 🇳🇦
          </p>
        </div>
      </main>
    </div>
  )
}
