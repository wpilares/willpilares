import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MaskedText } from './MaskedText'

let observerCallback: IntersectionObserverCallback
const observe = vi.fn()

class MockIntersectionObserver implements Partial<IntersectionObserver> {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback
  }
  observe = observe
  unobserve = vi.fn()
  disconnect = vi.fn()
}

const originalMatchMedia = window.matchMedia

const mockReducedMotion = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

const emitIntersection = () => {
  act(() => {
    observerCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      undefined as unknown as IntersectionObserver
    )
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  mockReducedMotion(false)
})

afterEach(() => {
  vi.unstubAllGlobals()
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: originalMatchMedia,
  })
})

describe('MaskedText', () => {
  it('splits the text into masked words and keeps the full text content', () => {
    const { container } = render(<MaskedText text="holds up in production" />)

    const root = container.firstElementChild
    const masks = container.querySelectorAll('span.word-mask > span.word-mask__inner')

    expect(root?.tagName).toBe('SPAN')
    expect(root?.textContent).toBe('holds up in production')
    expect(masks).toHaveLength(4)
    expect(masks[0]).toHaveTextContent('holds')
    expect(masks[3]).toHaveTextContent('production')
    expect(masks[2].getAttribute('style')).toContain('--i: 2')
  })

  it('exposes one accessible string and hides the word fragments', () => {
    const { container } = render(<MaskedText text="Software that" />)

    const root = container.firstElementChild
    const masks = container.querySelectorAll('span.word-mask')

    expect(root).toHaveAttribute('aria-label', 'Software that')
    for (const mask of masks) {
      expect(mask).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('renders the requested element with the given class', () => {
    const { container } = render(
      <MaskedText as="h2" className="display-headline" text="All work" />
    )

    const root = container.firstElementChild
    expect(root?.tagName).toBe('H2')
    expect(root).toHaveClass('display-headline')
  })

  it('sets the base delay and stagger variables from props', () => {
    const { container } = render(<MaskedText text="Hello there" delayMs={250} staggerMs={60} />)

    const style = container.firstElementChild?.getAttribute('style') ?? ''
    expect(style).toContain('--base: 250ms')
    expect(style).toContain('--stagger: 60ms')
  })

  it('uses a 45ms stagger by default', () => {
    const { container } = render(<MaskedText text="Hello there" />)

    expect(container.firstElementChild?.getAttribute('style')).toContain('--stagger: 45ms')
  })

  it('stays masked until it intersects', () => {
    const { container } = render(<MaskedText text="Hello there" />)

    const root = container.firstElementChild
    expect(root).not.toHaveClass('is-revealed')
    expect(observe).toHaveBeenCalledOnce()

    emitIntersection()

    expect(root).toHaveClass('is-revealed')
  })

  it('reveals on mount when immediate', () => {
    const { container } = render(<MaskedText text="Hello there" immediate />)

    expect(container.firstElementChild).toHaveClass('is-revealed')
  })

  it('renders revealed from the first paint under reduced motion', () => {
    mockReducedMotion(true)
    const { container } = render(<MaskedText text="Hello there" />)

    expect(container.firstElementChild).toHaveClass('is-revealed')
  })
})
