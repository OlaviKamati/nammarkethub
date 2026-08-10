import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useShop(shopId) {
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!shopId) return
    let isCurrent = true

    async function fetch() {
      setLoading(true)

      const [{ data: shopData, error: shopError }, { data: productsData, error: productsError }] = await Promise.all([
        supabase.from('shops').select('*').eq('id', shopId).maybeSingle(),
        supabase
          .from('products')
          .select('id, name, description, price, original_price, photo_url, stock_count, category_id, created_at, shops(id, name, location, shop_type, is_verified)')
          .eq('shop_id', shopId)
          .eq('is_active', true)
          .order('created_at', { ascending: false }),
      ])

      if (!isCurrent) return
      if (shopError || productsError) {
        setError(shopError?.message ?? productsError?.message)
      } else {
        setShop(shopData)
        setProducts(productsData ?? [])
        setError(null)
      }
      setLoading(false)
    }

    fetch()
    return () => { isCurrent = false }
  }, [shopId])

  return { shop, products, loading, error }
}
