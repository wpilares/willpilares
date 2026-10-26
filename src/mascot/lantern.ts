import type { MascotFacing } from './anchor'
import type { Point } from './behavior/motion'
import { SPRITE_WIDTH } from './sprite'

export const LANTERN_PIXEL: Point = { x: 26, y: 26 }

export const lanternPoint = (position: Point, facing: MascotFacing, scale: number): Point => {
  const column = facing === 'right' ? LANTERN_PIXEL.x : SPRITE_WIDTH - 1 - LANTERN_PIXEL.x
  return {
    x: position.x + column * scale + scale / 2,
    y: position.y + LANTERN_PIXEL.y * scale + scale / 2,
  }
}
