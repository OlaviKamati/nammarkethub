import { CATEGORIES_BY_TYPE, ALL_CATEGORIES } from '../lib/shopTypes'

export default function CategoryFilter({ active, onChange, shopType }) {
  const categories = [
    { id: 'all', label: 'All' },
    ...(shopType && shopType !== 'all' ? (CATEGORIES_BY_TYPE[shopType] ?? []) : ALL_CATEGORIES),
  ]

  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
      {categories.map((cat) => {
        const isActive = active === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            style={{
              flexShrink: 0,
              fontSize: 12,
              fontWeight: isActive ? 600 : 400,
              padding: '6px 14px',
              borderRadius: 99,
              border: isActive ? 'none' : '1px solid var(--black-border)',
              background: isActive ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' : 'var(--black-card)',
              color: isActive ? 'var(--black)' : 'var(--white-dim)',
              cursor: 'pointer',
              transition: 'all 0.2s var(--ease-expo)',
              whiteSpace: 'nowrap',
            }}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
