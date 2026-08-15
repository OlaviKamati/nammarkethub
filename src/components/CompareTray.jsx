import { useState } from 'react'
import { Scale, X, Package } from 'lucide-react'
import { useCompare } from '../hooks/useCompare'
import CompareModal from './CompareModal'

export default function CompareTray() {
  const { items, removeFromCompare, clearCompare, maxCompare } = useCompare()
  const [open, setOpen] = useState(false)

  if (items.length === 0) return null

  return (
    <>
      <div
        className="compare-tray fade-up"
        style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 60, background: 'rgba(var(--black-card-rgb), 0.8)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid var(--gold-dark)', borderRadius: 14, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          {items.map((p) => (
            <div key={p.id} style={{ position: 'relative', width: 36, height: 36, borderRadius: 8, overflow: 'hidden', background: '#0D0D0D', border: '1px solid var(--black-border)', flexShrink: 0 }}>
              {p.photo_url ? (
                <img src={p.photo_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={14} strokeWidth={1.5} color="var(--nav-ink-dim)" /></div>
              )}
              <button
                onClick={() => removeFromCompare(p.id)}
                aria-label={`Remove ${p.name} from compare`}
                style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, borderRadius: '50%', background: 'var(--black)', border: '1px solid var(--black-border)', color: 'var(--white-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
              >
                <X size={8} strokeWidth={2.5} />
              </button>
            </div>
          ))}
          {Array.from({ length: maxCompare - items.length }).map((_, i) => (
            <div key={i} style={{ width: 36, height: 36, borderRadius: 8, border: '1px dashed var(--black-border)' }} />
          ))}
        </div>

        <button
          onClick={() => setOpen(true)}
          disabled={items.length < 2}
          className="btn-gold"
          style={{ fontSize: 12, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, opacity: items.length < 2 ? 0.5 : 1, cursor: items.length < 2 ? 'default' : 'pointer' }}
        >
          <Scale size={13} strokeWidth={1.75} /> Compare {items.length < 2 ? `(${items.length}/${maxCompare})` : ''}
        </button>

        <button onClick={clearCompare} aria-label="Clear compare" style={{ background: 'none', border: 'none', color: 'var(--white-dim)', cursor: 'pointer', display: 'flex', padding: 4 }}>
          <X size={16} strokeWidth={1.75} />
        </button>
      </div>

      {open && <CompareModal onClose={() => setOpen(false)} />}
    </>
  )
}
