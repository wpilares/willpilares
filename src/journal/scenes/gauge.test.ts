import { describe, expect, it } from 'vitest'
import { gaugeTicks, needleAngle } from './gauge'

describe('brass gauge', () => {
  it('maps an empty dial to -120 degrees and a full dial to 120 degrees', () => {
    expect(needleAngle(0)).toBe(-120)
    expect(needleAngle(0.5)).toBe(0)
    expect(needleAngle(1)).toBe(120)
    expect(needleAngle(0.25)).toBe(-60)
  })

  it('pins the needle at the stops when the reading leaves the dial', () => {
    expect(needleAngle(-0.4)).toBe(-120)
    expect(needleAngle(1.7)).toBe(120)
    expect(needleAngle(Number.NaN)).toBe(-120)
  })

  it('spreads the ticks evenly across the sweep', () => {
    expect(gaugeTicks(5)).toEqual([-120, -60, 0, 60, 120])
    expect(gaugeTicks(1)).toEqual([-120])
  })
})
