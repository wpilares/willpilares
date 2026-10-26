import { describe, expect, it } from 'vitest'
import { MOON_MAX_PHASE, MOON_MIN_PHASE, moonPhase, moonTerminator } from './moonPhase'

describe('moonPhase', () => {
  it('starts as a thin crescent and ends full', () => {
    expect(moonPhase(0)).toBe(MOON_MIN_PHASE)
    expect(moonPhase(1)).toBe(MOON_MAX_PHASE)
    expect(MOON_MIN_PHASE).toBe(0.1)
    expect(MOON_MAX_PHASE).toBe(1)
  })

  it('grows linearly with the page progress', () => {
    expect(moonPhase(0.5)).toBeCloseTo(0.55)
    expect(moonPhase(0.25)).toBeCloseTo(0.325)
  })

  it('clamps progress outside 0..1', () => {
    expect(moonPhase(-1)).toBe(MOON_MIN_PHASE)
    expect(moonPhase(2)).toBe(MOON_MAX_PHASE)
    expect(moonPhase(Number.NaN)).toBe(MOON_MIN_PHASE)
  })
})

describe('moonTerminator', () => {
  it('carves the lit half with a wide ellipse while the moon is a crescent', () => {
    expect(moonTerminator(0.1, 10)).toEqual({ rx: 8, lit: false })
  })

  it('is a straight line at the half moon', () => {
    expect(moonTerminator(0.5, 10)).toEqual({ rx: 0, lit: true })
  })

  it('adds a lit ellipse past the half moon until the disc is full', () => {
    expect(moonTerminator(0.75, 10)).toEqual({ rx: 5, lit: true })
    expect(moonTerminator(1, 10)).toEqual({ rx: 10, lit: true })
  })
})
