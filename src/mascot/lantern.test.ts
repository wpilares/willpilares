import { describe, expect, it } from 'vitest'
import { LANTERN_PIXEL, lanternPoint } from './lantern'
import { SPRITE_HEIGHT, SPRITE_WIDTH } from './sprite'

describe('lanternPoint', () => {
  it('keeps the lantern pixel inside the sprite grid', () => {
    expect(LANTERN_PIXEL.x).toBeGreaterThanOrEqual(0)
    expect(LANTERN_PIXEL.x).toBeLessThan(SPRITE_WIDTH)
    expect(LANTERN_PIXEL.y).toBeGreaterThanOrEqual(0)
    expect(LANTERN_PIXEL.y).toBeLessThan(SPRITE_HEIGHT)
  })

  it('centres on the lantern pixel when facing right', () => {
    expect(lanternPoint({ x: 100, y: 50 }, 'right', 4)).toEqual({
      x: 100 + LANTERN_PIXEL.x * 4 + 2,
      y: 50 + LANTERN_PIXEL.y * 4 + 2,
    })
  })

  it('mirrors the lantern pixel when facing left', () => {
    expect(lanternPoint({ x: 100, y: 50 }, 'left', 4)).toEqual({
      x: 100 + (SPRITE_WIDTH - 1 - LANTERN_PIXEL.x) * 4 + 2,
      y: 50 + LANTERN_PIXEL.y * 4 + 2,
    })
  })
})
