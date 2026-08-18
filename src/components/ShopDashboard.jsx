import { useState, useEffect } from 'react'
import { Phone, RefreshCw, CheckCircle2, Bell, Inbox, Receipt, Pencil, ChevronUp, ChevronDown, X, MessageCircle, Package, Plus, ShoppingBag, Sparkles, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { CATEGORIES_BY_TYPE } from '../lib/shopTypes'
import ImageUpload from './ImageUpload'
import ShopSettingsForm from './ShopSettingsForm'
import ProductOptionsEditor from './ProductOptionsEditor'
import LaybyProgressBar from './LaybyProgressBar'
import ShopAnalytics from './ShopAnalytics'
import { useOrderNotifications } from '../hooks/useOrderNotifications'

const EMPTY_FORM = { name: '', category_id: '', price: '', original_price: '', stock_count: '', description: '', photo_url: '', options: [], feature_requested: false }

const STATUS_CONFIG = {
  pending:     { label: 'Pending',     color: 'var(--gold-ink)', bg: 'rgba(201,168,76,0.1)',  border: 'rgba(201,168,76,0.2)',  next: 'attending',   nextLabel: 'Attending',   nextIcon: Phone },
  attending:   { label: 'Attending',   color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.2)', next: 'in_progress', nextLabel: 'In Progress', nextIcon: RefreshCw },
  in_progress: { label: 'In Progress', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)', next: 'completed',   nextLabel: 'Resolve',     nextIcon: CheckCircle2 },
  completed:   { label: 'Resolved',    color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)',  next: null,          nextLabel: null, nextIcon: null },
  cancelled:   { label: 'Cancelled',   color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',  next: null,          nextLabel: null, nextIcon: null },
}

function OrdersTab({ shopId, notifications, onOrderChange, timeAgo }) {
  const [expandedId, setExpandedId] = useState(null)
  const [noteInputs, setNoteInputs] = useState({})
  const [depositInputs, setDepositInputs] = useState({})
  const [saving, setSaving] = useState({})
  const [filterStatus, setFilterStatus] = useState('active') // 'active' | 'completed' | 'all'

  async function updateStatus(orderId, newStatus) {
    setSaving(s => ({ ...s, [orderId]: true }))
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    setSaving(s => ({ ...s, [orderId]: false }))
    if (error) { alert('Could not update this order. Please try again.'); return }
    onOrderChange(orderId, { status: newStatus })
  }

  async function saveNote(orderId) {
    const note = noteInputs[orderId]?.trim()
    if (!note) return
    setSaving(s => ({ ...s, [`note_${orderId}`]: true }))
    const { error } = await supabase.from('orders').update({ notes: note }).eq('id', orderId)
    setSaving(s => ({ ...s, [`note_${orderId}`]: false }))
    if (error) { alert('Could not save this note. Please try again.'); return }
    onOrderChange(orderId, { notes: note })
    setNoteInputs(n => ({ ...n, [orderId]: '' }))
  }

  async function saveDeposit(orderId) {
    const raw = depositInputs[orderId]
    if (raw === undefined || raw === '') return
    const amount = Number(raw)
    if (Number.isNaN(amount) || amount < 0) return
    setSaving(s => ({ ...s, [`deposit_${orderId}`]: true }))
    const { error } = await supabase.from('orders').update({ deposit_paid: amount }).eq('id', orderId)
    setSaving(s => ({ ...s, [`deposit_${orderId}`]: false }))
    if (error) { alert('Could not update the deposit. Please try again.'); return }
    onOrderChange(orderId, { deposit_paid: amount })
  }

  async function cancelOrder(orderId) {
    if (!window.confirm('Cancel this order?')) return
    await updateStatus(orderId, 'cancelled')
  }

  // Sort: active orders on top, resolved/cancelled at bottom
  const sorted = [...notifications].sort((a, b) => {
    const activeStatuses = ['pending', 'attending', 'in_progress']
    const aActive = activeStatuses.includes(a.status)
    const bActive = activeStatuses.includes(b.status)
    if (aActive && !bActive) return -1
    if (!aActive && bActive) return 1
    // Within active: pending first, then attending, then in_progress
    const order = ['pending', 'attending', 'in_progress', 'completed', 'cancelled']
    return order.indexOf(a.status) - order.indexOf(b.status)
  })

  const filtered = sorted.filter(o => {
    if (filterStatus === 'active') return ['pending', 'attending', 'in_progress'].includes(o.status)
    if (filterStatus === 'completed') return ['completed', 'cancelled'].includes(o.status)
    return true
  })

  const activeCount = sorted.filter(o => ['pending', 'attending', 'in_progress'].includes(o.status)).length

  // Count how many of this shop's orders share the same cart group_id (multi-item cart checkout)
  const groupCounts = notifications.reduce((acc, o) => {
    if (o.group_id) acc[o.group_id] = (acc[o.group_id] ?? 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--white)' }}>
          Orders {activeCount > 0 && <span style={{ fontSize: 12, background: 'var(--gold)', color: 'var(--black)', borderRadius: 99, padding: '2px 8px', marginLeft: 6 }}>{activeCount} active</span>}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gold-ink)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} className="pulse-dot" />
          LIVE
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--black-card)', borderRadius: 10, padding: 3, marginBottom: 16, width: 'fit-content', border: '1px solid var(--black-border)' }}>
        {[['active', Bell, 'Active'], ['completed', CheckCircle2, 'Resolved'], ['all', null, 'All']].map(([val, Icon, label]) => (
          <button key={val} onClick={() => setFilterStatus(val)}
            style={{ fontSize: 11, fontWeight: 600, padding: '6px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              background: filterStatus === val ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'transparent',
              color: filterStatus === val ? 'var(--black)' : 'var(--white-dim)' }}>
            {Icon && <Icon size={12} strokeWidth={1.75} />} {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Inbox size={28} strokeWidth={1.5} color="var(--white-dim)" style={{ marginBottom: 10 }} />
          <p style={{ fontSize: 14, color: 'var(--white-dim)' }}>
            {filterStatus === 'active' ? 'No active orders right now.' : 'No orders here yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((order) => {
            const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
            const isExpanded = expandedId === order.id
            const isResolved = ['completed', 'cancelled'].includes(order.status)

            return (
              <div key={order.id} style={{ background: 'rgba(var(--black-soft-rgb), 0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${isResolved ? 'var(--black-card)' : 'var(--black-border)'}`, borderRadius: 14, overflow: 'hidden', opacity: isResolved ? 0.7 : 1, transition: 'opacity 0.2s' }}>
                {/* Order header */}
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 99,
                        background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, flexShrink: 0 }}>
                        {cfg.label}
                      </span>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.products?.name ?? 'Product'}
                      </p>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--white-dim)', margin: 0 }}>
                      {order.buyer_name} · {order.buyer_contact} · qty {order.quantity} · {timeAgo(order.created_at)}
                    </p>
                    {order.group_id && groupCounts[order.group_id] > 1 && (
                      <p style={{ fontSize: 11, color: '#60a5fa', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Receipt size={11} strokeWidth={1.75} /> part of a {groupCounts[order.group_id]}-item order
                      </p>
                    )}
                    {order.selected_options && Object.keys(order.selected_options).length > 0 && (
                      <p style={{ fontSize: 11, color: 'var(--gold-ink)', margin: '4px 0 0' }}>
                        {Object.entries(order.selected_options).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </p>
                    )}
                    {order.notes && !isExpanded && (
                      <p style={{ fontSize: 11, color: 'var(--gold-ink)', margin: '4px 0 0', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Pencil size={11} strokeWidth={1.75} /> {order.notes}
                      </p>
                    )}
                    {order.deposit_paid != null && !isExpanded && (
                      <div style={{ marginTop: 6, maxWidth: 220 }}>
                        <LaybyProgressBar compact paid={order.deposit_paid} total={Number(order.products?.price ?? 0) * order.quantity} />
                      </div>
                    )}
                  </div>
                  <span style={{ color: 'var(--white-dim)', flexShrink: 0, display: 'flex' }}>{isExpanded ? <ChevronUp size={16} strokeWidth={1.75} /> : <ChevronDown size={16} strokeWidth={1.75} />}</span>
                </div>

                {/* Expanded actions */}
                {isExpanded && (
                  <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--black-border)' }}>
                    <div style={{ paddingTop: 12 }}>

                      {/* Action buttons */}
                      {!isResolved && (
                        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                          {cfg.next && (
                            <button
                              onClick={() => updateStatus(order.id, cfg.next)}
                              disabled={saving[order.id]}
                              style={{ fontSize: 12, fontWeight: 600, padding: '8px 14px', borderRadius: 99, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                                background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--black)', opacity: saving[order.id] ? 0.6 : 1 }}>
                              {saving[order.id] ? '...' : <><cfg.nextIcon size={13} strokeWidth={1.75} /> {cfg.nextLabel}</>}
                            </button>
                          )}
                          <button
                            onClick={() => cancelOrder(order.id)}
                            style={{ fontSize: 12, padding: '8px 14px', borderRadius: 99, border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', background: 'transparent', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <X size={13} strokeWidth={1.75} /> Cancel
                          </button>
                          {order.buyer_contact && (
                            <a
                              href={`https://wa.me/${order.buyer_contact.replace(/\D/g, '')}`}
                              target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: 12, padding: '8px 14px', borderRadius: 99, border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', textDecoration: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: 5 }}>
                              <MessageCircle size={13} strokeWidth={1.75} /> WhatsApp
                            </a>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        {order.notes && (
                          <div style={{ background: 'rgba(var(--black-card-rgb), 0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 8, padding: '8px 12px', marginBottom: 8, border: '1px solid var(--black-border)' }}>
                            <p style={{ fontSize: 11, color: 'var(--gold-ink)', margin: '0 0 2px', fontFamily: 'ui-monospace, monospace' }}>NOTE</p>
                            <p style={{ fontSize: 12, color: 'var(--white)', margin: 0 }}>{order.notes}</p>
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: 6 }}>
                          <input
                            value={noteInputs[order.id] ?? ''}
                            onChange={(e) => setNoteInputs(n => ({ ...n, [order.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && saveNote(order.id)}
                            placeholder="Add a note (e.g. didn't pick up, arranged pickup)…"
                            style={{ flex: 1, background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 8, color: 'var(--white)', fontSize: 12, padding: '8px 10px', outline: 'none' }}
                          />
                          <button
                            onClick={() => saveNote(order.id)}
                            disabled={!noteInputs[order.id]?.trim() || saving[`note_${order.id}`]}
                            style={{ fontSize: 12, padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                              background: noteInputs[order.id]?.trim() ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'var(--black-border)',
                              color: noteInputs[order.id]?.trim() ? 'var(--black)' : 'var(--white-dim)' }}>
                            Save
                          </button>
                        </div>
                      </div>

                      {/* Payment plan */}
                      {order.deposit_paid != null && (
                        <div style={{ marginTop: 12 }}>
                          <LaybyProgressBar paid={order.deposit_paid} total={Number(order.products?.price ?? 0) * order.quantity} />
                          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                            <input
                              type="number" min={0} step="0.01"
                              value={depositInputs[order.id] ?? ''}
                              onChange={(e) => setDepositInputs(d => ({ ...d, [order.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && saveDeposit(order.id)}
                              placeholder={`Update amount paid (currently ${order.deposit_paid})`}
                              style={{ flex: 1, background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 8, color: 'var(--white)', fontSize: 12, padding: '8px 10px', outline: 'none' }}
                            />
                            <button
                              onClick={() => saveDeposit(order.id)}
                              disabled={!depositInputs[order.id] || saving[`deposit_${order.id}`]}
                              style={{ fontSize: 12, padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                background: depositInputs[order.id] ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'var(--black-border)',
                                color: depositInputs[order.id] ? 'var(--black)' : 'var(--white-dim)' }}>
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const INPUT = {
  width: '100%',
  padding: '10px 14px',
  fontSize: 14,
  background: 'var(--black-card)',
  border: '1px solid var(--black-border)',
  borderRadius: 10,
  color: 'var(--white)',
  outline: 'none',
}

const LABEL = { fontSize: 11, color: 'var(--white-dim)', display: 'block', marginBottom: 6 }

export default function ShopDashboard({ shop, onShopUpdated }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('products')

  const { notifications, unreadCount, clearUnread, updateNotification } = useOrderNotifications(shop.id)
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
    setForm({ name: p.name, category_id: p.category_id, price: p.price, original_price: p.original_price ?? '', stock_count: p.stock_count, description: p.description ?? '', photo_url: p.photo_url ?? '', options: p.options ?? [], feature_requested: p.feature_requested ?? false })
    setError(null)
    setShowForm(true)
  }

  function cancelForm() { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); setError(null) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const cleanOptions = form.options
      .filter((g) => g.name.trim() && g.values.length > 0)
      .map((g) => ({ name: g.name.trim(), values: g.values }))
    const originalPrice = form.original_price ? Number(form.original_price) : null
    const payload = { shop_id: shop.id, name: form.name, category_id: form.category_id, price: Number(form.price), original_price: originalPrice && originalPrice > Number(form.price) ? originalPrice : null, stock_count: Number(form.stock_count), description: form.description || null, photo_url: form.photo_url || null, options: cleanOptions, feature_requested: form.feature_requested, is_active: true }
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

  const activeOrderCount = notifications.filter((o) => ['pending', 'attending', 'in_progress'].includes(o.status)).length

  return (
    <div>
      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 20 }}>
        {[
          { icon: Package, label: 'Products', value: products.length },
          { icon: Bell, label: 'Active orders', value: activeOrderCount },
          { icon: ShoppingBag, label: 'Recent orders', value: notifications.length },
        ].map((kpi) => (
          <div key={kpi.label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(var(--black-soft-rgb), 0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid var(--black-border)', borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <kpi.icon size={17} strokeWidth={1.75} color="var(--gold)" />
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--white)', lineHeight: 1.1 }}>{kpi.value}</p>
              <p style={{ fontSize: 11, color: 'var(--white-dim)' }}>{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--black-card)', borderRadius: 14, padding: 4, width: 'fit-content', marginBottom: 24, border: '1px solid var(--black-border)' }}>
        <button onClick={() => setTab('products')}
          style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
            background: tab === 'products' ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'transparent',
            color: tab === 'products' ? 'var(--black)' : 'var(--white-dim)' }}>
          Products ({products.length})
        </button>
        <button onClick={() => { setTab('orders'); clearUnread() }}
          style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
            background: tab === 'orders' ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'transparent',
            color: tab === 'orders' ? 'var(--black)' : 'var(--white-dim)' }}>
          Orders
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: 10, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {unreadCount}
            </span>
          )}
        </button>
        <button onClick={() => setTab('analytics')}
          style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
            background: tab === 'analytics' ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'transparent',
            color: tab === 'analytics' ? 'var(--black)' : 'var(--white-dim)' }}>
          Analytics
        </button>
        <button onClick={() => setTab('settings')}
          style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
            background: tab === 'settings' ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'transparent',
            color: tab === 'settings' ? 'var(--black)' : 'var(--white-dim)' }}>
          Settings
        </button>
      </div>

      {tab === 'analytics' && (
        <ShopAnalytics shopId={shop.id} />
      )}

      {tab === 'settings' && (
        <ShopSettingsForm shop={shop} onUpdated={onShopUpdated} />
      )}

      {tab === 'products' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--white)' }}>Your products</h2>
            {!showForm && (
              <button onClick={startAdd} className="btn-gold" style={{ fontSize: 13, padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={15} strokeWidth={2} /> Add product
              </button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <div style={{ background: 'rgba(var(--black-soft-rgb), 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid var(--black-border)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', marginBottom: 16 }}>
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
                      {Object.entries(
                        categories.reduce((acc, c) => {
                          const group = c.group ?? 'Other'
                          acc[group] = acc[group] ?? []
                          acc[group].push(c)
                          return acc
                        }, {})
                      ).map(([group, items]) => (
                        <optgroup key={group} label={group} style={{ background: 'var(--black-card)', color: 'var(--white)' }}>
                          {items.map((c) => <option key={c.id} value={c.id} style={{ background: 'var(--black-card)', color: 'var(--white)' }}>{c.label}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={LABEL}>Price (N$)</label>
                    <input required type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      style={INPUT} placeholder="0" />
                  </div>
                  <div>
                    <label style={LABEL}>Was price (optional, shows as a sale)</label>
                    <input type="number" min={0} value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                      style={INPUT} placeholder="Leave blank if not on sale" />
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
                  <div style={{ gridColumn: '1 / -1' }}>
                    <ProductOptionsEditor options={form.options} onChange={(options) => setForm({ ...form, options })} />
                  </div>
                </div>

                <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 12, padding: 14, marginBottom: 12 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold-ink)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={13} strokeWidth={1.75} /> Homepage slideshow (premium)
                  </p>
                  {editingId && products.find((p) => p.id === editingId)?.is_featured ? (
                    <p style={{ fontSize: 12, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <CheckCircle2 size={13} strokeWidth={1.75} /> Currently featured on the homepage.
                    </p>
                  ) : editingId && products.find((p) => p.id === editingId)?.feature_requested ? (
                    <p style={{ fontSize: 12, color: 'var(--gold-ink)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Clock size={13} strokeWidth={1.75} /> Request sent. We'll be in touch about pricing.
                    </p>
                  ) : (
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--white-dim)', cursor: 'pointer', lineHeight: 1.4 }}>
                      <input type="checkbox" checked={form.feature_requested} onChange={(e) => setForm({ ...form, feature_requested: e.target.checked })}
                        style={{ marginTop: 2, accentColor: 'var(--gold)' }} />
                      Request featured placement on the homepage slideshow, more buyers see it. This is a paid placement; checking this just sends a request, we'll follow up about pricing before it goes live.
                    </label>
                  )}
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
              {[1,2,3].map((i) => <div key={i} style={{ height: 64, background: 'var(--black-card)', borderRadius: 12, border: '1px solid var(--black-border)' }} />)}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Package size={28} strokeWidth={1.5} color="var(--white-dim)" style={{ marginBottom: 10 }} />
              <p style={{ fontSize: 14, color: 'var(--white-dim)' }}>No products yet. Add your first one.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {products.map((p) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(var(--black-soft-rgb), 0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid var(--black-border)', borderRadius: 12, padding: '12px 14px', opacity: p.is_active ? 1 : 0.5 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--black-card)', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--black-border)' }}>
                    {p.photo_url
                      ? <img src={p.photo_url} alt={p.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={16} strokeWidth={1.5} color="var(--white-dim)" /></div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {p.name}
                      {p.is_featured && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--black)', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', padding: '2px 7px', borderRadius: 99, flexShrink: 0 }}>FEATURED</span>
                      )}
                      {!p.is_featured && p.feature_requested && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--gold-ink)', border: '1px solid rgba(201,168,76,0.4)', padding: '2px 7px', borderRadius: 99, flexShrink: 0 }}>REQUEST PENDING</span>
                      )}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--white-dim)' }}>N${Number(p.price).toLocaleString()} · {p.stock_count} in stock</p>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                    <button onClick={() => toggleActive(p)} style={{ fontSize: 12, color: 'var(--white-dim)', background: 'none', border: 'none', cursor: 'pointer' }}>{p.is_active ? 'Hide' : 'Show'}</button>
                    <button onClick={() => startEdit(p)} style={{ fontSize: 12, color: 'var(--gold-ink)', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <OrdersTab shopId={shop.id} notifications={notifications} onOrderChange={updateNotification} timeAgo={timeAgo} />
      )}
    </div>
  )
}
