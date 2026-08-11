import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useWishlist } from '../hooks/useWishlist'

export default function WishlistButton({ productId, price, style, iconSize = 13 }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { productIds, toggle } = useWishlist(user?.id)
  const active = productIds.has(productId)

  function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate('/account', { state: { reason: 'wishlist' } })
      return
    }
    toggle(productId, price)
  }

  return (
    <button
      onClick={handleClick}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      style={{
        width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: 'rgba(10,10,10,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: active ? 'var(--gold)' : 'var(--nav-ink-dim)',
        ...style,
      }}
    >
      <Heart size={iconSize} strokeWidth={1.75} fill={active ? 'currentColor' : 'none'} />
    </button>
  )
}
