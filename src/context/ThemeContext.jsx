import { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext(null)

const STORAGE_KEY = 'nammarkethub_theme'

function loadInitial() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? 'dark'
  } catch {
    return 'dark'
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(loadInitial)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
