import { createPixelBuffer, type PixelBuffer } from '../painter'
import type { PaletteKey } from '../palette'
import type { Rng } from '../prng'
import { skyline } from './city'
import { ditherFill, fogStrip, glow, HEIGHT, moon, stars, verticalGradient, WIDTH } from './shared'
import type { BackdropLayers } from './types'

const CURB_Y = 124
const LAMP_X = 66

const cobbles = (far: PixelBuffer, rng: Rng) => {
  far.fillRect(0, CURB_Y, WIDTH, HEIGHT - CURB_Y, 'night')
  far.fillRect(0, CURB_Y, WIDTH, 2, 'slate')
  far.fillRect(0, CURB_Y + 2, WIDTH, 1, 'stone')
  let y = CURB_Y + 4
  let row = 0
  while (y < HEIGHT) {
    const height = Math.round(2 + (y - CURB_Y) * 0.13)
    const stoneWidth = Math.round(height * 2.4)
    let x = row % 2 === 0 ? -Math.floor(stoneWidth / 2) : 0
    while (x < WIDTH) {
      const width = stoneWidth + rng.int(-1, 1)
      const face: PaletteKey = rng.next() < 0.3 ? 'stone' : 'ash'
      far.fillRect(x + 1, y, width - 1, height - 1, face)
      if (height > 3) {
        far.line(x + 1, y, x + width - 2, y, face === 'ash' ? 'slate' : 'ash')
        far.pixel(x + 1, y, 'mist')
      }
      x += width
    }
    if (y < CURB_Y + 18) ditherFill(far, 0, y, WIDTH, height, 'stone', 6)
    y += height
    row += 1
  }
}

const paintFar = (rng: Rng): PixelBuffer => {
  const far = createPixelBuffer(WIDTH, HEIGHT)
  verticalGradient(far, 0, 0, WIDTH, 70, ['void', 'night', 'stone'])
  far.fillRect(0, 70, WIDTH, CURB_Y - 70, 'stone')
  stars(far, rng, 22, 40, ['slate', 'mist', 'moonGlow'])
  moon(far, rng, 290, 15, 12)
  skyline(far, rng, {
    x: 0,
    width: WIDTH,
    baseY: 44,
    scale: 0.8,
    body: 'stone',
    rim: 'ash',
    lights: 'gold',
  })
  cobbles(far, rng)
  return far
}

const facade = (
  mid: PixelBuffer,
  rng: Rng,
  x: number,
  width: number,
  top: number,
  body: PaletteKey,
  trim: PaletteKey
) => {
  mid.fillRect(x, top, width, CURB_Y - top, body)
  mid.polygon(
    [
      [x + 6, top + 1],
      [x + width / 2, top - 14],
      [x + width - 6, top + 1],
    ],
    body
  )
  mid.line(x + width / 2, top - 14, x + width - 6, top, trim)
  mid.fillRect(x, top, width, 2, trim)
  mid.fillRect(x + width / 2 - 3, top - 8, 6, 6, 'night')
  mid.pixel(x + width / 2, top - 6, rng.next() < 0.5 ? 'gold' : 'slate')
  for (let column = x + 8; column < x + width - 12; column += 18) {
    const lit = rng.next() < 0.3
    mid.fillRect(column, top + 8, 9, 14, 'slate')
    mid.fillRect(column + 1, top + 9, 7, 12, lit ? 'gold' : 'night')
    mid.line(column + 4, top + 9, column + 4, top + 20, 'slate')
    mid.line(column + 1, top + 14, column + 7, top + 14, 'slate')
    if (lit) ditherFill(mid, column + 1, top + 15, 7, 6, 'copper', 4)
    mid.fillRect(column - 1, top + 22, 11, 2, trim)
  }
  mid.fillRect(x, 70, width, 3, trim)
  mid.line(x, top, x, CURB_Y, 'night')
}

const shopWindow = (
  mid: PixelBuffer,
  x: number,
  y: number,
  width: number,
  height: number,
  lit: boolean
) => {
  mid.fillRect(x - 3, y - 3, width + 6, height + 6, 'wood')
  mid.fillRect(x - 3, y - 3, width + 6, 1, 'woodLight')
  mid.fillRect(x - 4, y + height + 2, width + 8, 3, 'woodLight')
  mid.fillRect(x, y, width, height, lit ? 'gold' : 'night')
  if (lit) {
    ditherFill(mid, x, y, width, height, 'copper', 3)
    ditherFill(mid, x, y + 1, width, 4, 'parchment', 3)
    ditherFill(mid, x, y + height - 8, width, 8, 'wood', 7)
  } else {
    for (let offset = 0; offset < width; offset += 14) {
      mid.line(x + offset, y + height - 1, x + offset + 10, y, 'slate')
    }
  }
  for (let column = x + 10; column < x + width; column += 11) {
    mid.line(column, y, column, y + height - 1, 'wood')
  }
  mid.line(x, y + 10, x + width - 1, y + 10, 'wood')
}

const signboard = (mid: PixelBuffer, x: number, width: number) => {
  mid.fillRect(x, 75, width, 7, 'wood')
  mid.fillRect(x, 75, width, 1, 'woodLight')
  mid.fillRect(x, 81, width, 1, 'night')
  mid.line(x + 3, 78, x + width - 4, 78, 'gold')
}

const door = (mid: PixelBuffer, x: number) => {
  const top = 90
  mid.fillRect(x - 3, top - 10, 28, CURB_Y - top + 10, 'slate')
  mid.circle(x + 11, top, 11, 'slate')
  mid.circle(x + 11, top, 9, 'gold')
  mid.circle(x + 11, top, 4, 'parchment')
  mid.fillRect(x, top, 22, 1, 'wood')
  for (let spoke = -8; spoke <= 8; spoke += 4)
    mid.line(x + 11, top, x + 11 + spoke, top - 7, 'wood')
  mid.fillRect(x, top + 1, 22, CURB_Y - top - 1, 'wood')
  for (let column = x + 5; column < x + 22; column += 6) {
    mid.line(column, top + 1, column, CURB_Y - 1, 'night')
    mid.line(column - 4, top + 1, column - 4, CURB_Y - 1, 'woodLight')
  }
  mid.fillRect(x + 3, top + 6, 16, 9, 'woodLight')
  mid.fillRect(x + 4, top + 7, 14, 7, 'wood')
  mid.fillRect(x + 3, top + 18, 16, 12, 'woodLight')
  mid.fillRect(x + 4, top + 19, 14, 10, 'wood')
  mid.circle(x + 17, top + 17, 1, 'copper')
  mid.pixel(x + 17, top + 16, 'gold')
  mid.fillRect(x + 9, top + 3, 4, 1, 'copper')
  mid.fillRect(x - 5, CURB_Y - 2, 32, 2, 'ash')
}

const paintMid = (rng: Rng): PixelBuffer => {
  const mid = createPixelBuffer(WIDTH, HEIGHT)
  facade(mid, rng, -4, 112, 34, 'ash', 'slate')
  facade(mid, rng, 108, 108, 24, 'stone', 'ash')
  facade(mid, rng, 216, 108, 46, 'ash', 'slate')
  signboard(mid, 10, 84)
  shopWindow(mid, 14, 90, 78, 28, true)
  signboard(mid, 116, 54)
  shopWindow(mid, 120, 92, 50, 26, false)
  door(mid, 188)
  signboard(mid, 232, 76)
  shopWindow(mid, 236, 90, 70, 28, true)
  for (let index = 0; index < 6; index += 1) {
    const bottleX = 244 + index * 11
    mid.fillRect(bottleX, 106, 4, 6, index % 2 === 0 ? 'blood' : 'wood')
    mid.fillRect(bottleX + 1, 103, 2, 3, 'wood')
  }
  return mid
}

const gasLamp = (near: PixelBuffer, x: number) => {
  near.polygon(
    [
      [x - 6, HEIGHT],
      [x - 3, 160],
      [x + 4, 160],
      [x + 7, HEIGHT],
    ],
    'night'
  )
  near.fillRect(x - 1, 54, 3, 108, 'night')
  near.fillRect(x - 3, 140, 7, 2, 'night')
  near.fillRect(x - 3, 100, 7, 2, 'night')
  near.fillRect(x - 7, 64, 15, 2, 'night')
  near.pixel(x - 7, 63, 'night')
  near.pixel(x + 7, 63, 'night')
  near.line(x + 1, 160, x + 1, 64, 'stone')
  near.polygon(
    [
      [x - 7, 54],
      [x - 5, 40],
      [x + 6, 40],
      [x + 8, 54],
    ],
    'night'
  )
  near.fillRect(x - 4, 42, 9, 11, 'gold')
  near.fillRect(x - 2, 44, 5, 7, 'parchment')
  near.line(x - 2, 42, x - 2, 52, 'night')
  near.line(x + 2, 42, x + 2, 52, 'night')
  near.polygon(
    [
      [x - 8, 41],
      [x + 0.5, 32],
      [x + 9, 41],
    ],
    'night'
  )
  near.fillRect(x - 1, 28, 3, 4, 'night')
}

const reflections = (near: PixelBuffer, rng: Rng, x: number) => {
  glow(near, x, 158, 34, 'copper', 4, 0.3)
  glow(near, x, 158, 16, 'ember', 4, 0.4)
  for (let column = x - 12; column <= x + 12; column += 2) {
    const length = rng.int(3, 12)
    const start = rng.int(140, 170)
    const ink = Math.abs(column - x) < 5 ? 'gold' : 'ember'
    for (let row = start; row < Math.min(HEIGHT, start + length); row += 2) {
      near.pixel(column, row, ink)
    }
  }
}

const paintNear = (rng: Rng): PixelBuffer => {
  const near = createPixelBuffer(WIDTH, HEIGHT)
  glow(near, LAMP_X, 47, 54, 'copper', 4)
  glow(near, LAMP_X, 47, 32, 'ember', 4)
  glow(near, LAMP_X, 47, 16, 'gold', 8)
  reflections(near, rng, LAMP_X)
  fogStrip(near, rng, 112, 14, 'slate', 6)
  fogStrip(near, rng, 128, 10, 'mist', 4)
  gasLamp(near, LAMP_X)
  return near
}

export const generateStreet = (rng: Rng): BackdropLayers => ({
  far: paintFar(rng),
  mid: paintMid(rng),
  near: paintNear(rng),
})
