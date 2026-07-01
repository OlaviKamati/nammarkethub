import { useProducts } from '../hooks/useProducts'
import ProductCard from './ProductCard'
import { useScrollReveal } from '../hooks/useScrollReveal'

function SkeletonCard() {
  return (
    <div style={{ background: 'var(--black-card)', borderRadius: 16, border: '1px solid var(--black-border)', overflow: 'hidden' }}>
      <div style={{ aspectRatio: '1', background: 'linear-gradient(90deg, #161616 25%, #1E1E1E 50%, #161616 75%)', backgroundSize: '200% 100%', animation: 'shimmerBg 1.5s infinite' }} />
      <div style={{ padding: 14 }}>
        <div style={{ height: 12, background: '#1E1E1E', borderRadius: 6, marginBottom: 8, width: '80%' }} />
        <div style={{ height: 10, background: '#1E1E1E', borderRadius: 6, marginBottom: 12, width: '50%' }} />
        <div style={{ height: 14, background: '#1A1500', borderRadius: 6, width: '40%' }} />
      </div>
    </div>
  )
}

export default function ProductGrid({ category, searchQuery, shopType }) {
  const { products, loading, error } = useProducts(category, searchQuery, shopType)
  const revealRef = useScrollReveal(0.05)

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (error) {
    return <div style={{ padding: '24px', color: '#ef4444', fontSize: 14 }}>Couldn't load products: {error}</div>
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
        <p style={{ color: 'var(--white-dim)', fontSize: 14 }}>
          {searchQuery ? `No results for "${searchQuery}"` : 'No products here yet.'}
        </p>
      </div>
    )
  }

  return (
    <div ref={revealRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
      {products.map((product, i) => (
        <div
          key={product.id}
          className="reveal"
          style={{ transitionDelay: `${Math.min(i * 40, 400)}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}
