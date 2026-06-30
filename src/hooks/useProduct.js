import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useProduct(productId) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!productId) return
    let isCurrent = true

    async function fetch() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*, shops(id, name, location, whatsapp_number, description)')
        .eq('id', productId)
        .eq('is_active', true)
        .maybeSingle()

      if (!isCurrent) return
      if (error) setError(error.message)
      else setProduct(data)
      setLoading(false)
    }

    fetch()
    return () => { isCurrent = false }
  }, [productId])

  return { product, loading, error }
}
