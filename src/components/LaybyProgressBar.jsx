import { useCurrency } from '../hooks/useCurrency'

// Purple track, gold fill — shows a real amount the shop has recorded as paid so far
// against the order total. Nothing here is simulated: `paid` is whatever the shop entered.
export default function LaybyProgressBar({ paid, total, compact = false }) {
  const { format } = useCurrency()
  const pct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: compact ? 10 : 11, color: 'var(--white-dim)' }}>Payment plan</span>
        <span style={{ fontSize: compact ? 10 : 11, color: 'var(--gold-ink)', fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: compact ? 6 : 8, borderRadius: 99, background: 'rgba(147,51,234,0.2)', border: '1px solid rgba(147,51,234,0.3)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold-dark), var(--gold))', borderRadius: 99, transition: 'width 0.3s ease' }} />
      </div>
      <p style={{ fontSize: compact ? 10 : 11, color: 'var(--white-dim)', marginTop: 4 }}>
        {format(paid)} of {format(total)} paid
      </p>
    </div>
  )
}
