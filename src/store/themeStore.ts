import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light'

export interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const getSystemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.remove('dark', 'light')
  document.documentElement.classList.add(theme)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getSystemTheme(),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      setTheme: (theme: Theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
      // Runs after hydration, including when storage is missing or corrupt
      onRehydrateStorage: () => (state) => {
        applyTheme(state?.theme ?? getSystemTheme())
      },
    }
  )
)

useThemeStore.subscribe((state) => applyTheme(state.theme))
