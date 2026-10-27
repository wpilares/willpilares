import { MotionProvider } from '@components'
import { type MascotEvent, mascotBus } from '@mascot'
import { SceneProvider } from '@scenes'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Arms } from './Arms'
import { Hunter } from './Hunter'
import { Hunts } from './Hunts'
import { Lab } from './Lab'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
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
    expect(screen.getByRole('heading', { name: 'About me' })).toBeVisible()
    expect(screen.getByText('journal.hunter.statement')).toBeInTheDocument()
    expect(screen.getByText('journal.hunter.notes.one')).toBeInTheDocument()
    expect(screen.getByText('journal.hunter.notes.two')).toBeInTheDocument()
    expect(screen.getByText('journal.hunter.stats.years')).toBeInTheDocument()
    expect(screen.getByText('journal.hunter.stats.apps')).toBeInTheDocument()
  })

  it('shelves every skill as a named book under its category plaque', () => {
    mockMatchMedia(['(prefers-reduced-motion: reduce)'])
    const { container } = renderChapters()
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(5)
    expect(container.querySelectorAll('[data-skill-book]')).toHaveLength(23)
    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'PostgreSQL' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'MCP' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'journal.arms.categories.ai' })).toBeInTheDocument()
  })

  it('lights a book for touch and lets it go on a second tap', () => {
    mockMatchMedia(['(prefers-reduced-motion: reduce)'])
    renderChapters()
    const book = screen.getByRole('button', { name: 'Docker' })
    fireEvent.pointerDown(book, { pointerType: 'touch' })
    expect(book).toHaveAttribute('data-lit', 'true')
    fireEvent.pointerDown(book, { pointerType: 'touch' })
    expect(book).toHaveAttribute('data-lit', 'false')
    fireEvent.pointerDown(book, { pointerType: 'mouse' })
    expect(book).toHaveAttribute('data-lit', 'false')
  })

  it('asks the cat to stretch at most once while books are lit in quick succession', () => {
    mockMatchMedia(['(prefers-reduced-motion: reduce)'])
    const events: MascotEvent[] = []
    const unsubscribe = mascotBus.subscribe((event) => events.push(event))
    renderChapters()
    fireEvent.pointerEnter(screen.getByRole('button', { name: 'React' }))
    fireEvent.focus(screen.getByRole('button', { name: 'Docker' }))
    unsubscribe()
    expect(events).toEqual([{ type: 'gesture', name: 'stretch' }])
  })
})

const renderHuntsAndLab = () =>
  render(
    <MotionProvider>
      <SceneProvider>
        <Hunts />
        <Lab />
      </SceneProvider>
    </MotionProvider>
  )

describe('past hunts and current hunt chapters', () => {
  it('anchors the gallery at experience and the lab at projects in the inventor outfit', () => {
    mockMatchMedia([])
    const { container } = renderHuntsAndLab()
    expect(container.querySelector('section#experience')).toHaveAttribute('data-scene', 'hunts')
    const lab = container.querySelector('section#projects')
    expect(lab).toHaveAttribute('data-scene', 'lab')
    expect(lab).toHaveAttribute('data-mascot-outfit', 'inventor')
  })

  it('hangs one portrait per company in order and marks only the current employer', () => {
    mockMatchMedia(['(prefers-reduced-motion: reduce)'])
    const { container } = renderHuntsAndLab()
    const portraits = [...container.querySelectorAll('[data-portrait]')].map((node) =>
      node.getAttribute('data-portrait')
    )
    expect(portraits).toEqual(['whitelion', 'softtek', 'promitia', 'americaMovil'])
    expect(screen.getAllByText('journal.hunts.current')).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'Whitelion Technology' })).toBeInTheDocument()
  })

  it('writes the five lab entries, three gauges and the link to the code', () => {
    mockMatchMedia(['(prefers-reduced-motion: reduce)'])
    renderHuntsAndLab()
    for (const line of ['one', 'two', 'three', 'four', 'five']) {
      expect(screen.getByText(`journal.lab.lines.${line}`)).toBeInTheDocument()
    }
    expect(screen.getByText('journal.lab.facts.interval')).toBeInTheDocument()
    expect(screen.getByText('journal.lab.facts.detection')).toBeInTheDocument()
    expect(screen.getByText('journal.lab.facts.releases')).toBeInTheDocument()
    expect(screen.getByText('~15 s')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText(/journal\.lab\.status\.complete/)).toBeInTheDocument()
    expect(screen.getByText('v1.0')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'journal.lab.topology' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'journal.lab.viewCode' })).toHaveAttribute(
      'href',
      'https://github.com/wpilares/netpulse'
    )
  })
})
