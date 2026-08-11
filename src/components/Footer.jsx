import { useState } from 'react'
import { Link } from 'react-router-dom'
import LegalModal from './LegalModal'

const LINKS = [
  ['Home', '/'],
  ['Sell on NamMarketHub', '/sell'],
  ['Your cart', '/cart'],
  ['Your account', '/account'],
]

export default function Footer() {
  const [legalTab, setLegalTab] = useState(null)

  return (
    <footer style={{ marginTop: 64 }}>
      {/* Soft fade-out divider — matches the .gold-divider used between sections
          elsewhere, instead of a hard edge-to-edge border line. */}
      <div className="gold-divider" style={{ marginBottom: 32 }} />

      <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 20, padding: '32px 28px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px 56px', marginBottom: 24 }}>
          <div style={{ flex: '1 1 240px', maxWidth: 320 }}>
            {/* Dark chip behind the logo — the wordmark's "Market" is baked into the SVG as
                near-white, so it needs a dark backdrop to stay legible in the light theme. */}
            <div style={{ display: 'inline-block', background: 'var(--black)', borderRadius: 10, padding: '8px 12px', marginBottom: 12 }}>
              <img src="/logo.svg" alt="NamMarketHub" style={{ height: 28, display: 'block' }} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--white-dim)', lineHeight: 1.6 }}>
              A marketplace for Namibian shops to list products and connect directly with buyers, no middleman, payment and pickup arranged shop-to-buyer.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexDirection: 'column', flex: '0 0 auto' }}>
            <p style={{ fontSize: 11, color: 'var(--gold-ink)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
              Quick links
            </p>
            {LINKS.map(([label, to]) => (
              <Link key={to} to={to} style={{ fontSize: 13, color: 'var(--white-dim)', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, flexDirection: 'column', flex: '0 0 auto' }}>
            <p style={{ fontSize: 11, color: 'var(--gold-ink)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
              Legal
            </p>
            <button onClick={() => setLegalTab('terms')} style={{ fontSize: 13, color: 'var(--white-dim)', background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
              Terms of Service
            </button>
            <button onClick={() => setLegalTab('privacy')} style={{ fontSize: 13, color: 'var(--white-dim)', background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
              Privacy
            </button>
          </div>
        </div>

        <div style={{ paddingTop: 16, borderTop: '1px solid var(--black-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 11, color: 'var(--white-dim)', fontFamily: 'ui-monospace, monospace' }}>
            © {new Date().getFullYear()} NAMMARKETHUB · MADE IN NAMIBIA 🇳🇦
          </p>
        </div>
      </div>

      {legalTab && <LegalModal initialTab={legalTab} onClose={() => setLegalTab(null)} />}
    </footer>
  )
}
