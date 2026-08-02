import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useIntersectionObserver } from './useIntersectionObserver'

let observerCallback: IntersectionObserverCallback
const observe = vi.fn()
const unobserve = vi.fn()
const disconnect = vi.fn()

class MockIntersectionObserver implements Partial<IntersectionObserver> {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback
  }
  observe = observe
  unobserve = unobserve
  disconnect = disconnect
}

const Probe = ({ triggerOnce }: { triggerOnce?: boolean }) => {
  const [ref, isVisible] = useIntersectionObserver({ triggerOnce })
  return <div ref={ref} data-testid="probe" data-visible={isVisible} />
}

const emitIntersection = (isIntersecting: boolean) => {
  act(() => {
    observerCallback(
      [{ isIntersecting } as IntersectionObserverEntry],
      undefined as unknown as IntersectionObserver
    )
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('useIntersectionObserver', () => {
  it('starts hidden and observes the element', () => {
    render(<Probe />)

    expect(screen.getByTestId('probe')).toHaveAttribute('data-visible', 'false')
    expect(observe).toHaveBeenCalledOnce()
  })

  it('becomes visible when the element intersects', () => {
    render(<Probe />)

    emitIntersection(true)

    expect(screen.getByTestId('probe')).toHaveAttribute('data-visible', 'true')
  })

  it('stops observing after the first intersection by default', () => {
    render(<Probe />)

    emitIntersection(true)

    expect(unobserve).toHaveBeenCalledOnce()
  })

  it('toggles visibility off again when triggerOnce is false', () => {
    render(<Probe triggerOnce={false} />)

    emitIntersection(true)
    emitIntersection(false)

    expect(screen.getByTestId('probe')).toHaveAttribute('data-visible', 'false')
    expect(unobserve).not.toHaveBeenCalled()
  })

  it('disconnects the observer on unmount', () => {
    const { unmount } = render(<Probe />)

    unmount()

    expect(disconnect).toHaveBeenCalledOnce()
  })
})
