import { describe, expect, it } from 'vitest'
import { type AnchorInput, parseMascotSide, resolveAnchor } from './anchor'

const base: Omit<AnchorInput, 'side'> = {
  viewport: { width: 1000, height: 800 },
  spriteWidth: 96,
  spriteHeight: 128,
  margin: 24,
}

describe('resolveAnchor', () => {
  it('centres hero at the bottom facing right', () => {
    expect(resolveAnchor({ ...base, side: 'hero' })).toEqual({ x: 452, y: 648, facing: 'right' })
  })

  it('centres outro at the bottom facing right', () => {
    expect(resolveAnchor({ ...base, side: 'outro' })).toEqual({ x: 452, y: 648, facing: 'right' })
  })

  it('places left at the margin facing right', () => {
    expect(resolveAnchor({ ...base, side: 'left' })).toEqual({ x: 24, y: 648, facing: 'right' })
  })

  it('places right against the right edge facing left', () => {
    expect(resolveAnchor({ ...base, side: 'right' })).toEqual({ x: 880, y: 648, facing: 'left' })
  })

  it('places badge in the top right corner facing left', () => {
    expect(resolveAnchor({ ...base, side: 'badge' })).toEqual({ x: 880, y: 24, facing: 'left' })
  })

  it('rounds to integers', () => {
    const anchor = resolveAnchor({
      ...base,
      side: 'hero',
      viewport: { width: 1001, height: 800.5 },
    })
    expect(Number.isInteger(anchor.x)).toBe(true)
    expect(Number.isInteger(anchor.y)).toBe(true)
  })

  it('clamps to zero on tiny viewports', () => {
    const anchor = resolveAnchor({ ...base, side: 'right', viewport: { width: 50, height: 60 } })
    expect(anchor).toEqual({ x: 0, y: 0, facing: 'left' })
  })
})

describe('parseMascotSide', () => {
  it('returns known sides unchanged', () => {
    expect(parseMascotSide('hero')).toBe('hero')
    expect(parseMascotSide('badge')).toBe('badge')
    expect(parseMascotSide('outro')).toBe('outro')
  })

  it('falls back to left for unknown, null or undefined input', () => {
    expect(parseMascotSide('up')).toBe('left')
    expect(parseMascotSide('')).toBe('left')
    expect(parseMascotSide(null)).toBe('left')
    expect(parseMascotSide(undefined)).toBe('left')
  })
})
