import { describe, expect, it } from 'vitest'
import { stepTowards } from './motion'

describe('stepTowards', () => {
  it('moves at most speed pixels along each axis', () => {
    const result = stepTowards({ x: 0, y: 0 }, { x: 100, y: -100 }, 3)

    expect(result).toEqual({ position: { x: 3, y: -3 }, arrived: false, facing: 'right' })
  })

  it('faces left when travelling left', () => {
    const result = stepTowards({ x: 50, y: 0 }, { x: 0, y: 0 }, 3)

    expect(result.position).toEqual({ x: 47, y: 0 })
    expect(result.facing).toBe('left')
  })

  it('reports null facing when only moving vertically', () => {
    const result = stepTowards({ x: 10, y: 0 }, { x: 10, y: 40 }, 3)

    expect(result.position).toEqual({ x: 10, y: 3 })
    expect(result.facing).toBeNull()
    expect(result.arrived).toBe(false)
  })

  it('snaps onto the target without overshooting and reports arrival', () => {
    const result = stepTowards({ x: 98, y: 1 }, { x: 100, y: 0 }, 3)

    expect(result).toEqual({ position: { x: 100, y: 0 }, arrived: true, facing: 'right' })
  })

  it('reports arrival with null facing when already at the target', () => {
    const result = stepTowards({ x: 5, y: 5 }, { x: 5, y: 5 }, 3)

    expect(result).toEqual({ position: { x: 5, y: 5 }, arrived: true, facing: null })
  })
})
