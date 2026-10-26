import { MotionProvider } from '@components'
import { type MascotEvent, mascotBus } from '@mascot'
import { SceneProvider } from '@scenes'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Arms } from './Arms'
import { Hunter } from './Hunter'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))

class StubIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

const originalMatchMedia = window.matchMedia
const originalObserver = window.IntersectionObserver

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

const renderChapters = () =>
  render(
    <MotionProvider>
      <SceneProvider>
        <Hunter />
        <Arms />
      </SceneProvider>
    </MotionProvider>
  )

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', StubIntersectionObserver)
})

afterEach(() => {
  window.matchMedia = originalMatchMedia
  window.IntersectionObserver = originalObserver
  vi.unstubAllGlobals()
})

describe('hunter and arms chapters', () => {
  it('anchors the hunter at about and the armory at skills', () => {
    mockMatchMedia([])
    const { container } = renderChapters()
    expect(container.querySelector('section#about')).toHaveAttribute('data-scene', 'hunter')
    expect(container.querySelector('section#skills')).toHaveAttribute('data-scene', 'arms')
  })

  it('writes the journal page, both notes and four tallies for the hunter', () => {
    mockMatchMedia(['(prefers-reduced-motion: reduce)'])
    renderChapters()
    expect(screen.getByRole('heading', { name: 'journal.chapters.hunter.title' })).toBeVisible()
    expect(screen.getByText('journal.hunter.statement')).toBeInTheDocument()
    expect(screen.getByText('journal.hunter.notes.one')).toBeInTheDocument()
    expect(screen.getByText('journal.hunter.notes.two')).toBeInTheDocument()
    expect(screen.getByText('journal.hunter.stats.years')).toBeInTheDocument()
    expect(screen.getByText('journal.hunter.stats.squad')).toBeInTheDocument()
  })

  it('lays out five shelves of engraved plates in the armory', () => {
    mockMatchMedia(['(prefers-reduced-motion: reduce)'])
    renderChapters()
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(5)
    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'MCP' })).toBeInTheDocument()
  })

  it('asks the cat to stretch at most once while plates are lit in quick succession', () => {
    mockMatchMedia([])
    const events: MascotEvent[] = []
    const unsubscribe = mascotBus.subscribe((event) => events.push(event))
    renderChapters()
    fireEvent.pointerEnter(screen.getByRole('button', { name: 'React' }))
    fireEvent.focus(screen.getByRole('button', { name: 'Docker' }))
    unsubscribe()
    expect(events).toEqual([{ type: 'gesture', name: 'stretch' }])
  })
})
