import { MotionProvider } from '@components'
import { SceneProvider } from '@scenes'
import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { City } from './City'

const i18n = vi.hoisted(() => ({ language: 'en' }))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n }),
}))

const cvLink = () =>
  screen.getByRole('link', { name: /^journal\.city\.ctaCv,\s*journal\.city\.ctaCvPlain$/ })

const renderCity = () =>
  render(
    <MotionProvider>
      <SceneProvider>
        <City />
      </SceneProvider>
    </MotionProvider>
  )

const originalMatchMedia = window.matchMedia

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})

afterEach(() => {
  i18n.language = 'en'
  window.matchMedia = originalMatchMedia
})

describe('City CV download', () => {
  it.each([
    ['en', '/cv/CV_Willber_Pilares_en.pdf'],
    ['es', '/cv/CV_Willber_Pilares_es.pdf'],
    ['es-PE', '/cv/CV_Willber_Pilares_es.pdf'],
    ['fr', '/cv/CV_Willber_Pilares_en.pdf'],
  ])('serves the %s reader the matching CV', (language, href) => {
    i18n.language = language
    renderCity()

    expect(cvLink()).toHaveAttribute('href', href)
    expect(cvLink()).toHaveAttribute('download')
  })
})
