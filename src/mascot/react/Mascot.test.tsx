import { fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { lanternPoint } from '../lantern'
import { SPRITE_HEIGHT } from '../sprite'
import { Mascot } from './Mascot'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const observe = vi.fn()
const disconnect = vi.fn()

class MockIntersectionObserver implements Partial<IntersectionObserver> {
  observe = observe
  unobserve = vi.fn()
  disconnect = disconnect
}

const originalMatchMedia = window.matchMedia

const mockMatchMedia = (matches: (query: string) => boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: matches(query),
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

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  vi.stubGlobal('requestAnimationFrame', vi.fn().mockReturnValue(1))
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: originalMatchMedia,
  })
})

const queryCanvas = (container: HTMLElement) => container.querySelector('canvas')

describe('Mascot', () => {
  it('renders nothing when matchMedia is unavailable', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: undefined,
    })

    const { container } = render(<Mascot />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders a hidden canvas and survives an unavailable renderer', () => {
    mockMatchMedia(() => false)

    const { container } = render(<Mascot />)
    const canvas = queryCanvas(container)

    expect(canvas).not.toBeNull()
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
    expect(canvas?.style.cursor).toBe('grab')
    expect(canvas?.style.imageRendering).toBe('pixelated')
    expect(canvas?.width).toBe(32 * 2)
    expect(canvas?.height).toBe(32 * 2)
    expect(observe).not.toHaveBeenCalled()
    expect(window.requestAnimationFrame).toHaveBeenCalled()
  })

  it('does not render the lantern glow when the renderer is unavailable', () => {
    mockMatchMedia(() => false)

    const { container } = render(<Mascot />)

    expect(container.querySelector('[data-lantern-glow]')).toBeNull()
  })

  it('renders the lantern glow at the lantern when the renderer is available', () => {
    mockMatchMedia(() => false)
    const context = {
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: '',
      imageSmoothingEnabled: true,
    }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () => context as unknown as CanvasRenderingContext2D
    )
    const scale = 2
    const position = { x: 16, y: window.innerHeight - SPRITE_HEIGHT * scale }
    const expected = lanternPoint(position, 'right', scale)

    const { container } = render(<Mascot />)
    const glow = container.querySelector<HTMLElement>('[data-lantern-glow]')

    expect(glow).not.toBeNull()
    expect(glow?.style.getPropertyValue('--lx')).toBe(`${expected.x}px`)
    expect(glow?.style.getPropertyValue('--ly')).toBe(`${expected.y}px`)
  })

  it('keeps scale 2 below 768 px', () => {
    mockMatchMedia((query) => query === '(min-width: 480px)')

    const { container } = render(<Mascot />)

    expect(queryCanvas(container)?.width).toBe(32 * 2)
  })

  it('uses scale 3 from 768 px', () => {
    mockMatchMedia((query) => query === '(min-width: 768px)' || query === '(min-width: 480px)')

    const { container } = render(<Mascot />)

    expect(queryCanvas(container)?.width).toBe(32 * 3)
  })

  it('uses scale 4 from 1024 px', () => {
    mockMatchMedia((query) =>
      ['(min-width: 1024px)', '(min-width: 768px)', '(min-width: 480px)'].includes(query)
    )

    const { container } = render(<Mascot />)

    expect(queryCanvas(container)?.width).toBe(32 * 4)
  })

  it('places the canvas at the hero anchor before any section observer fires', () => {
    mockMatchMedia((query) => query === '(min-width: 768px)')
    const spriteWidth = 32 * 3
    const spriteHeight = 32 * 3
    const margin = 24
    const expectedX = Math.round((window.innerWidth - spriteWidth) / 2)
    const expectedY = window.innerHeight - margin - spriteHeight

    const { container } = render(<Mascot />)

    expect(queryCanvas(container)?.style.transform).toBe(
      `translate3d(${expectedX}px, ${expectedY}px, 0)`
    )
  })

  it('observes every section with a data-mascot attribute', () => {
    mockMatchMedia(() => false)
    const section = document.createElement('section')
    section.setAttribute('data-mascot', 'left')
    document.body.appendChild(section)

    render(<Mascot />)

    expect(observe).toHaveBeenCalledWith(section)
    section.remove()
  })

  it('shows the hello quip on mount through a polite status region', () => {
    mockMatchMedia(() => false)

    const { getByRole } = render(<Mascot />)

    expect(getByRole('status')).toHaveTextContent('mascot.quips.hello')
  })

  it('does not attach pointer handlers or an animation loop under reduced motion', () => {
    mockMatchMedia((query) => query === '(prefers-reduced-motion: reduce)')

    const { container } = render(<Mascot />)
    const canvas = queryCanvas(container)
    if (canvas === null) throw new Error('canvas missing')

    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10, pointerId: 1 })
    fireEvent.pointerMove(canvas, { clientX: 12, clientY: 12, pointerId: 1 })

    expect(canvas.style.cursor).not.toBe('grab')
    expect(canvas.style.cursor).not.toBe('grabbing')
    expect(canvas.style.pointerEvents).toBe('none')
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()
  })

  it('disconnects the section observer on unmount', () => {
    mockMatchMedia(() => false)

    const { unmount } = render(<Mascot />)
    unmount()

    expect(disconnect).toHaveBeenCalled()
  })

  it('docks the cat at the left of the bottom dock below 768 px', () => {
    mockMatchMedia(() => false)

    const { container } = render(<Mascot />)

    expect(queryCanvas(container)?.style.transform).toBe(
      `translate3d(16px, ${window.innerHeight - 64}px, 0)`
    )
  })

  it('reserves the dock height for the cat below 768 px', () => {
    mockMatchMedia(() => false)

    render(<Mascot />)

    expect(document.documentElement.style.getPropertyValue('--cat-reserve')).toBe('64px')
  })

  it('reserves the sprite height, its margin and a gap above the cat on desktop', () => {
    mockMatchMedia((query) =>
      ['(min-width: 1024px)', '(min-width: 768px)', '(min-width: 480px)'].includes(query)
    )

    render(<Mascot />)

    expect(document.documentElement.style.getPropertyValue('--cat-reserve')).toBe(
      `${32 * 4 + 24 + 16}px`
    )
  })

  it('clears the cat reserve on unmount', () => {
    mockMatchMedia(() => false)

    const { unmount } = render(<Mascot />)
    unmount()

    expect(document.documentElement.style.getPropertyValue('--cat-reserve')).toBe('')
  })
})
