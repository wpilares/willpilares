import { MotionProvider } from '@components'
import { type MascotEvent, mascotBus } from '@mascot'
import { SceneProvider } from '@scenes'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Archive } from './Archive'
import { Epilogue } from './Epilogue'
import { Raven } from './Raven'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}))

const email = 'wgpilaresc@gmail.com'
const copiedLabel = 'journal.raven.copied'
const originalLocation = window.location
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

const stubClipboard = (writeText: (() => Promise<void>) | undefined) => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: writeText === undefined ? undefined : { writeText },
  })
}

const stubLocationAssign = () => {
  const assign = vi.fn()
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { ...originalLocation, assign },
  })
  return assign
}

const renderScene = (scene: JSX.Element) =>
  render(
    <MotionProvider>
      <SceneProvider>{scene}</SceneProvider>
    </MotionProvider>
  )

beforeEach(() => {
  vi.useFakeTimers()
  mockMatchMedia(['(prefers-reduced-motion: reduce)'])
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  stubClipboard(undefined)
  window.matchMedia = originalMatchMedia
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: originalLocation,
  })
})

describe('Raven', () => {
  it('anchors the raven chapter at contact', () => {
    const { container } = renderScene(<Raven />)

    expect(container.querySelector('section#contact')).toHaveAttribute('data-scene', 'raven')
    expect(screen.getByRole('heading', { name: 'Send a raven' })).toBeVisible()
  })

  it('copies the email, shows the copied label and emits the copied quip', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard(writeText)
    const emit = vi.spyOn(mascotBus, 'emit')
    renderScene(<Raven />)

    fireEvent.click(screen.getByRole('button', { name: email }))

    await vi.waitFor(() => {
      expect(screen.getByRole('button', { name: copiedLabel })).toBeInTheDocument()
    })
    expect(writeText).toHaveBeenCalledWith(email)
    expect(emit).toHaveBeenCalledWith({ type: 'quip', key: 'copied' })
    expect(screen.getByRole('status')).toHaveTextContent(copiedLabel)
  })

  it('restores the email label after the feedback delay', async () => {
    stubClipboard(vi.fn().mockResolvedValue(undefined))
    renderScene(<Raven />)

    fireEvent.click(screen.getByRole('button', { name: email }))
    await vi.waitFor(() => {
      expect(screen.getByRole('button', { name: copiedLabel })).toBeInTheDocument()
    })

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByRole('button', { name: email })).toBeInTheDocument()
  })

  it('falls back to a mailto navigation when the clipboard is unavailable', () => {
    stubClipboard(undefined)
    const assign = stubLocationAssign()
    const emit = vi.spyOn(mascotBus, 'emit')
    renderScene(<Raven />)

    fireEvent.click(screen.getByRole('button', { name: email }))

    expect(assign).toHaveBeenCalledWith(`mailto:${email}`)
    expect(emit).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: email })).toBeInTheDocument()
  })

  it('falls back to a mailto navigation when writing to the clipboard fails', async () => {
    stubClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    const assign = stubLocationAssign()
    renderScene(<Raven />)

    fireEvent.click(screen.getByRole('button', { name: email }))

    await vi.waitFor(() => expect(assign).toHaveBeenCalledWith(`mailto:${email}`))
    expect(screen.getByRole('button', { name: email })).toBeInTheDocument()
  })

  it('seals the GitHub and LinkedIn links', () => {
    renderScene(<Raven />)

    expect(screen.getByRole('link', { name: 'journal.raven.links.github' })).toHaveAttribute(
      'href',
      'https://github.com/wpilares'
    )
    expect(screen.getByRole('link', { name: 'journal.raven.links.linkedin' })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/wpilaresc'
    )
  })

  it('stamps each seal with its brand mark instead of a letter', () => {
    renderScene(<Raven />)

    for (const name of ['journal.raven.links.github', 'journal.raven.links.linkedin']) {
      const seal = screen.getByRole('link', { name })
      expect(seal.querySelector('svg[aria-hidden="true"] path')).not.toBeNull()
      expect(seal).not.toHaveTextContent(/^(G|in)/)
    }
  })
})

describe('Archive', () => {
  it('stacks the three sealed volumes in the scholar outfit', () => {
    const { container } = renderScene(<Archive />)
    const section = container.querySelector('section#archive')

    expect(section).toHaveAttribute('data-mascot-outfit', 'scholar')
    const volumes = [...container.querySelectorAll('[data-volume]')].map((node) =>
      node.getAttribute('data-volume')
    )
    expect(volumes).toEqual(['designSystem', 'mcp', 'identity'])
    expect(screen.getAllByText('journal.archive.comingSoon')).toHaveLength(3)
    expect(screen.getByText('journal.archive.volumes.mcp.note')).toBeInTheDocument()
  })

  it('shelves every volume as a book when pinned', () => {
    mockMatchMedia([])
    renderScene(<Archive />)

    expect(screen.getAllByRole('button', { hidden: true })).toHaveLength(3)
  })

  it('keeps unrevealed books out of the accessibility tree when pinned', () => {
    mockMatchMedia([])
    renderScene(<Archive />)

    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})

describe('Epilogue', () => {
  it('closes the journal inside a footer landmark', () => {
    renderScene(<Epilogue />)

    expect(screen.getByRole('contentinfo')).toHaveTextContent('End of the journal')
  })

  it('asks the cat for a trick and a purr', () => {
    const events: MascotEvent[] = []
    const unsubscribe = mascotBus.subscribe((event) => events.push(event))
    renderScene(<Epilogue />)

    fireEvent.click(screen.getByRole('button', { name: 'journal.epilogue.trick' }))
    fireEvent.click(screen.getByRole('button', { name: 'journal.epilogue.pet' }))
    unsubscribe()

    expect(events).toEqual([
      { type: 'trick' },
      { type: 'gesture', name: 'purr' },
      { type: 'quip', key: 'purr' },
    ])
  })
})
