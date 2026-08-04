import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useMyOrders(userId) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setOrders([]); setLoading(false); return }
    let isCurrent = true

    async function fetch() {
      setLoading(true)
      const { data } = await supabase
        .from('orders')
        .select('id, quantity, status, selected_options, group_id, created_at, products(name, photo_url, price, shops(name))')
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false })

      if (!isCurrent) return
      setOrders(data ?? [])
      setLoading(false)
    }

    fetch()
    return () => { isCurrent = false }
  }, [userId])

  return { orders, loading }
}
