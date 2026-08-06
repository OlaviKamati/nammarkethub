import { Store, MapPin, MessageCircle, Star } from 'lucide-react'

const BADGES = [
  { icon: Store, label: 'Verified Shops' },
  { icon: MapPin, label: 'Local Namibian Sellers' },
  { icon: MessageCircle, label: 'Direct Contact, No Middleman' },
  { icon: Star, label: 'Real Buyer Reviews' },
]

export default function TrustBadges() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
      {BADGES.map((b) => (
        <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 14, padding: '14px 16px' }}>
          <b.icon size={20} strokeWidth={1.5} color="var(--gold)" />
          <span style={{ fontSize: 12, color: 'var(--white-dim)', lineHeight: 1.3 }}>{b.label}</span>
        </div>
      ))}
    </div>
  )
}
