import { describe, expect, it } from 'vitest'
import type { QuipKey } from './bus'
import { pickScrollQuip, randomTrickGesture, TRICK_GESTURES } from './quips'

describe('pickScrollQuip', () => {
  it('shows the mobile quip once when on mobile', () => {
    const shownKeys = new Set<QuipKey>()

    expect(pickScrollQuip({ direction: 'down', isMobile: true, shownKeys })).toBe('mobile')
  })

  it('does not repeat the mobile quip', () => {
    const shownKeys = new Set<QuipKey>(['mobile'])

    expect(pickScrollQuip({ direction: 'down', isMobile: true, shownKeys })).toBeNull()
  })

  it('shows scrollBack on the first scroll up', () => {
    const shownKeys = new Set<QuipKey>()

    expect(pickScrollQuip({ direction: 'up', isMobile: false, shownKeys })).toBe('scrollBack')
  })

  it('prefers the mobile quip over scrollBack when both are pending', () => {
    const shownKeys = new Set<QuipKey>()

    expect(pickScrollQuip({ direction: 'up', isMobile: true, shownKeys })).toBe('mobile')
  })

  it('does not repeat scrollBack', () => {
    const shownKeys = new Set<QuipKey>(['scrollBack'])

    expect(pickScrollQuip({ direction: 'up', isMobile: false, shownKeys })).toBeNull()
  })

  it('returns null when scrolling down on desktop', () => {
    const shownKeys = new Set<QuipKey>()

    expect(pickScrollQuip({ direction: 'down', isMobile: false, shownKeys })).toBeNull()
  })
})

describe('randomTrickGesture', () => {
  it('offers wave, cheer, thumbs, think and sulk', () => {
    expect([...TRICK_GESTURES]).toEqual(['wave', 'cheer', 'thumbs', 'think', 'sulk'])
  })

  it('maps the random number onto the trick list', () => {
    expect(randomTrickGesture(() => 0)).toBe('wave')
    expect(randomTrickGesture(() => 0.5)).toBe('thumbs')
    expect(randomTrickGesture(() => 0.999)).toBe('sulk')
  })

  it('clamps out-of-range random values into the list', () => {
    expect(randomTrickGesture(() => 1)).toBe('sulk')
    expect(randomTrickGesture(() => -1)).toBe('wave')
  })
})
