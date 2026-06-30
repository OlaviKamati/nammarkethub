import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { CATEGORIES_BY_TYPE } from '../lib/shopTypes'
import { useOrderNotifications } from '../hooks/useOrderNotifications'

const EMPTY_FORM = { name: '', category_id: '', price: '', stock_count: '', description: '', photo_url: '' }

export default function ShopDashboard({ shop }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('products') // 'products' | 'orders'

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

  // Init default category when shop type loads
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
      <div className="flex gap-1 mb-5 bg-stone-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('products')}
          className={`text-sm px-4 py-1.5 rounded-lg transition-colors ${tab === 'products' ? 'bg-white shadow-sm font-medium' : 'text-stone-500'}`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => { setTab('orders'); clearUnread() }}
          className={`text-sm px-4 py-1.5 rounded-lg transition-colors relative ${tab === 'orders' ? 'bg-white shadow-sm font-medium' : 'text-stone-500'}`}
        >
          Orders
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {tab === 'products' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-stone-900">Your products</h2>
            {!showForm && (
              <button onClick={startAdd} className="text-sm bg-stone-900 text-white rounded-full px-4 py-1.5 hover:bg-stone-800 transition-colors">
                + Add product
              </button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mb-5">
              <h3 className="text-sm font-semibold text-stone-900 mb-3">{editingId ? 'Edit product' : 'New product'}</h3>
              <form onSubmit={handleSave} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-stone-500 block mb-1">Product name</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-stone-400" placeholder="Product name" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Category</label>
                    <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none">
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Price (N$)</label>
                    <input required type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Stock count</label>
                    <input required type="number" min={0} value={form.stock_count} onChange={(e) => setForm({ ...form, stock_count: e.target.value })}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Photo URL (optional)</label>
                    <input type="url" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none" placeholder="https://..." />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-stone-500 block mb-1">Description (optional)</label>
                    <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none" placeholder="Brief description" />
                  </div>
                </div>
                {error && <p className="text-xs text-red-600">{error}</p>}
                <div className="flex gap-2">
                  <button type="submit" disabled={saving}
                    className="bg-stone-900 text-white rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-50 hover:bg-stone-800 transition-colors">
                    {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add product'}
                  </button>
                  <button type="button" onClick={cancelForm}
                    className="border border-stone-200 rounded-xl px-4 py-2 text-sm text-stone-600 hover:border-stone-300 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products list */}
          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map((i) => <div key={i} className="h-16 bg-stone-100 rounded-xl animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-2xl mb-2">📦</p>
              <p className="text-sm text-stone-400">No products yet. Add your first one.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className={`flex items-center gap-3 bg-white border rounded-xl p-3 transition-opacity ${p.is_active ? 'border-stone-200' : 'border-stone-100 opacity-50'}`}>
                  <div className="w-10 h-10 rounded-lg bg-stone-50 flex-shrink-0 overflow-hidden border border-stone-100">
                    {p.photo_url
                      ? <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-lg">📦</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">{p.name}</p>
                    <p className="text-xs text-stone-400">N${Number(p.price).toLocaleString()} · {p.stock_count} in stock</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => toggleActive(p)} className="text-xs text-stone-400 hover:text-stone-600">{p.is_active ? 'Hide' : 'Show'}</button>
                    <button onClick={() => startEdit(p)} className="text-xs text-teal-700 hover:text-teal-900">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-stone-900">Incoming orders</h2>
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot inline-block" />
              Live
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-2xl mb-2">📬</p>
              <p className="text-sm text-stone-400">No orders yet. They'll appear here in real time.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((order) => (
                <div key={order.id} className="bg-white border border-stone-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-stone-900">{order.products?.name ?? 'Product'}</p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {order.buyer_name} · {order.buyer_contact} · qty {order.quantity}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`tag px-2 py-0.5 rounded-full ${order.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                        {order.status}
                      </span>
                      <p className="text-xs text-stone-400 mt-1">{timeAgo(order.created_at)}</p>
                    </div>
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
