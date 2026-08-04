import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useWishlist(userId) {
  const [productIds, setProductIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!userId) {
      setProductIds(new Set())
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('wishlist_items')
      .select('product_id')
      .eq('buyer_id', userId)
    setProductIds(new Set((data ?? []).map((r) => r.product_id)))
    setLoading(false)
  }, [userId])

  useEffect(() => { refetch() }, [refetch])

  async function toggle(productId) {
    if (!userId) return
    if (productIds.has(productId)) {
      await supabase.from('wishlist_items').delete().eq('buyer_id', userId).eq('product_id', productId)
      setProductIds((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    } else {
      await supabase.from('wishlist_items').insert({ buyer_id: userId, product_id: productId })
      setProductIds((prev) => new Set(prev).add(productId))
    }
  }

  return { productIds, loading, toggle, refetch }
}
