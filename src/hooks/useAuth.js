import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Tracks the logged-in user (or null) and keeps it in sync with
// Supabase's auth state — so any component can know "who's logged in"
// without re-fetching.
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return { user, loading }
}
