import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const SEEN_KEY = 'nammarkethub_seen_order_statuses'

function loadSeen() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

function saveSeen(set) {
  localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(set)))
}

// Tracks status changes (shop updates) on the buyer's own orders, in real time.
// "Unread" is tracked client-side (order id + status pairs already seen) since orders
// have no read-flag column — nothing fabricated, just what this browser has shown before.
export function useMyOrderNotifications(userId) {
  const [orders, setOrders] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!userId) return

    async function fetchRecent() {
      const { data } = await supabase
        .from('orders')
        .select('id, status, quantity, created_at, products(name)')
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (data) {
        setOrders(data)
        const seen = loadSeen()
        setUnreadCount(data.filter((o) => !seen.has(`${o.id}:${o.status}`)).length)
      }
    }

    fetchRecent()

    const channel = supabase
      .channel(`my-orders-${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `buyer_id=eq.${userId}`,
      }, (payload) => {
        setOrders((prev) => {
          const exists = prev.some((o) => o.id === payload.new.id)
          const next = exists
            ? prev.map((o) => (o.id === payload.new.id ? { ...o, status: payload.new.status } : o))
            : [{ ...payload.new, products: null }, ...prev]
          return next
        })
        setUnreadCount((c) => c + 1)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId])

  function markAllSeen() {
    const seen = loadSeen()
    orders.forEach((o) => seen.add(`${o.id}:${o.status}`))
    saveSeen(seen)
    setUnreadCount(0)
  }

  return { orders, unreadCount, markAllSeen }
}
