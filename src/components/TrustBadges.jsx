const BADGES = [
  { icon: '🏪', label: 'Verified Shops' },
  { icon: '📍', label: 'Local Namibian Sellers' },
  { icon: '💬', label: 'Direct Contact, No Middleman' },
  { icon: '⭐', label: 'Real Buyer Reviews' },
]

export default function TrustBadges() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
      {BADGES.map((b) => (
        <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 14, padding: '14px 16px' }}>
          <span style={{ fontSize: 20 }}>{b.icon}</span>
          <span style={{ fontSize: 12, color: 'var(--white-dim)', lineHeight: 1.3 }}>{b.label}</span>
        </div>
      ))}
    </div>
  )
}
