import { PROLOGUE_CANDLE_X, PROLOGUE_WAX_TOP } from '../layout'
import { createPixelBuffer, type PixelBuffer } from '../painter'
import type { Rng } from '../prng'
import { glow, HEIGHT, WIDTH } from './shared'
import type { BackdropLayers } from './types'

const CANDLE_X = PROLOGUE_CANDLE_X
const DISH_Y = 136
const WAX_TOP = PROLOGUE_WAX_TOP

const paintFar = (): PixelBuffer => {
  const far = createPixelBuffer(WIDTH, HEIGHT)
  far.fillRect(0, 0, WIDTH, HEIGHT, 'void')
  glow(far, CANDLE_X, 98, 120, 'night', 16, 0.8)
  glow(far, CANDLE_X, 98, 64, 'stone', 10, 0.8)
  glow(far, CANDLE_X, 98, 30, 'ash', 7)
  glow(far, CANDLE_X, WAX_TOP - 10, 46, 'copper', 3)
  glow(far, CANDLE_X, WAX_TOP - 10, 24, 'ember', 4)
  return far
}

const paintMid = (): PixelBuffer => {
  const mid = createPixelBuffer(WIDTH, HEIGHT)
  mid.polygon(
    [
      [CANDLE_X - 24, DISH_Y],
      [CANDLE_X + 24, DISH_Y],
      [CANDLE_X + 18, DISH_Y + 5],
      [CANDLE_X - 18, DISH_Y + 5],
    ],
    'gold'
  )
  mid.line(CANDLE_X - 24, DISH_Y, CANDLE_X + 24, DISH_Y, 'parchment')
  mid.line(CANDLE_X - 18, DISH_Y + 5, CANDLE_X + 18, DISH_Y + 5, 'copper')
  mid.fillRect(CANDLE_X - 22, DISH_Y + 6, 44, 1, 'night')
  mid.circle(CANDLE_X + 30, DISH_Y + 1, 4, 'gold')
  mid.circle(CANDLE_X + 30, DISH_Y + 1, 2, 'void')
  mid.fillRect(CANDLE_X - 8, DISH_Y - 3, 16, 3, 'copper')
  mid.fillRect(CANDLE_X - 7, WAX_TOP, 14, DISH_Y - 3 - WAX_TOP, 'parchment')
  mid.line(CANDLE_X - 7, WAX_TOP + 1, CANDLE_X - 7, DISH_Y - 4, 'moon')
  mid.fillRect(CANDLE_X + 4, WAX_TOP + 1, 3, DISH_Y - 4 - WAX_TOP, 'mist')
  for (const [x, length] of [
    [CANDLE_X - 5, 9],
    [CANDLE_X + 2, 5],
    [CANDLE_X + 6, 12],
  ] as const) {
    mid.fillRect(x, WAX_TOP, 2, length, 'moon')
    mid.pixel(x, WAX_TOP + length, 'moon')
  }
  mid.fillRect(CANDLE_X - 8, WAX_TOP - 1, 16, 2, 'moon')
  mid.pixel(CANDLE_X, WAX_TOP - 2, 'night')
  mid.pixel(CANDLE_X, WAX_TOP - 3, 'night')
  return mid
}

const paintNear = (rng: Rng): PixelBuffer => {
  const near = createPixelBuffer(WIDTH, HEIGHT)
  for (let index = 0; index < 6; index += 1) {
    near.pixel(CANDLE_X + rng.int(-10, 10), WAX_TOP - rng.int(14, 30), 'ember')
  }
  let x = CANDLE_X
  for (let y = WAX_TOP - 18; y > 30; y -= 2) {
    x += rng.int(-1, 1)
    if (rng.next() < 0.55) near.pixel(x, y, y > 60 ? 'mist' : 'slate')
  }
  return near
}

export const generatePrologue = (rng: Rng): BackdropLayers => ({
  far: paintFar(),
  mid: paintMid(),
  near: paintNear(rng),
})
