import { Fragment } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { X, Package, ShieldCheck } from 'lucide-react'
import { useCompare } from '../hooks/useCompare'
import { useCurrency } from '../hooks/useCurrency'
import { ALL_CATEGORIES } from '../lib/shopTypes'

export default function CompareModal({ onClose }) {
  const { items } = useCompare()
  const { format } = useCurrency()
  const navigate = useNavigate()

  const rows = [
    { label: 'Price', render: (p) => format(p.price) },
    { label: 'Shop', render: (p) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {p.shops?.name ?? '—'}
        {p.shops?.is_verified && <ShieldCheck size={12} strokeWidth={2} color="var(--gold)" />}
      </span>
    ) },
    { label: 'Category', render: (p) => ALL_CATEGORIES.find((c) => c.id === p.category_id)?.label ?? p.category_id },
    { label: 'Stock', render: (p) => p.stock_count > 0 ? `${p.stock_count} in stock` : 'Out of stock' },
  ]

  return createPortal(
    <div
      onClick={(e) => { e.stopPropagation(); onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up"
        style={{ width: '100%', maxWidth: 640, maxHeight: '88vh', overflowY: 'auto', background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 20, position: 'relative', padding: 24 }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(10,10,10,0.7)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={16} strokeWidth={1.75} />
        </button>

        <h2 className="font-display" style={{ fontSize: 18, color: 'var(--white)', marginBottom: 20 }}>Compare products</h2>

        <div style={{ display: 'grid', gridTemplateColumns: `120px repeat(${items.length}, 1fr)`, gap: 12, overflowX: 'auto' }}>
          <div />
          {items.map((p) => (
            <div key={p.id} onClick={() => { onClose(); navigate(`/product/${p.id}`) }} style={{ cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ aspectRatio: '1', borderRadius: 12, overflow: 'hidden', background: '#0D0D0D', border: '1px solid var(--black-border)', marginBottom: 8 }}>
                {p.photo_url ? (
                  <img src={p.photo_url} alt={p.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={24} strokeWidth={1.5} color="var(--nav-ink-dim)" /></div>
                )}
              </div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--white)', lineHeight: 1.3 }}>{p.name}</p>
            </div>
          ))}

          {rows.map((row) => (
            <Fragment key={row.label}>
              <div style={{ fontSize: 11, color: 'var(--white-dim)', display: 'flex', alignItems: 'center', borderTop: '1px solid var(--black-border)', padding: '10px 0' }}>
                {row.label}
              </div>
              {items.map((p) => (
                <div key={p.id + row.label} style={{ fontSize: 13, color: 'var(--white)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid var(--black-border)', padding: '10px 0' }}>
                  {row.render(p)}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}
