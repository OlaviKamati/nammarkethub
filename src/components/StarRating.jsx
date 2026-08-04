// Read-only display (pass `value`) or interactive input (pass `value` + `onChange`).
export default function StarRating({ value = 0, onChange, size = 16 }) {
  const interactive = typeof onChange === 'function'
  const rounded = Math.round(value)

  return (
    <div style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onClick={interactive ? () => onChange(n) : undefined}
          style={{
            fontSize: size,
            color: n <= rounded ? 'var(--gold)' : 'var(--black-border)',
            cursor: interactive ? 'pointer' : 'default',
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}
