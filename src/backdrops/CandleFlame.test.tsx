import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CandleFlame } from './CandleFlame'
import type { CandleFlameFrame } from './useCandleFlame'

const frames: readonly CandleFlameFrame[] = Array.from({ length: 8 }, (_, index) => ({
  src: `data:image/png;base64,flame${index}`,
  glow: 0.75 + index * 0.03,
}))

vi.mock('./useCandleFlame', () => ({
  useCandleFlame: () => frames,
}))

class VisibleIntersectionObserver {
  constructor(private readonly callback: IntersectionObserverCallback) {}
  observe = (target: Element) => {
    const entry: Partial<IntersectionObserverEntry> = { isIntersecting: true, target }
    this.callback([entry as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  }
  unobserve = vi.fn()
  disconnect = vi.fn()
}

const mockReducedMotion = (reduce: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduce && query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

const originalMatchMedia = window.matchMedia

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', VisibleIntersectionObserver)
})

afterEach(() => {
  window.matchMedia = originalMatchMedia
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('CandleFlame', () => {
  it('shows one steady frame without scheduling animation frames under reduced motion', () => {
    mockReducedMotion(true)
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1)
    const { container } = render(<CandleFlame />)
    const images = container.querySelectorAll('img')

    expect(images).toHaveLength(1)
    expect(images[0]).toHaveAttribute('src', frames[0]?.src)
    expect(images[0]).toHaveAttribute('alt', '')
    expect(images[0]).toHaveAttribute('aria-hidden', 'true')
    expect(requestFrame).not.toHaveBeenCalled()
  })

  it('schedules the flicker loop while motion is allowed and the flame is on screen', () => {
    mockReducedMotion(false)
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1)
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined)
    render(<CandleFlame />)

    expect(requestFrame).toHaveBeenCalled()
  })
})
