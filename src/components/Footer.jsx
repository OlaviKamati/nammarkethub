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
    <footer style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--black-border)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ maxWidth: 280 }}>
          {/* Dark chip behind the logo — the wordmark's "Market" is baked into the SVG as
              near-white, so it needs a dark backdrop to stay legible in the light theme. */}
          <div style={{ display: 'inline-block', background: 'var(--black)', borderRadius: 10, padding: '8px 12px', marginBottom: 12 }}>
            <img src="/logo.svg" alt="NamMarketHub" style={{ height: 28, display: 'block' }} />
          </div>
          <p style={{ fontSize: 12, color: 'var(--white-dim)', lineHeight: 1.6 }}>
            A marketplace for Namibian shops to list products and connect directly with buyers — no middleman, payment and pickup arranged shop-to-buyer.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
          <p style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            Quick links
          </p>
          {LINKS.map(([label, to]) => (
            <Link key={to} to={to} style={{ fontSize: 13, color: 'var(--white-dim)', textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
          <p style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
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

      <div style={{ paddingTop: 20, borderTop: '1px solid var(--black-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 11, color: 'var(--white-dim)', fontFamily: 'ui-monospace, monospace' }}>
          © {new Date().getFullYear()} NAMMARKETHUB · MADE IN NAMIBIA 🇳🇦
        </p>
      </div>

      {legalTab && <LegalModal initialTab={legalTab} onClose={() => setLegalTab(null)} />}
    </footer>
  )
}
