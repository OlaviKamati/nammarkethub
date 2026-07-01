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
    if (shopType && shopType !== 'all') query = query.eq('shop_type', shopType)
    query.then(({ data }) => { setShops(data ?? []); setLoading(false) })
  }, [shopType])

  if (loading) {
    return (
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
        {[1,2,3,4].map((i) => (
          <div key={i} style={{ minWidth: 160, height: 80, background: 'var(--black-card)', borderRadius: 14, border: '1px solid var(--black-border)', flexShrink: 0 }} />
        ))}
      </div>
    )
  }

  if (shops.length === 0) {
    return <p style={{ color: 'var(--white-dim)', fontSize: 13 }}>No shops yet — be the first.</p>
  }

  return (
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, marginLeft: -4, paddingLeft: 4 }}>
      {shops.map((shop, i) => {
        const type = getShopType(shop.shop_type)
        const count = shop.products?.[0]?.count ?? 0
        return (
          <div
            key={shop.id}
            className="card fade-up"
            style={{ minWidth: 168, flexShrink: 0, padding: '14px', animationDelay: `${i * 60}ms`, cursor: 'default' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, var(--gold-dark), #1A1500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.2)', flexShrink: 0 }}>
                {initials(shop.name)}
              </div>
              <span style={{ fontSize: 18 }}>{type.emoji}</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {shop.name}
            </p>
            <p style={{ fontSize: 11, color: 'var(--white-dim)' }}>
              {shop.location} · {count} listing{count !== 1 ? 's' : ''}
            </p>
          </div>
        )
      })}
    </div>
  )
}
