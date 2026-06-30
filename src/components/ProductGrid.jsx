import { useProducts } from '../hooks/useProducts'
import ProductCard from './ProductCard'

export default function ProductGrid({ category, searchQuery, shopType }) {
  const { products, loading, error } = useProducts(category, searchQuery, shopType)

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-stone-100 rounded-2xl aspect-square animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-sm text-red-600 py-6">Couldn't load products. {error}</div>
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-2xl mb-2">🔍</p>
        <p className="text-sm text-stone-500">
          {searchQuery ? `No results for "${searchQuery}"` : 'No products here yet.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="fade-up"
          style={{ animationDelay: `${i * 30}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}
