import { createPortal } from 'react-dom'
import { X, Printer } from 'lucide-react'
import { useCurrency } from '../hooks/useCurrency'

const STATUS_LABEL = {
  pending: 'Pending', attending: 'Attending', in_progress: 'In Progress',
  completed: 'Resolved', cancelled: 'Cancelled',
}

// A plain record of what was requested — NOT a tax invoice. NamMarketHub doesn't process
// payment or collect VAT; the shop is the seller and arranges payment directly with the buyer.
export default function OrderSummaryModal({ order, onClose }) {
  const { format } = useCurrency()
  if (!order) return null

  const lineTotal = Number(order.products?.price ?? 0) * order.quantity

  return createPortal(
    <div
      onClick={(e) => { e.stopPropagation(); onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      className="order-summary-overlay"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up order-summary-card"
        style={{ width: '100%', maxWidth: 420, background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 20, padding: 24 }}
      >
        <div className="order-summary-hide-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="font-display" style={{ fontSize: 17, color: 'var(--white)' }}>Order summary</h2>
          <button onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'var(--black-border)', color: 'var(--white)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>

        <p style={{ fontSize: 10, color: 'var(--white-dim)', marginBottom: 16, fontFamily: 'ui-monospace, monospace' }}>
          Ref {order.id.slice(0, 8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString('en-NA', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>

        <div style={{ borderTop: '1px solid var(--black-border)', borderBottom: '1px solid var(--black-border)', padding: '12px 0', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--white)' }}>{order.products?.name ?? 'Product'}</span>
            <span style={{ fontSize: 13, color: 'var(--white)' }}>{format(lineTotal)}</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--white-dim)' }}>
            {order.quantity} × {format(order.products?.price ?? 0)} · sold by {order.products?.shops?.name ?? 'shop'}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: 'var(--white-dim)' }}>Status</span>
          <span style={{ fontSize: 13, color: 'var(--gold-ink)', fontWeight: 600 }}>{STATUS_LABEL[order.status] ?? order.status}</span>
        </div>

        <p style={{ fontSize: 11, color: 'var(--white-dim)', lineHeight: 1.5, marginBottom: 16 }}>
          This is a record of your request, not a tax invoice — the shop is the seller and arranges payment and pickup directly with you.
        </p>

        <button onClick={() => window.print()} className="btn-outline order-summary-hide-print" style={{ width: '100%', padding: '10px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Printer size={14} strokeWidth={1.75} /> Print / save
        </button>
      </div>
    </div>,
    document.body
  )
}
