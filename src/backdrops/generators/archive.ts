import { createPixelBuffer, type PixelBuffer } from '../painter'
import type { PaletteKey } from '../palette'
import type { Rng } from '../prng'
import { arch, candle, ditherPolygon, glow, HEIGHT, verticalGradient, WIDTH } from './shared'
import type { BackdropLayers } from './types'

const FLOOR_Y = 152
const CANDLE = { x: 176, y: 124 } as const
const SPINES: readonly PaletteKey[] = [
  'blood',
  'wood',
  'slate',
  'woodLight',
  'stone',
  'blood',
  'copper',
]

const paintFar = (): PixelBuffer => {
  const far = createPixelBuffer(WIDTH, HEIGHT)
  verticalGradient(far, 0, 0, WIDTH, FLOOR_Y, ['void', 'night', 'stone'])
  arch(far, 160, 46, 34, 30, 118, 'slate')
  arch(far, 160, 46, 30, 26, 114, 'night')
  for (let row = 16; row < 114; row += 1) {
    for (let column = 130; column <= 190; column += 1) {
      if (far.get(column, row) !== 'night') continue
      if ((column * 5 + row * 3) % 16 < 3 + Math.round((114 - row) / 30)) {
        far.pixel(column, row, 'moonGlow')
      }
    }
  }
  far.fillRect(159, 16, 2, 98, 'slate')
  for (const y of [48, 70, 92]) far.fillRect(130, y, 60, 1, 'slate')
  far.fillRect(124, 114, 72, 4, 'ash')
  far.fillRect(0, FLOOR_Y, WIDTH, HEIGHT - FLOOR_Y, 'night')
  for (let y = FLOOR_Y + 3; y < HEIGHT; y += 5) far.line(0, y, WIDTH, y, 'stone')
  return far
}

const shelfRow = (mid: PixelBuffer, rng: Rng, left: number, right: number, baseY: number) => {
  let x = left
  while (x < right - 1) {
    if (rng.next() < 0.06) {
      const width = Math.min(right - x, rng.int(4, 8))
      mid.fillRect(x, baseY - 12, width, 12, 'night')
      x += width
      continue
    }
    const width = Math.min(right - x, rng.int(2, 5))
    const height = rng.int(15, 21)
    const ink = rng.pick(SPINES)
    mid.fillRect(x, baseY - 22, width, 22, 'night')
    mid.fillRect(x, baseY - height, width, height, ink)
    if (width > 2) mid.line(x + width - 1, baseY - height, x + width - 1, baseY - 1, 'night')
    if (rng.next() < 0.6) {
      mid.line(x, baseY - height + 2, x + width - 2, baseY - height + 2, 'gold')
      mid.line(x, baseY - 4, x + width - 2, baseY - 4, 'gold')
    }
    if (rng.next() < 0.25) mid.pixel(x, baseY - Math.round(height / 2), 'gold')
    x += width
  }
}

const bookcase = (mid: PixelBuffer, rng: Rng, left: number, right: number) => {
  mid.fillRect(left, 0, right - left, FLOOR_Y + 2, 'wood')
  mid.fillRect(left, 0, right - left, 6, 'woodLight')
  mid.fillRect(left, 6, right - left, 1, 'night')
  for (let baseY = 32; baseY < FLOOR_Y; baseY += 28) {
    shelfRow(mid, rng, left + 4, right - 4, baseY)
    mid.fillRect(left + 2, baseY, right - left - 4, 3, 'woodLight')
    mid.fillRect(left + 2, baseY + 3, right - left - 4, 1, 'night')
  }
  mid.line(left + 1, 0, left + 1, FLOOR_Y, 'woodLight')
  mid.line(right - 2, 0, right - 2, FLOOR_Y, 'night')
}

const ladder = (mid: PixelBuffer) => {
  const rails = [
    [212, 2, 236, 158],
    [226, 2, 250, 158],
  ] as const
  for (const [fromX, fromY, toX, toY] of rails) {
    mid.line(fromX, fromY, toX, toY, 'woodLight')
    mid.line(fromX + 1, fromY, toX + 1, toY, 'wood')
  }
  for (let y = 12; y < 156; y += 11) {
    const shift = Math.round(((y - 2) / 156) * 24)
    mid.line(212 + shift, y, 226 + shift, y, 'woodLight')
  }
  mid.fillRect(206, 0, 28, 3, 'copper')
  mid.line(206, 0, 233, 0, 'gold')
  mid.circle(237, 160, 3, 'copper')
  mid.circle(251, 160, 3, 'copper')
}

const desk = (mid: PixelBuffer) => {
  mid.fillRect(128, CANDLE.y, 70, 3, 'woodLight')
  mid.fillRect(128, CANDLE.y + 3, 70, 7, 'wood')
  mid.fillRect(132, CANDLE.y + 10, 4, FLOOR_Y - CANDLE.y - 6, 'wood')
  mid.fillRect(190, CANDLE.y + 10, 4, FLOOR_Y - CANDLE.y - 6, 'wood')
  mid.fillRect(136, CANDLE.y - 4, 26, 4, 'parchment')
  mid.line(149, CANDLE.y - 4, 149, CANDLE.y - 1, 'mist')
  mid.line(138, CANDLE.y - 3, 146, CANDLE.y - 3, 'mist')
  mid.line(152, CANDLE.y - 3, 160, CANDLE.y - 3, 'mist')
  mid.fillRect(134, CANDLE.y - 1, 30, 1, 'blood')
  mid.fillRect(184, CANDLE.y - 5, 12, 5, 'blood')
  mid.fillRect(185, CANDLE.y - 9, 10, 4, 'slate')
  mid.line(184, CANDLE.y - 3, 195, CANDLE.y - 3, 'gold')
  mid.fillRect(CANDLE.x - 4, CANDLE.y - 1, 9, 1, 'gold')
  candle(mid, CANDLE.x, CANDLE.y - 1, 10, 4)
}

const paintMid = (rng: Rng): PixelBuffer => {
  const mid = createPixelBuffer(WIDTH, HEIGHT)
  bookcase(mid, rng, 0, 116)
  bookcase(mid, rng, 204, WIDTH)
  ladder(mid)
  desk(mid)
  return mid
}

const paintNear = (rng: Rng): PixelBuffer => {
  const near = createPixelBuffer(WIDTH, HEIGHT)
  const scratch = createPixelBuffer(WIDTH, HEIGHT)
  ditherPolygon(
    near,
    [
      [132, 40],
      [188, 40],
      [214, FLOOR_Y + 20],
      [118, FLOOR_Y + 20],
    ],
    'moonGlow',
    2,
    scratch
  )
  glow(near, CANDLE.x, CANDLE.y - 14, 30, 'copper', 3)
  glow(near, CANDLE.x, CANDLE.y - 14, 14, 'ember', 4)
  for (let index = 0; index < 90; index += 1) {
    const x = rng.int(110, 220)
    const y = rng.int(30, 150)
    near.pixel(x, y, rng.next() < 0.3 ? 'parchment' : 'mist')
  }
  for (let index = 0; index < 5; index += 1) {
    const height = rng.int(4, 6)
    const width = rng.int(34, 46)
    const y = HEIGHT - (index + 1) * 5
    const x = 4 + rng.int(-3, 3)
    near.fillRect(x, y, width, height, rng.pick<PaletteKey>(['blood', 'stone', 'wood', 'slate']))
    near.fillRect(x + width - 3, y + 1, 2, height - 2, 'parchment')
    near.line(x, y + height - 1, x + width - 1, y + height - 1, 'night')
    near.pixel(x + 3, y + 2, 'gold')
  }
  return near
}

export const generateArchive = (rng: Rng): BackdropLayers => ({
  far: paintFar(),
  mid: paintMid(rng),
  near: paintNear(rng),
})
