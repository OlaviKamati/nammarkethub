import { useNavigate } from 'react-router-dom'
import { getShopType } from '../lib/shopTypes'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const shopName = product.shops?.name ?? 'Unknown shop'
  const shopType = getShopType(product.shops?.shop_type)
  const priceFormatted = Number(product.price).toLocaleString('en-NA', { minimumFractionDigits: 0 })
  const inStock = product.stock_count > 0

  return (
    <button
      onClick={() => navigate(`/product/${product.id}`)}
      className="card-lift text-left bg-white border border-stone-200/80 rounded-2xl overflow-hidden w-full"
    >
      {/* Image */}
      <div className="relative aspect-square bg-stone-50 overflow-hidden">
        {product.photo_url ? (
          <img
            src={product.photo_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {shopType.emoji}
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="tag bg-stone-800 text-white px-2 py-1 rounded">Out of stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-stone-900 leading-tight line-clamp-2 mb-0.5">
          {product.name}
        </p>
        <p className="text-xs text-stone-400 mb-2">{shopName}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-stone-900">N${priceFormatted}</span>
          {inStock && (
            <span className="tag bg-stone-50 text-stone-400 px-1.5 py-0.5 rounded border border-stone-100">
              {product.stock_count} left
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
