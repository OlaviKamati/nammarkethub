import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useProducts(categoryId, searchQuery, shopType) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('products')
      .select('id, name, description, price, photo_url, stock_count, category_id, shops(id, name, location, shop_type)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId)
    }
    if (searchQuery && searchQuery.trim() !== '') {
      query = query.ilike('name', `%${searchQuery.trim()}%`)
    }
    if (shopType && shopType !== 'all') {
      query = query.eq('shops.shop_type', shopType)
    }

    const { data, error } = await query
    if (error) setError(error.message)
    else setProducts(data ?? [])
    setLoading(false)
  }, [categoryId, searchQuery, shopType])

  // Initial fetch
  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Real-time: re-fetch when any product changes
  useEffect(() => {
    const channel = supabase
      .channel('products-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchProducts])

  return { products, loading, error }
}
