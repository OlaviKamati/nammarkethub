import { createContext, useState } from 'react'

export const CompareContext = createContext(null)

const MAX_COMPARE = 2

export function CompareProvider({ children }) {
  const [items, setItems] = useState([])

  function addToCompare(product) {
    setItems((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev
      const next = [...prev, product]
      return next.length > MAX_COMPARE ? next.slice(next.length - MAX_COMPARE) : next
    })
  }

  function removeFromCompare(id) {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }

  function clearCompare() {
    setItems([])
  }

  function isComparing(id) {
    return items.some((p) => p.id === id)
  }

  return (
    <CompareContext.Provider value={{ items, addToCompare, removeFromCompare, clearCompare, isComparing, maxCompare: MAX_COMPARE }}>
      {children}
    </CompareContext.Provider>
  )
}
