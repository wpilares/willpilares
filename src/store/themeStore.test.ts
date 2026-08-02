import { beforeEach, describe, expect, it, vi } from 'vitest'

const importStore = () => import('./themeStore')

beforeEach(() => {
  vi.resetModules()
  localStorage.clear()
  document.documentElement.className = ''
})

describe('themeStore', () => {
  it('applies the persisted theme to the document on load', async () => {
    localStorage.setItem('theme-storage', JSON.stringify({ state: { theme: 'light' }, version: 0 }))

    const { useThemeStore } = await importStore()

    expect(useThemeStore.getState().theme).toBe('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('falls back to the system theme when storage is corrupt', async () => {
    localStorage.setItem('theme-storage', 'not-valid-json{')

    const { useThemeStore } = await importStore()

    expect(useThemeStore.getState().theme).toBe('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })

  it('defaults to dark when the system prefers dark and nothing is stored', async () => {
    vi.mocked(window.matchMedia).mockImplementation(
      (query: string) => ({ matches: true, media: query }) as MediaQueryList
    )

    const { useThemeStore } = await importStore()

    expect(useThemeStore.getState().theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggleTheme flips the theme and updates the document class', async () => {
    const { useThemeStore } = await importStore()
    const initial = useThemeStore.getState().theme
    const flipped = initial === 'dark' ? 'light' : 'dark'

    useThemeStore.getState().toggleTheme()

    expect(useThemeStore.getState().theme).toBe(flipped)
    expect(document.documentElement.classList.contains(flipped)).toBe(true)
    expect(document.documentElement.classList.contains(initial)).toBe(false)
  })

  it('setTheme applies the given theme to the document', async () => {
    const { useThemeStore } = await importStore()

    useThemeStore.getState().setTheme('dark')

    expect(useThemeStore.getState().theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
