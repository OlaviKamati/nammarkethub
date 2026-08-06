import { Star } from 'lucide-react'

// Read-only display (pass `value`) or interactive input (pass `value` + `onChange`).
export default function StarRating({ value = 0, onChange, size = 16 }) {
  const interactive = typeof onChange === 'function'
  const rounded = Math.round(value)

  return (
    <div style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          onClick={interactive ? () => onChange(n) : undefined}
          size={size}
          strokeWidth={1.75}
          fill={n <= rounded ? 'currentColor' : 'none'}
          style={{
            color: n <= rounded ? 'var(--gold)' : 'var(--black-border)',
            cursor: interactive ? 'pointer' : 'default',
          }}
        />
      ))}
    </div>
  )
}
