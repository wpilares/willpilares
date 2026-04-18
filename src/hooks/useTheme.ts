import { useThemeStore } from '@store'
import { useEffect } from 'react'

export const useTheme = () => {
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    // Ensure theme is applied on mount
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
  }, [theme])

  return { theme, setTheme }
}
