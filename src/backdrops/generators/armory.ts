import { createPixelBuffer, type PixelBuffer } from '../painter'
import type { PaletteKey } from '../palette'
import type { Rng } from '../prng'
import { arch, candle, ditherFill, ditherPolygon, glow, HEIGHT, WIDTH } from './shared'
import type { BackdropLayers } from './types'

const FLOOR_Y = 152
const WINDOW_X = 274
const SCONCES = [184, 310] as const

const planks = (far: PixelBuffer, rng: Rng) => {
  let x = 0
  while (x < WIDTH) {
    const width = rng.int(9, 13)
    far.fillRect(x, 0, width, FLOOR_Y, 'wood')
    far.line(x, 0, x, FLOOR_Y, 'night')
    far.line(x + 1, 0, x + 1, FLOOR_Y, 'woodLight')
    for (let knot = 0; knot < 5; knot += 1) {
      const knotX = x + rng.int(3, width - 2)
      const knotY = rng.int(4, FLOOR_Y - 6)
      far.line(knotX, knotY, knotX, knotY + rng.int(2, 6), rng.next() < 0.6 ? 'stone' : 'woodLight')
    }
    x += width
  }
  for (let row = 0; row < 20; row += 1) {
    ditherFill(far, 0, row, WIDTH, 1, 'night', Math.round(10 - row * 0.5))
  }
}

const floor = (far: PixelBuffer) => {
  far.fillRect(0, FLOOR_Y - 6, WIDTH, 6, 'woodLight')
  far.fillRect(0, FLOOR_Y - 2, WIDTH, 2, 'night')
  let y = FLOOR_Y
  let height = 3
  while (y < HEIGHT) {
    far.fillRect(0, y, WIDTH, height, 'wood')
    far.line(0, y, WIDTH, y, 'woodLight')
    for (let x = (y * 7) % 37; x < WIDTH; x += 37) far.line(x, y, x, y + height - 1, 'night')
    y += height
    height += 1
  }
}

const windowPane = (far: PixelBuffer) => {
  arch(far, WINDOW_X, 50, 28, 22, 104, 'woodLight')
  arch(far, WINDOW_X, 50, 25, 19, 100, 'night')
  for (let row = 28; row < 100; row += 1) {
    for (let column = WINDOW_X - 25; column <= WINDOW_X + 25; column += 1) {
      if (far.get(column, row) !== 'night') continue
      const level = Math.round(2 + (100 - row) / 12)
      if ((column * 3 + row * 5) % 16 < level) far.pixel(column, row, 'moonGlow')
    }
  }
  far.circle(WINDOW_X + 10, 44, 7, 'moon')
  far.fillRect(WINDOW_X - 1, 28, 2, 72, 'wood')
  far.fillRect(WINDOW_X - 25, 64, 50, 2, 'wood')
  far.fillRect(WINDOW_X - 25, 82, 50, 2, 'wood')
  far.fillRect(WINDOW_X - 31, 100, 62, 4, 'woodLight')
  far.fillRect(WINDOW_X - 31, 104, 62, 1, 'night')
}

const paintFar = (rng: Rng): PixelBuffer => {
  const far = createPixelBuffer(WIDTH, HEIGHT)
  planks(far, rng)
  floor(far)
  windowPane(far)
  return far
}

const vial = (mid: PixelBuffer, x: number, shelfY: number, liquid: PaletteKey) => {
  mid.circle(x + 3, shelfY - 4, 3, liquid)
  mid.fillRect(x + 2, shelfY - 11, 3, 5, 'slate')
  mid.fillRect(x + 2, shelfY - 12, 3, 1, 'wood')
  mid.pixel(x + 2, shelfY - 5, 'moon')
  return 8
}

const crate = (mid: PixelBuffer, x: number, shelfY: number, rng: Rng) => {
  const width = rng.int(12, 18)
  const height = rng.int(8, 12)
  mid.fillRect(x, shelfY - height, width, height, 'woodLight')
  mid.fillRect(x + 1, shelfY - height + 1, width - 2, height - 2, 'wood')
  mid.line(x + 1, shelfY - height + 1, x + width - 2, shelfY - 2, 'woodLight')
  mid.fillRect(x + width / 2 - 1, shelfY - height - 1, 3, 1, 'gold')
  return width + 3
}

const books = (mid: PixelBuffer, x: number, shelfY: number, rng: Rng) => {
  const count = rng.int(3, 6)
  let offset = 0
  for (let index = 0; index < count; index += 1) {
    const width = rng.int(2, 4)
    const height = rng.int(12, 18)
    const ink = rng.pick<PaletteKey>(['blood', 'stone', 'slate', 'wood'])
    mid.fillRect(x + offset, shelfY - height, width, height, ink)
    mid.line(x + offset, shelfY - height + 2, x + offset + width - 1, shelfY - height + 2, 'gold')
    offset += width
  }
  return offset + 3
}

const shot = (mid: PixelBuffer, x: number, shelfY: number) => {
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 4 - row; column += 1) {
      mid.circle(x + 2 + column * 3 + row * 1.5, shelfY - 2 - row * 3, 1, 'slate')
      mid.pixel(x + 1 + column * 3 + row * 1.5, shelfY - 3 - row * 3, 'mist')
    }
  }
  return 16
}

const shelf = (mid: PixelBuffer, rng: Rng, y: number) => {
  let x = 18
  while (x < 166) {
    const kind = rng.int(0, 3)
    if (kind === 0) x += vial(mid, x, y, rng.pick<PaletteKey>(['blood', 'blood', 'moonGlow']))
    else if (kind === 1) x += crate(mid, x, y, rng)
    else if (kind === 2) x += books(mid, x, y, rng)
    else x += shot(mid, x, y)
  }
  mid.fillRect(10, y, 166, 2, 'woodLight')
  mid.fillRect(10, y + 2, 166, 3, 'wood')
  mid.fillRect(10, y + 5, 166, 1, 'night')
  for (const bracketX of [16, 166]) {
    mid.polygon(
      [
        [bracketX, y + 5],
        [bracketX + 6, y + 5],
        [bracketX, y + 13],
      ],
      'wood'
    )
  }
}

const blade = (mid: PixelBuffer, fromX: number, fromY: number, toX: number, toY: number) => {
  mid.line(fromX, fromY, toX, toY, 'slate')
  mid.line(fromX + 1, fromY, toX + 1, toY, 'mist')
  mid.line(fromX + 2, fromY, toX + 2, toY, 'slate')
  const direction = Math.sign(toX - fromX)
  mid.line(toX - 5, toY + direction * 5, toX + 5, toY - direction * 5, 'gold')
  mid.line(toX, toY, toX + direction * 5, toY + 6, 'wood')
  mid.line(toX + 1, toY, toX + 1 + direction * 5, toY + 6, 'wood')
  mid.circle(toX + direction * 6, toY + 7, 1, 'gold')
}

const weapons = (mid: PixelBuffer) => {
  mid.fillRect(196, 36, 42, 3, 'woodLight')
  mid.circle(217, 37, 3, 'gold')
  blade(mid, 196, 42, 230, 96)
  blade(mid, 236, 42, 202, 96)
  mid.fillRect(190, 116, 2, 4, 'wood')
  mid.fillRect(240, 116, 2, 4, 'wood')
  mid.fillRect(186, 114, 52, 2, 'slate')
  mid.line(186, 114, 237, 114, 'mist')
  mid.fillRect(236, 108, 2, 7, 'slate')
  mid.fillRect(236, 107, 8, 2, 'slate')
  mid.fillRect(243, 108, 2, 5, 'slate')
  mid.fillRect(184, 114, 2, 2, 'gold')
}

const sconce = (mid: PixelBuffer, x: number) => {
  mid.fillRect(x - 2, 60, 5, 9, 'gold')
  mid.fillRect(x - 1, 61, 3, 7, 'copper')
  mid.fillRect(x - 4, 68, 9, 2, 'gold')
  candle(mid, x, 68, 7)
}

const paintMid = (rng: Rng): PixelBuffer => {
  const mid = createPixelBuffer(WIDTH, HEIGHT)
  for (const y of [62, 98, 134]) shelf(mid, rng, y)
  weapons(mid)
  for (const x of SCONCES) sconce(mid, x)
  return mid
}

const table = (near: PixelBuffer) => {
  near.fillRect(0, 164, 132, 16, 'wood')
  near.fillRect(0, 162, 134, 2, 'woodLight')
  near.fillRect(0, 166, 132, 1, 'night')
  near.fillRect(14, 155, 30, 7, 'parchment')
  near.line(29, 155, 29, 161, 'mist')
  near.line(17, 157, 26, 157, 'mist')
  near.line(32, 157, 41, 157, 'mist')
  near.line(17, 159, 24, 159, 'mist')
  near.fillRect(100, 150, 6, 12, 'blood')
  near.fillRect(101, 147, 4, 3, 'slate')
  near.pixel(101, 152, 'ember')
}

const paintNear = (rng: Rng): PixelBuffer => {
  const near = createPixelBuffer(WIDTH, HEIGHT)
  const scratch = createPixelBuffer(WIDTH, HEIGHT)
  const beam = [
    [WINDOW_X - 24, 60],
    [WINDOW_X + 24, 60],
    [WINDOW_X - 30, HEIGHT],
    [WINDOW_X - 128, HEIGHT],
  ] as const
  ditherPolygon(near, beam, 'moonGlow', 1, scratch)
  ditherPolygon(
    near,
    [
      [WINDOW_X - 14, 70],
      [WINDOW_X + 10, 70],
      [WINDOW_X - 50, HEIGHT],
      [WINDOW_X - 100, HEIGHT],
    ],
    'moonGlow',
    2,
    scratch
  )
  for (let index = 0; index < 50; index += 1) {
    const y = rng.int(70, 175)
    const t = (y - 60) / (HEIGHT - 60)
    const x = rng.int(Math.round(WINDOW_X - 24 - t * 104), Math.round(WINDOW_X + 24 - t * 54))
    near.pixel(x, y, rng.next() < 0.3 ? 'moon' : 'mist')
  }
  for (const x of SCONCES) {
    glow(near, x, 58, 26, 'copper', 3)
    glow(near, x, 58, 14, 'ember', 4)
  }
  table(near)
  return near
}

export const generateArmory = (rng: Rng): BackdropLayers => ({
  far: paintFar(rng),
  mid: paintMid(rng),
  near: paintNear(rng),
})
