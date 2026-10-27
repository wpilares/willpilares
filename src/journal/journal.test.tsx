import { MotionProvider } from '@components'
import { mascotBus } from '@mascot'
import { SceneProvider } from '@scenes'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChapterRail } from './navigation/ChapterRail'
import { MoonProgress } from './navigation/MoonProgress'
import { SkipToChapters } from './navigation/SkipToChapters'
import { City } from './scenes/City'
import { Prologue } from './scenes/Prologue'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}))

const originalMatchMedia = window.matchMedia

const mockMatchMedia = (matchingQueries: readonly string[]) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: matchingQueries.includes(query),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

const renderJournal = () =>
  render(
    <MotionProvider>
      <SceneProvider>
        <SkipToChapters />
        <Prologue />
        <City />
        <ChapterRail />
        <MoonProgress />
      </SceneProvider>
    </MotionProvider>
  )

afterEach(() => {
  window.matchMedia = originalMatchMedia
})

describe('journal opening', () => {
  it('puts the name in the city heading with its calls to action', () => {
    mockMatchMedia(['(prefers-reduced-motion: reduce)'])
    renderJournal()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Willber Pilares')
    expect(
      screen.getByRole('link', {
        name: /^journal\.city\.ctaContact,\s*journal\.city\.ctaContactPlain$/,
      })
    ).toHaveAttribute('href', '#contact')
    expect(
      screen.getByRole('link', { name: /^journal\.city\.ctaCv,\s*journal\.city\.ctaCvPlain$/ })
    ).toHaveAttribute('download')
  })

  it('anchors the city as the home scene that keeps the hero cat sitting', () => {
    mockMatchMedia([])
    const { container } = renderJournal()
    const city = container.querySelector('section[data-scene="city"]')

    expect(city).toHaveAttribute('id', 'home')
    expect(city).toHaveAttribute('data-mascot', 'hero')
    expect(city).toHaveAttribute('data-mascot-gesture', 'sit')
  })

  it('shows the prologue hint only while motion is allowed', () => {
    mockMatchMedia([])
    const { unmount } = renderJournal()
    expect(screen.getByText('journal.prologue.hint')).toBeInTheDocument()
    unmount()

    mockMatchMedia(['(prefers-reduced-motion: reduce)'])
    renderJournal()
    expect(screen.queryByText('journal.prologue.hint')).toBeNull()
  })
})

describe('chapter rail', () => {
  it('lists the five chapters inside a labelled navigation landmark', () => {
    mockMatchMedia([])
    renderJournal()
    const rail = screen.getByRole('navigation', { name: 'journal.nav.label', hidden: true })

    expect(rail.querySelectorAll('a')).toHaveLength(5)
    expect(rail).toHaveAttribute('data-visible', 'false')
  })

  it('asks the cat to travel to the clicked chapter', () => {
    mockMatchMedia([])
    renderJournal()
    const listener = vi.fn()
    const unsubscribe = mascotBus.subscribe(listener)
    const rail = screen.getByRole('navigation', { name: 'journal.nav.label', hidden: true })
    const skills = rail.querySelector('a[href="#skills"]')
    if (!skills) throw new Error('skills chapter missing')

    fireEvent.click(skills)
    unsubscribe()

    expect(listener).toHaveBeenCalledWith({ type: 'travel', anchor: 'skills' })
  })
})

describe('skip to chapters', () => {
  it('is the first focusable element of the journal', () => {
    mockMatchMedia([])
    const { container } = renderJournal()

    expect(container.querySelector('a[href], button')).toHaveTextContent('journal.nav.skip')
  })

  it('reveals the hidden rail and focuses its first chapter', () => {
    mockMatchMedia([])
    renderJournal()
    const rail = screen.getByRole('navigation', { name: 'journal.nav.label', hidden: true })

    fireEvent.click(screen.getByRole('link', { name: 'journal.nav.skip' }))

    expect(rail).toHaveAttribute('data-visible', 'true')
    expect(document.activeElement).toBe(rail.querySelector('a[href="#about"]'))
  })
})

describe('moon progress', () => {
  it('starts as a thin crescent', () => {
    mockMatchMedia([])
    const { container } = renderJournal()

    expect(container.querySelector('[data-moon-progress]')).toHaveAttribute('data-phase', '0.1')
  })
})

describe('city heading before it is revealed', () => {
  it('keeps the unrevealed name out of the accessibility tree', () => {
    mockMatchMedia([])
    renderJournal()

    expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
  })
})
