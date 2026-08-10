import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Package } from 'lucide-react'

const STATUS_LABEL = {
  pending: 'Pending', attending: 'Attending', in_progress: 'In Progress',
  completed: 'Resolved', cancelled: 'Cancelled',
}

export default function NotificationBell({ orders, unreadCount, markAllSeen }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function toggle() {
    setOpen((o) => {
      if (!o) markAllSeen()
      return !o
    })
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={toggle}
        aria-label="Order notifications"
        style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 10, background: 'transparent', color: 'var(--nav-ink)', cursor: 'pointer' }}
      >
        <Bell size={16} strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--gold)', color: 'var(--black)', fontSize: 10, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 320, maxHeight: 400, overflowY: 'auto', background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 14, boxShadow: '0 12px 32px rgba(0,0,0,0.5)', zIndex: 80 }}>
          <p style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '14px 16px 10px' }}>
            Your order updates
          </p>
          {orders.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--white-dim)', padding: '0 16px 16px' }}>No orders yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {orders.slice(0, 8).map((o) => (
                <Link
                  key={o.id}
                  to="/account"
                  onClick={() => setOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', textDecoration: 'none', borderTop: '1px solid var(--black-border)' }}
                >
                  <Package size={15} strokeWidth={1.75} color="var(--gold-dark)" style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 12, color: 'var(--white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {o.products?.name ?? 'Order'}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--white-dim)' }}>{STATUS_LABEL[o.status] ?? o.status}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
