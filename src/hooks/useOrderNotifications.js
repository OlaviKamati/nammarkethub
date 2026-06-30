import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Subscribes to new orders for the given shop's products in real-time.
// Returns a list of recent unread order notifications.
export function useOrderNotifications(shopId) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!shopId) return

    // Fetch recent orders on mount
    async function fetchRecent() {
      const { data } = await supabase
        .from('orders')
        .select('id, buyer_name, buyer_contact, quantity, status, created_at, products(name)')
        .eq('products.shop_id', shopId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (data) {
        setNotifications(data)
        setUnreadCount(data.filter((o) => o.status === 'pending').length)
      }
    }

    fetchRecent()

    // Real-time subscription for new orders
    const channel = supabase
      .channel(`orders-shop-${shopId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
      }, async (payload) => {
        // Fetch the full order with product name
        const { data } = await supabase
          .from('orders')
          .select('id, buyer_name, buyer_contact, quantity, status, created_at, products(name, shop_id)')
          .eq('id', payload.new.id)
          .maybeSingle()

        if (data && data.products?.shop_id === shopId) {
          setNotifications((prev) => [data, ...prev])
          setUnreadCount((c) => c + 1)
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [shopId])

  function clearUnread() {
    setUnreadCount(0)
  }

  return { notifications, unreadCount, clearUnread }
}
