import { MotionProvider } from '@components'
import { SceneProvider } from '@scenes'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Lab } from './Lab'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))

const FAULT_ALT =
  'NetPulse dashboard: a downed host opens a critical drop-rate alert that later resolves'

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

const renderLab = () =>
  render(
    <MotionProvider>
      <SceneProvider>
        <Lab />
      </SceneProvider>
    </MotionProvider>
  )

afterEach(() => {
  window.matchMedia = originalMatchMedia
  vi.restoreAllMocks()
})

describe('lab mirror media', () => {
  it('plays the fault recording as a muted looping video with a poster', () => {
    mockMatchMedia([])
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1440)
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(900)
    const { container } = renderLab()

    const video = container.querySelector('video')
    expect(video).not.toBeNull()
    expect(video).toHaveAttribute('aria-label', FAULT_ALT)
    expect(video).toHaveAttribute('poster', '/projects/netpulse-fault-poster.jpg')
    expect(video).toHaveAttribute('loop')
    expect(video).toHaveAttribute('playsinline')
    expect(video?.muted).toBe(true)
    const sources = [...(video?.querySelectorAll('source') ?? [])].map((source) => [
      source.getAttribute('src'),
      source.getAttribute('type'),
    ])
    expect(sources).toEqual([
      ['/projects/netpulse-fault.webm', 'video/webm'],
      ['/projects/netpulse-fault.mp4', 'video/mp4'],
    ])
    expect(screen.queryByRole('img', { name: FAULT_ALT })).not.toBeInTheDocument()
  })

  it('shows only the still poster when motion is reduced', () => {
    mockMatchMedia(['(prefers-reduced-motion: reduce)'])
    const { container } = renderLab()

    expect(container.querySelector('video')).toBeNull()
    expect(screen.getByRole('img', { name: FAULT_ALT })).toHaveAttribute(
      'src',
      '/projects/netpulse-fault-poster.jpg'
    )
  })
})
