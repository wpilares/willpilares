import { describe, expect, it } from 'vitest'
import { createRng } from './prng'

const sample = (seed: number, count: number): number[] => {
  const rng = createRng(seed)
  return Array.from({ length: count }, () => rng.next())
}

describe('createRng', () => {
  it('produces the same sequence for the same seed', () => {
    expect(sample(42, 50)).toEqual(sample(42, 50))
  })

  it('produces different sequences for different seeds', () => {
    expect(sample(1, 10)).not.toEqual(sample(2, 10))
  })

  it('keeps next within the unit interval', () => {
    for (const value of sample(7, 1000)) {
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })

  it('returns inclusive integers within range and reaches both ends', () => {
    const rng = createRng(99)
    const seen = new Set<number>()
    for (let index = 0; index < 500; index += 1) {
      const value = rng.int(3, 6)
      expect(Number.isInteger(value)).toBe(true)
      expect(value).toBeGreaterThanOrEqual(3)
      expect(value).toBeLessThanOrEqual(6)
      seen.add(value)
    }
    expect([...seen].sort()).toEqual([3, 4, 5, 6])
  })

  it('picks only items from the list', () => {
    const rng = createRng(5)
    const items = ['a', 'b', 'c'] as const
    for (let index = 0; index < 100; index += 1) {
      expect(items).toContain(rng.pick(items))
    }
  })
})
