import { useEffect, useState } from 'react'
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCurrency } from '../hooks/useCurrency'

const STATUS_LABEL = {
  pending: 'Pending', attending: 'Attending', in_progress: 'In Progress',
  completed: 'Resolved', cancelled: 'Cancelled',
}
const STATUS_ORDER = ['pending', 'attending', 'in_progress', 'completed', 'cancelled']

// Every number here comes straight from this shop's own orders/products — no projections,
// no industry benchmarks, nothing simulated.
export default function ShopAnalytics({ shopId }) {
  const { format } = useCurrency()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('orders')
      .select('id, quantity, status, products!inner(name, price, shop_id)')
      .eq('products.shop_id', shopId)
      .then(({ data }) => { setOrders(data ?? []); setLoading(false) })
  }, [shopId])

  if (loading) return <p style={{ fontSize: 13, color: 'var(--white-dim)' }}>Loading…</p>

  const completed = orders.filter((o) => o.status === 'completed')
  const revenue = completed.reduce((sum, o) => sum + Number(o.products?.price ?? 0) * o.quantity, 0)
  const statusCounts = STATUS_ORDER.map((s) => ({ status: s, count: orders.filter((o) => o.status === s).length }))

  const byProduct = {}
  orders.forEach((o) => {
    const name = o.products?.name ?? 'Unknown'
    byProduct[name] = (byProduct[name] ?? 0) + o.quantity
  })
  const topProducts = Object.entries(byProduct).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 24 }}>
        {[
          { icon: DollarSign, label: 'Revenue (resolved orders)', value: format(revenue) },
          { icon: ShoppingBag, label: 'Total requests', value: orders.length },
          { icon: Package, label: 'Resolved orders', value: completed.length },
        ].map((kpi) => (
          <div key={kpi.label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--black-soft)', border: '1px solid var(--black-border)', borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <kpi.icon size={17} strokeWidth={1.75} color="var(--gold)" />
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', lineHeight: 1.1 }}>{kpi.value}</p>
              <p style={{ fontSize: 11, color: 'var(--white-dim)' }}>{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <div style={{ background: 'var(--black-soft)', border: '1px solid var(--black-border)', borderRadius: 14, padding: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)', marginBottom: 14 }}>Orders by status</p>
          {orders.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--white-dim)' }}>No orders yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {statusCounts.map(({ status, count }) => (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--white-dim)' }}>{STATUS_LABEL[status]}</span>
                    <span style={{ color: 'var(--white)', fontWeight: 600 }}>{count}</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--black-card)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: orders.length ? `${(count / orders.length) * 100}%` : '0%', height: '100%', background: 'linear-gradient(90deg, var(--gold-dark), var(--gold))', borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--black-soft)', border: '1px solid var(--black-border)', borderRadius: 14, padding: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={14} strokeWidth={1.75} color="var(--gold)" /> Most requested products
          </p>
          {topProducts.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--white-dim)' }}>No orders yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topProducts.map(([name, qty]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>{name}</span>
                  <span style={{ color: 'var(--gold-ink)', fontWeight: 600, flexShrink: 0 }}>{qty} requested</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
