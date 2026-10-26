import { render } from '@testing-library/react'
import { cloneElement, type ReactElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BubbleLine } from './BubbleLine'

interface TransMockProps {
  i18nKey: string
  components: { accent: ReactElement }
}

vi.mock('react-i18next', () => ({
  Trans: ({ i18nKey, components }: TransMockProps) =>
    cloneElement(components.accent, undefined, i18nKey),
}))

class MockIntersectionObserver implements Partial<IntersectionObserver> {
  observe = vi.fn()
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

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

afterEach(() => {
  vi.unstubAllGlobals()
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: originalMatchMedia,
  })
})

describe('BubbleLine', () => {
  it('renders the accent span with the default accent class', () => {
    mockReducedMotion(false)
    const { container } = render(<BubbleLine i18nKey="about.lines.one" />)

    const accent = container.querySelector('span.text-blue')
    expect(accent).not.toBeNull()
    expect(accent).toHaveTextContent('about.lines.one')
  })

  it('applies a custom accent class', () => {
    mockReducedMotion(false)
    const { container } = render(
      <BubbleLine i18nKey="projects.items.netpulse.lines.one" accentClassName="text-tint-lemon" />
    )

    expect(container.querySelector('span.text-tint-lemon')).not.toBeNull()
  })

  it('starts hidden until it intersects when motion is allowed', () => {
    mockReducedMotion(false)
    const { container } = render(<BubbleLine i18nKey="about.lines.one" />)

    const line = container.querySelector('p')
    expect(line).toHaveClass('reveal')
    expect(line).not.toHaveClass('reveal-visible')
  })

  it('renders visible immediately under reduced motion', () => {
    mockReducedMotion(true)
    const { container } = render(<BubbleLine i18nKey="about.lines.one" />)

    const line = container.querySelector('p')
    expect(line).not.toHaveClass('reveal')
    expect(line).toHaveClass('bubble-line')
  })
})
