import { createContext, useEffect, useState } from 'react'

export const CartContext = createContext(null)

const STORAGE_KEY = 'nammarkethub_cart'

function lineKey(productId, selectedOptions) {
  return `${productId}::${JSON.stringify(selectedOptions ?? {})}`
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product, quantity, selectedOptions) {
    const key = lineKey(product.id, selectedOptions)
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [...prev, { key, product, quantity, selectedOptions: selectedOptions ?? {} }]
    })
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  function updateQuantity(key, quantity) {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)))
  }

  function clearCart() {
    setItems([])
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.quantity * Number(i.product.price), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}
