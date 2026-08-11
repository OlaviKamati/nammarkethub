import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

// Plain-language description of how the marketplace actually works — not drafted or
// reviewed by a lawyer, and not a substitute for real legal advice if that's needed.
const SECTIONS = {
  terms: {
    label: 'Terms of Service',
    body: [
      ['What NamMarketHub is', 'NamMarketHub is a directory that lets independent Namibian shops list products and connect with buyers. We are not a party to any sale: each shop is the seller and is responsible for their own listings, pricing, stock, and fulfillment.'],
      ['Payment & delivery', "NamMarketHub doesn't process payment. When you send a request, the shop contacts you directly to arrange payment and pickup or delivery, in whatever way you both agree on."],
      ['Accounts', 'An account is optional for browsing, but is used to keep an order history, save a wishlist, and leave reviews. You can browse and place a limited number of requests without one.'],
      ['Reviews', "Reviews should reflect a genuine experience with a shop or product. We don't verify every review before it's published."],
      ['Listings', "Shops are responsible for the accuracy of what they list: photos, prices, and stock counts. Report anything that looks wrong and we'll follow up with the shop."],
      ['Changes', 'This is a plain description of how the marketplace works today, not a legal document reviewed by a lawyer. If you need formal terms for a specific purpose, get them drafted properly.'],
    ],
  },
  privacy: {
    label: 'Privacy',
    body: [
      ['What we store', "Your account email, any profile info you add (username, display name, avatar), the requests you send to shops (name, contact, product, quantity), your wishlist, and any reviews you write."],
      ['Where it lives', 'In our database and file storage, hosted on Supabase.'],
      ['Who can see it', "The shop you send a request to sees the name and contact you provide for that request. Other buyers can see your username and review text if you leave one. Shops don't see your account email directly."],
      ['What we don’t do', "We don't sell your data, and we don't run third-party ad tracking on this site."],
    ],
  },
}

export default function LegalModal({ initialTab = 'terms', onClose }) {
  const [tab, setTab] = useState(initialTab)
  const section = SECTIONS[tab]

  return createPortal(
    <div
      onClick={(e) => { e.stopPropagation(); onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up"
        style={{ width: '100%', maxWidth: 560, maxHeight: '82vh', overflowY: 'auto', background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 20, padding: 24 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {Object.entries(SECTIONS).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 99, cursor: 'pointer',
                  border: tab === key ? 'none' : '1px solid var(--black-border)',
                  background: tab === key ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' : 'transparent',
                  color: tab === key ? 'var(--black)' : 'var(--white-dim)',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'var(--black-border)', color: 'var(--white)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {section.body.map(([heading, text]) => (
            <div key={heading}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold-ink)', marginBottom: 4 }}>{heading}</p>
              <p style={{ fontSize: 13, color: 'var(--white-dim)', lineHeight: 1.6 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}
