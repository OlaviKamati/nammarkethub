import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getShopType } from '../lib/shopTypes'

function initials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function ShopStrip({ shopType }) {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let query = supabase
      .from('shops')
      .select('id, name, location, shop_type, products(count)')
      .order('created_at', { ascending: false })

    if (shopType && shopType !== 'all') {
      query = query.eq('shop_type', shopType)
    }

    query.then(({ data }) => {
      setShops(data ?? [])
      setLoading(false)
    })
  }, [shopType])

  if (loading) {
    return (
      <div className="flex gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-40 h-20 bg-stone-100 rounded-xl animate-pulse flex-shrink-0" />
        ))}
      </div>
    )
  }

  if (shops.length === 0) {
    return <p className="text-sm text-stone-400">No shops yet.</p>
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
      {shops.map((shop) => {
        const type = getShopType(shop.shop_type)
        return (
          <div
            key={shop.id}
            className="card-lift flex-shrink-0 w-44 bg-white border border-stone-200/80 rounded-xl p-3 cursor-default"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs ${type.color}`}>
                {initials(shop.name)}
              </div>
              <span className="text-base">{type.emoji}</span>
            </div>
            <p className="text-sm font-medium text-stone-900 truncate">{shop.name}</p>
            <p className="text-xs text-stone-400 mt-0.5">
              {shop.location} · {shop.products?.[0]?.count ?? 0} listings
            </p>
          </div>
        )
      })}
    </div>
  )
}
