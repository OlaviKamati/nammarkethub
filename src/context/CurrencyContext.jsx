import { createContext, useEffect, useState } from 'react'
import { formatPrice } from '../lib/currency'

export const CurrencyContext = createContext(null)

const STORAGE_KEY = 'nammarkethub_currency'

function loadInitial() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? 'NAD'
  } catch {
    return 'NAD'
  }
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency)
  }, [currency])

  function format(nadAmount) {
    return formatPrice(nadAmount, currency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  )
}
