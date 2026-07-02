import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { CATEGORIES_BY_TYPE } from '../lib/shopTypes'
import ImageUpload from './ImageUpload'
import { useOrderNotifications } from '../hooks/useOrderNotifications'

const EMPTY_FORM = { name: '', category_id: '', price: '', stock_count: '', description: '', photo_url: '' }

const INPUT = {
  width: '100%',
  padding: '10px 14px',
  fontSize: 14,
  background: '#1A1A1A',
  border: '1px solid #2A2A2A',
  borderRadius: 10,
  color: '#FAFAF8',
  outline: 'none',
}

const LABEL = { fontSize: 11, color: '#A0A09A', display: 'block', marginBottom: 6 }

export default function ShopDashboard({ shop }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('products')

  const { notifications, unreadCount, clearUnread } = useOrderNotifications(shop.id)
  const categories = CATEGORIES_BY_TYPE[shop.shop_type] ?? CATEGORIES_BY_TYPE['general']

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase
      .from('products').select('*').eq('shop_id', shop.id).order('created_at', { ascending: false })
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [shop.id])

  useEffect(() => {
    if (!form.category_id && categories.length > 0) {
      setForm((f) => ({ ...f, category_id: categories[0].id }))
    }
  }, [categories])

  function startAdd() {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, category_id: categories[0]?.id ?? '' })
    setError(null)
    setShowForm(true)
  }

  function startEdit(p) {
    setEditingId(p.id)
    setForm({ name: p.name, category_id: p.category_id, price: p.price, stock_count: p.stock_count, description: p.description ?? '', photo_url: p.photo_url ?? '' })
    setError(null)
    setShowForm(true)
  }

  function cancelForm() { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); setError(null) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = { shop_id: shop.id, name: form.name, category_id: form.category_id, price: Number(form.price), stock_count: Number(form.stock_count), description: form.description || null, photo_url: form.photo_url || null, is_active: true }
    const { error } = editingId
      ? await supabase.from('products').update(payload).eq('id', editingId)
      : await supabase.from('products').insert(payload)
    setSaving(false)
    if (error) { setError('Could not save. Try again.'); return }
    cancelForm()
    fetchProducts()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  async function toggleActive(p) {
    await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id)
    fetchProducts()
  }

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, background: '#161616', borderRadius: 14, padding: 4, width: 'fit-content', marginBottom: 24, border: '1px solid #2A2A2A' }}>
        <button onClick={() => setTab('products')}
          style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
            background: tab === 'products' ? 'linear-gradient(135deg, #C9A84C, #9A7A2E)' : 'transparent',
            color: tab === 'products' ? '#0A0A0A' : '#A0A09A' }}>
          Products ({products.length})
        </button>
        <button onClick={() => { setTab('orders'); clearUnread() }}
          style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
            background: tab === 'orders' ? 'linear-gradient(135deg, #C9A84C, #9A7A2E)' : 'transparent',
            color: tab === 'orders' ? '#0A0A0A' : '#A0A09A' }}>
          Orders
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: 10, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {tab === 'products' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FAFAF8' }}>Your products</h2>
            {!showForm && (
              <button onClick={startAdd} className="btn-gold" style={{ fontSize: 13, padding: '8px 18px' }}>
                + Add product
              </button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#FAFAF8', marginBottom: 16 }}>
                {editingId ? 'Edit product' : 'New product'}
              </h3>
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={LABEL}>Product name</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={INPUT} placeholder="e.g. Samsung Galaxy A15" />
                  </div>
                  <div>
                    <label style={LABEL}>Category</label>
                    <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      style={{ ...INPUT }}>
                      {categories.map((c) => <option key={c.id} value={c.id} style={{ background: '#1A1A1A', color: '#FAFAF8' }}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={LABEL}>Price (N$)</label>
                    <input required type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      style={INPUT} placeholder="0" />
                  </div>
                  <div>
                    <label style={LABEL}>Stock count</label>
                    <input required type="number" min={0} value={form.stock_count} onChange={(e) => setForm({ ...form, stock_count: e.target.value })}
                      style={INPUT} placeholder="0" />
                  </div>
                  <div>
                    <label style={LABEL}>Product photo (optional)</label>
                    <ImageUpload value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url })} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={LABEL}>Description (optional)</label>
                    <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      style={{ ...INPUT, resize: 'vertical' }} placeholder="Brief description" />
                  </div>
                </div>

                {error && <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 12 }}>{error}</p>}

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" disabled={saving} className="btn-gold" style={{ fontSize: 13, padding: '10px 20px' }}>
                    {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add product'}
                  </button>
                  <button type="button" onClick={cancelForm} className="btn-outline" style={{ fontSize: 13, padding: '10px 20px' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products list */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1,2,3].map((i) => <div key={i} style={{ height: 64, background: '#161616', borderRadius: 12, border: '1px solid #2A2A2A' }} />)}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ fontSize: 28, marginBottom: 10 }}>📦</p>
              <p style={{ fontSize: 14, color: '#A0A09A' }}>No products yet. Add your first one.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {products.map((p) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#111', border: '1px solid #2A2A2A', borderRadius: 12, padding: '12px 14px', opacity: p.is_active ? 1 : 0.5 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#1A1A1A', flexShrink: 0, overflow: 'hidden', border: '1px solid #2A2A2A' }}>
                    {p.photo_url
                      ? <img src={p.photo_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📦</div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#FAFAF8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: '#A0A09A' }}>N${Number(p.price).toLocaleString()} · {p.stock_count} in stock</p>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                    <button onClick={() => toggleActive(p)} style={{ fontSize: 12, color: '#A0A09A', background: 'none', border: 'none', cursor: 'pointer' }}>{p.is_active ? 'Hide' : 'Show'}</button>
                    <button onClick={() => startEdit(p)} style={{ fontSize: 12, color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FAFAF8' }}>Incoming orders</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#C9A84C', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} className="pulse-dot" />
              LIVE
            </div>
          </div>

          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ fontSize: 28, marginBottom: 10 }}>📬</p>
              <p style={{ fontSize: 14, color: '#A0A09A' }}>No orders yet. They'll appear here in real time.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notifications.map((order) => (
                <div key={order.id} style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#FAFAF8', marginBottom: 4 }}>{order.products?.name ?? 'Product'}</p>
                    <p style={{ fontSize: 12, color: '#A0A09A' }}>{order.buyer_name} · {order.buyer_contact} · qty {order.quantity}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 99,
                      background: order.status === 'pending' ? 'rgba(201,168,76,0.1)' : 'rgba(34,197,94,0.1)',
                      color: order.status === 'pending' ? '#C9A84C' : '#22c55e',
                      border: `1px solid ${order.status === 'pending' ? 'rgba(201,168,76,0.2)' : 'rgba(34,197,94,0.2)'}` }}>
                      {order.status}
                    </span>
                    <p style={{ fontSize: 11, color: '#A0A09A', marginTop: 4 }}>{timeAgo(order.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
