import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountUp } from './useCountUp'

let frameQueue: FrameRequestCallback[] = []

const flushFrame = (timestamp: number) => {
  const callbacks = frameQueue
  frameQueue = []
  act(() => {
    for (const callback of callbacks) callback(timestamp)
  })
}

const mockReducedMotion = (matches: boolean) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  )
}

const Probe = ({ target, start }: { target: number; start: boolean }) => {
  const value = useCountUp(target, { start, duration: 1000 })
  return <span data-testid="value">{value}</span>
}

beforeEach(() => {
  frameQueue = []
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frameQueue.push(callback)
    return frameQueue.length
  })
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  mockReducedMotion(false)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useCountUp', () => {
  it('stays at zero until started', () => {
    render(<Probe target={10} start={false} />)

    flushFrame(0)

    expect(screen.getByTestId('value')).toHaveTextContent('0')
  })

  it('animates towards the target once started', () => {
    render(<Probe target={10} start />)

    flushFrame(0)
    flushFrame(500)
    const midway = Number(screen.getByTestId('value').textContent)

    expect(midway).toBeGreaterThan(0)
    expect(midway).toBeLessThan(10)
  })

  it('ends exactly on the target after the duration', () => {
    render(<Probe target={10} start />)

    flushFrame(0)
    flushFrame(1000)

    expect(screen.getByTestId('value')).toHaveTextContent('10')
  })

  it('shows the target immediately when reduced motion is preferred', () => {
    mockReducedMotion(true)

    render(<Probe target={8} start={false} />)

    expect(screen.getByTestId('value')).toHaveTextContent('8')
  })
})
