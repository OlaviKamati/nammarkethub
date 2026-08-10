import { useEffect, useState } from 'react'
import { Store, Search, MapPin, Mic, MicOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import HeroCarousel from '../components/HeroCarousel'
import ShopStrip from '../components/ShopStrip'
import CategoryFilter from '../components/CategoryFilter'
import ProductGrid from '../components/ProductGrid'
import AnimatedCounter from '../components/AnimatedCounter'
import TrustBadges from '../components/TrustBadges'
import NewsletterSignup from '../components/NewsletterSignup'
import Footer from '../components/Footer'
import { SHOP_TYPES } from '../lib/shopTypes'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Home() {
  const [shopType, setShopType] = useState('all')
  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('all')
  const [locations, setLocations] = useState([])
  const [listening, setListening] = useState(false)
  const statsRef = useScrollReveal(0.2)

  const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null

  function handleShopType(type) {
    setShopType(type)
    setCategory('all')
  }

  function handleVoiceSearch() {
    if (!SpeechRecognition) return
    if (listening) { setListening(false); return }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.onresult = (e) => setSearchQuery(e.results[0][0].transcript)
    recognition.start()
  }

  useEffect(() => {
    supabase.from('shops').select('location').then(({ data }) => {
      const unique = Array.from(new Set((data ?? []).map((s) => s.location).filter(Boolean))).sort()
      setLocations(unique)
    })
  }, [])

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--black)' }} className="page-enter">

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
              <Store size={14} strokeWidth={1.75} /> All shops
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
                <t.icon size={14} strokeWidth={1.75} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shops near you */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Shops near you
            </p>
            {locations.length > 1 && (
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
                <button
                  onClick={() => setLocation('all')}
                  style={{
                    flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 11, fontWeight: location === 'all' ? 600 : 400,
                    padding: '5px 12px', borderRadius: 99, cursor: 'pointer',
                    border: location === 'all' ? 'none' : '1px solid var(--black-border)',
                    background: location === 'all' ? 'rgba(201,168,76,0.15)' : 'transparent',
                    color: location === 'all' ? 'var(--gold)' : 'var(--white-dim)',
                  }}
                >
                  <MapPin size={11} strokeWidth={1.75} /> All areas
                </button>
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocation(loc)}
                    style={{
                      flexShrink: 0, fontSize: 11, fontWeight: location === loc ? 600 : 400,
                      padding: '5px 12px', borderRadius: 99, cursor: 'pointer',
                      border: location === loc ? 'none' : '1px solid var(--black-border)',
                      background: location === loc ? 'rgba(201,168,76,0.15)' : 'transparent',
                      color: location === loc ? 'var(--gold)' : 'var(--white-dim)',
                    }}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
          <ShopStrip shopType={shopType} location={location} />
        </section>

        <div className="gold-divider" style={{ marginBottom: 28 }} />

        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ position: 'relative', maxWidth: 480 }}>
            <Search size={15} strokeWidth={1.75} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--white-dim)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={listening ? 'Listening…' : 'Search products…'}
              className="input-dark"
              style={{ width: '100%', paddingLeft: 44, paddingRight: SpeechRecognition ? 44 : 16, paddingTop: 10, paddingBottom: 10, fontSize: 14 }}
            />
            {SpeechRecognition && (
              <button
                onClick={handleVoiceSearch}
                aria-label={listening ? 'Stop voice search' : 'Search by voice'}
                title={listening ? 'Stop voice search' : 'Search by voice'}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  width: 26, height: 26, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: listening ? 'rgba(239,68,68,0.15)' : 'transparent',
                  color: listening ? '#ef4444' : 'var(--white-dim)',
                }}
              >
                {listening ? <MicOff size={14} strokeWidth={1.75} /> : <Mic size={14} strokeWidth={1.75} />}
              </button>
            )}
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

        <div className="gold-divider" style={{ margin: '48px 0 32px' }} />

        {/* Trust badges */}
        <div style={{ marginBottom: 32 }}>
          <TrustBadges />
        </div>

        {/* Newsletter */}
        <NewsletterSignup />

        <Footer />
      </main>
      </div>
    </>
  )
}
