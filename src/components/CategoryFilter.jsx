import { CATEGORIES_BY_TYPE, ALL_CATEGORIES } from '../lib/shopTypes'

export default function CategoryFilter({ active, onChange, shopType }) {
  const categories = [
    { id: 'all', label: 'All' },
    ...(shopType && shopType !== 'all'
      ? (CATEGORIES_BY_TYPE[shopType] ?? [])
      : ALL_CATEGORIES),
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((cat) => {
        const isActive = active === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={
              'text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors flex-shrink-0 ' +
              (isActive
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300')
            }
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
