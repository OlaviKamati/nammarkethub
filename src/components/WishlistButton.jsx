import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useWishlist } from '../hooks/useWishlist'

export default function WishlistButton({ productId, style }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { productIds, toggle } = useWishlist(user?.id)
  const active = productIds.has(productId)

  function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate('/account')
      return
    }
    toggle(productId)
  }

  return (
    <button
      onClick={handleClick}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      style={{
        width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: 'rgba(10,10,10,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, color: active ? 'var(--gold)' : 'var(--white-dim)',
        ...style,
      }}
    >
      {active ? '♥' : '♡'}
    </button>
  )
}
