import { Link } from 'react-router-dom'

// Small hand-drawn line-art motifs (desert sun/dune, starry mountains, woven basket)
// standing in for a generic icon+text empty state — no external image assets needed.
const ART = {
  cart: (
    <svg viewBox="0 0 160 160" width="100%" height="100%">
      <circle cx="80" cy="56" r="34" fill="currentColor" opacity="0.08" />
      <circle cx="80" cy="56" r="20" fill="currentColor" opacity="0.14" />
      <path d="M8 128 Q56 68 104 128 Z" fill="currentColor" opacity="0.22" />
      <path d="M48 128 Q104 78 152 128 Z" fill="currentColor" opacity="0.14" />
      <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" opacity="0.35" fill="none" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 160 160" width="100%" height="100%">
      <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" opacity="0.3" fill="none" />
      <polygon points="18,124 58,58 98,124" fill="currentColor" opacity="0.22" />
      <polygon points="66,124 112,50 152,124" fill="currentColor" opacity="0.14" />
      <circle cx="112" cy="40" r="14" fill="currentColor" opacity="0.16" />
      <circle cx="34" cy="42" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="48" cy="30" r="1.8" fill="currentColor" opacity="0.4" />
      <circle cx="130" cy="70" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  basket: (
    <svg viewBox="0 0 160 160" width="100%" height="100%">
      <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" opacity="0.3" fill="none" />
      <path d="M40 68 L48 128 Q80 138 112 128 L120 68 Z" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      {[78, 88, 98, 108, 118].map((y) => (
        <path key={y} d={`M42 ${y} Q80 ${y + 10} 118 ${y}`} stroke="currentColor" strokeWidth="1" opacity="0.35" fill="none" />
      ))}
      <path d="M56 68 Q80 30 104 68" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
    </svg>
  ),
}

export default function EmptyState({ variant = 'basket', title, description, actionLabel, actionTo, compact = false }) {
  const size = compact ? 88 : 132
  return (
    <div style={{ textAlign: 'center', padding: compact ? '32px 16px' : '56px 16px' }}>
      <div style={{ width: size, height: size, margin: '0 auto', marginBottom: compact ? 12 : 18, color: 'var(--gold-dark)' }}>
        {ART[variant] ?? ART.basket}
      </div>
      {title && (
        <p className={compact ? '' : 'font-display'} style={{ fontSize: compact ? 14 : 17, fontWeight: compact ? 600 : 400, color: 'var(--white)', marginBottom: 6 }}>
          {title}
        </p>
      )}
      {description && (
        <p style={{ fontSize: 13, color: 'var(--white-dim)', maxWidth: 320, margin: '0 auto', lineHeight: 1.5 }}>
          {description}
        </p>
      )}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="btn-gold"
          style={{ display: 'inline-block', marginTop: 18, fontSize: 13, padding: '10px 22px', textDecoration: 'none' }}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
