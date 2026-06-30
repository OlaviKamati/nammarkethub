import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Fetches the shop owned by the given user id. Returns null (not an
// error) if the user is logged in but hasn't created a shop yet —
// that's how the signup flow decides which form to show.
export function useMyShop(userId) {
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    if (!userId) {
      setShop(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', userId)
      .maybeSingle()

    if (error) {
      setError(error.message)
    } else {
      setShop(data)
      setError(null)
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { shop, loading, error, refetch }
}
