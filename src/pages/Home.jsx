import { useState } from 'react'
import Navbar from '../components/Navbar'
import HeroCarousel from '../components/HeroCarousel'
import ShopStrip from '../components/ShopStrip'
import CategoryFilter from '../components/CategoryFilter'
import ProductGrid from '../components/ProductGrid'
import { SHOP_TYPES } from '../lib/shopTypes'

export default function Home() {
  const [shopType, setShopType] = useState('all')
  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Reset category when shop type changes
  function handleShopType(type) {
    setShopType(type)
    setCategory('all')
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Shop type filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1">
          <button
            onClick={() => handleShopType('all')}
            className={
              'flex-shrink-0 flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border transition-colors ' +
              (shopType === 'all'
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300')
            }
          >
            🏬 All shops
          </button>
          {SHOP_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => handleShopType(t.id)}
              className={
                'flex-shrink-0 flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border transition-colors ' +
                (shopType === t.id
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300')
              }
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* Shops near you */}
        <section className="mb-6">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wider mb-3">
            Shops near you
          </p>
          <ShopStrip shopType={shopType} />
        </section>

        {/* Search + Category filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-full text-sm focus:outline-none focus:border-stone-400 transition-colors"
            />
          </div>
        </div>

        <div className="mb-5">
          <CategoryFilter
            active={category}
            onChange={setCategory}
            shopType={shopType}
          />
        </div>

        {/* Product grid */}
        <ProductGrid
          category={category}
          searchQuery={searchQuery}
          shopType={shopType}
        />
      </main>
    </div>
  )
}
