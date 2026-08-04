export default function ShareButtons({ productName, url }) {
  const text = encodeURIComponent(`Check out ${productName} on NamMarketHub`)
  const encodedUrl = encodeURIComponent(url)

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <a
        href={`https://wa.me/?text=${text}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: 12, color: 'var(--white-dim)', textDecoration: 'none', padding: '6px 12px', border: '1px solid var(--black-border)', borderRadius: 99 }}
      >
        💬 Share
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: 12, color: 'var(--white-dim)', textDecoration: 'none', padding: '6px 12px', border: '1px solid var(--black-border)', borderRadius: 99 }}
      >
        📤 Facebook
      </a>
    </div>
  )
}
