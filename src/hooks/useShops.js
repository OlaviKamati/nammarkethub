import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useShops() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isCurrent = true

    async function fetchShops() {
      setLoading(true)
      const { data, error } = await supabase
        .from('shops')
        .select('id, name, location, logo_url, products(count)')
        .order('created_at', { ascending: false })

      if (!isCurrent) return
      if (error) {
        setError(error.message)
      } else {
        setShops(data)
      }
      setLoading(false)
    }

    fetchShops()
    return () => { isCurrent = false }
  }, [])

  return { shops, loading, error }
}
