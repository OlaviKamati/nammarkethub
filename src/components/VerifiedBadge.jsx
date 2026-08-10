import { ShieldCheck } from 'lucide-react'

// Shown only when shop.is_verified is true — no fabricated tiers, matches the single
// boolean flag we actually store and manually flip per shop.
export default function VerifiedBadge({ size = 'sm', style }) {
  const compact = size === 'sm'
  return (
    <span
      title="Verified by NamMarketHub"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0,
        fontSize: compact ? 10 : 12, fontWeight: 600, color: 'var(--gold)',
        background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)',
        borderRadius: 99, padding: compact ? '2px 7px' : '3px 10px',
        ...style,
      }}
    >
      <ShieldCheck size={compact ? 10 : 13} strokeWidth={2} />
      Verified
    </span>
  )
}
