import { useState } from 'react'
import { MessageCircle, Share2, Link2, Check } from 'lucide-react'

const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

export default function ShareButtons({ productName, url }) {
  const [copied, setCopied] = useState(false)
  const text = encodeURIComponent(`Check out ${productName} on NamMarketHub`)
  const encodedUrl = encodeURIComponent(url)

  async function handleNativeShare() {
    try {
      await navigator.share({ title: productName, text: `Check out ${productName} on NamMarketHub`, url })
    } catch {
      // user cancelled the share sheet — nothing to do
    }
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {canNativeShare ? (
        <button
          onClick={handleNativeShare}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--white-dim)', background: 'none', cursor: 'pointer', padding: '6px 12px', border: '1px solid var(--black-border)', borderRadius: 99 }}
        >
          <Share2 size={13} strokeWidth={1.75} /> Share
        </button>
      ) : (
        <button
          onClick={handleCopyLink}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: copied ? 'var(--gold)' : 'var(--white-dim)', background: 'none', cursor: 'pointer', padding: '6px 12px', border: '1px solid var(--black-border)', borderRadius: 99 }}
        >
          {copied ? <Check size={13} strokeWidth={2} /> : <Link2 size={13} strokeWidth={1.75} />} {copied ? 'Copied' : 'Copy link'}
        </button>
      )}
      <a
        href={`https://wa.me/?text=${text}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--white-dim)', textDecoration: 'none', padding: '6px 12px', border: '1px solid var(--black-border)', borderRadius: 99 }}
      >
        <MessageCircle size={13} strokeWidth={1.75} /> WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--white-dim)', textDecoration: 'none', padding: '6px 12px', border: '1px solid var(--black-border)', borderRadius: 99 }}
      >
        <Share2 size={13} strokeWidth={1.75} /> Facebook
      </a>
    </div>
  )
}
