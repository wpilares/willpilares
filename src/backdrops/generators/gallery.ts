import { PANORAMA_WIDTH } from '../layout'
import { createPixelBuffer, type PixelBuffer } from '../painter'
import type { Rng } from '../prng'
import { candle, ditherFill, glow, HEIGHT, verticalGradient, WIDTH } from './shared'
import type { BackdropLayers } from './types'

export const GALLERY_WIDTH = PANORAMA_WIDTH
export const GALLERY_FRAME_CENTRES = [80, 280, 480, 680, 880] as const
const CANDELABRA_X = [180, 380, 580, 780] as const
const CORNICE_Y = 22
const DADO_Y = 118
const FLOOR_Y = 152

const paintFar = (): PixelBuffer => {
  const far = createPixelBuffer(WIDTH, HEIGHT)
  verticalGradient(far, 0, 0, WIDTH, HEIGHT, ['void', 'night', 'stone'])
  for (let x = -32; x < WIDTH + 64; x += 64) {
    for (let step = 0; step <= 32; step += 1) {
      const t = step / 32
      const y = Math.round(30 - Math.sin(t * Math.PI * 0.5) * 24)
      far.pixel(x + step, y, 'stone')
      far.pixel(x + 64 - step, y, 'stone')
      far.pixel(x + step, y + 1, 'ash')
      far.pixel(x + 64 - step, y + 1, 'ash')
    }
  }
  return far
}

const wallpaper = (mid: PixelBuffer) => {
  mid.fillRect(0, CORNICE_Y, GALLERY_WIDTH, DADO_Y - CORNICE_Y, 'stone')
  for (let y = CORNICE_Y + 8; y < DADO_Y; y += 1) {
    for (let x = 0; x < GALLERY_WIDTH; x += 1) {
      const sum = (x + y) % 16
      const difference = (((x - y) % 16) + 16) % 16
      if (sum === 0 || difference === 0) mid.pixel(x, y, 'ash')
      else if (sum === 8 && difference === 8) mid.pixel(x, y, 'slate')
    }
  }
  for (let row = 0; row < 14; row += 1) {
    ditherFill(mid, 0, CORNICE_Y + 6 + row, GALLERY_WIDTH, 1, 'night', 12 - row)
  }
}

const cornice = (mid: PixelBuffer) => {
  mid.fillRect(0, CORNICE_Y - 4, GALLERY_WIDTH, 4, 'stone')
  mid.fillRect(0, CORNICE_Y, GALLERY_WIDTH, 6, 'ash')
  mid.fillRect(0, CORNICE_Y, GALLERY_WIDTH, 1, 'slate')
  for (let x = 1; x < GALLERY_WIDTH; x += 4) mid.fillRect(x, CORNICE_Y + 3, 2, 2, 'stone')
  mid.fillRect(0, CORNICE_Y + 6, GALLERY_WIDTH, 1, 'night')
  mid.fillRect(0, CORNICE_Y + 12, GALLERY_WIDTH, 1, 'woodLight')
}

const wainscot = (mid: PixelBuffer) => {
  mid.fillRect(0, DADO_Y, GALLERY_WIDTH, FLOOR_Y - DADO_Y, 'wood')
  mid.fillRect(0, DADO_Y, GALLERY_WIDTH, 2, 'woodLight')
  mid.fillRect(0, DADO_Y + 2, GALLERY_WIDTH, 1, 'night')
  for (let x = 6; x < GALLERY_WIDTH; x += 48) {
    mid.fillRect(x, DADO_Y + 7, 40, 18, 'woodLight')
    mid.fillRect(x + 1, DADO_Y + 8, 38, 16, 'wood')
    mid.line(x + 2, DADO_Y + 23, x + 38, DADO_Y + 23, 'night')
    mid.line(x + 38, DADO_Y + 9, x + 38, DADO_Y + 23, 'night')
  }
  mid.fillRect(0, FLOOR_Y - 4, GALLERY_WIDTH, 4, 'night')
  mid.fillRect(0, FLOOR_Y - 4, GALLERY_WIDTH, 1, 'woodLight')
}

const floorboards = (mid: PixelBuffer, rng: Rng) => {
  let y = FLOOR_Y
  let height = 2
  while (y < HEIGHT) {
    mid.fillRect(0, y, GALLERY_WIDTH, height, height % 2 === 0 ? 'wood' : 'woodLight')
    mid.line(0, y, GALLERY_WIDTH, y, 'night')
    let x = rng.int(0, 40)
    while (x < GALLERY_WIDTH) {
      mid.line(x, y, x, y + height - 1, 'night')
      x += rng.int(40, 90)
    }
    y += height
    height += 1
  }
  for (let row = FLOOR_Y; row < HEIGHT; row += 1) {
    ditherFill(
      mid,
      0,
      row,
      GALLERY_WIDTH,
      1,
      'night',
      Math.max(0, Math.round(6 - (row - FLOOR_Y) / 3))
    )
  }
}

const frame = (mid: PixelBuffer, centreX: number) => {
  const left = centreX - 36
  const top = 42
  const width = 72
  const height = 64
  mid.fillRect(left - 1, top - 1, width + 2, height + 2, 'night')
  mid.fillRect(left, top, width, height, 'gold')
  mid.fillRect(left + 2, top + 2, width - 4, height - 4, 'copper')
  mid.fillRect(left + 3, top + 3, width - 6, height - 6, 'gold')
  mid.fillRect(left + 5, top + 5, width - 10, height - 10, 'night')
  mid.line(left, top, left + width - 1, top, 'parchment')
  mid.line(left, top, left, top + height - 1, 'parchment')
  for (let x = left + 6; x < left + width - 6; x += 4) mid.pixel(x, top + 1, 'copper')
  for (const [cornerX, cornerY] of [
    [left, top],
    [left + width - 1, top],
    [left, top + height - 1],
    [left + width - 1, top + height - 1],
  ] as const) {
    mid.circle(cornerX, cornerY, 4, 'gold')
    mid.circle(cornerX, cornerY, 2, 'copper')
    mid.pixel(cornerX, cornerY, 'parchment')
  }
  mid.polygon(
    [
      [centreX - 10, top + 1],
      [centreX, top - 9],
      [centreX + 10, top + 1],
    ],
    'gold'
  )
  mid.circle(centreX, top - 4, 2, 'copper')
  mid.fillRect(centreX - 7, top + height + 5, 14, 4, 'gold')
  mid.fillRect(centreX - 6, top + height + 6, 12, 2, 'copper')
}

const candelabra = (mid: PixelBuffer, x: number) => {
  mid.circle(x, 86, 4, 'gold')
  mid.circle(x, 86, 2, 'copper')
  mid.fillRect(x - 1, 76, 2, 14, 'gold')
  mid.line(x - 10, 78, x + 10, 78, 'gold')
  mid.line(x - 10, 78, x - 10, 74, 'gold')
  mid.line(x + 10, 78, x + 10, 74, 'gold')
  for (const holder of [x - 10, x, x + 10]) mid.fillRect(holder - 2, 73, 5, 1, 'gold')
  candle(mid, x - 10, 73, 6)
  candle(mid, x, 73, 9)
  candle(mid, x + 10, 73, 6)
}

const paintMid = (rng: Rng): PixelBuffer => {
  const mid = createPixelBuffer(GALLERY_WIDTH, HEIGHT)
  wallpaper(mid)
  cornice(mid)
  wainscot(mid)
  floorboards(mid, rng)
  for (const centre of GALLERY_FRAME_CENTRES) frame(mid, centre)
  for (const x of CANDELABRA_X) candelabra(mid, x)
  return mid
}

const stanchion = (near: PixelBuffer, x: number) => {
  near.fillRect(x - 1, 146, 3, 30, 'gold')
  near.line(x - 1, 146, x - 1, 175, 'parchment')
  near.line(x + 1, 146, x + 1, 175, 'copper')
  near.circle(x, 144, 3, 'gold')
  near.pixel(x - 1, 143, 'parchment')
  near.fillRect(x - 6, 175, 13, 3, 'gold')
  near.fillRect(x - 7, 177, 15, 3, 'copper')
}

const rope = (near: PixelBuffer, fromX: number, toX: number) => {
  for (let x = fromX; x <= toX; x += 1) {
    const t = (x - fromX) / (toX - fromX)
    const y = Math.round(149 + 10 * (1 - (2 * t - 1) ** 2))
    near.fillRect(x, y, 1, 3, 'blood')
    near.pixel(x, y, 'ember')
    near.pixel(x, y + 3, 'night')
  }
}

const paintNear = (rng: Rng): PixelBuffer => {
  const near = createPixelBuffer(GALLERY_WIDTH, HEIGHT)
  for (const x of CANDELABRA_X) {
    glow(near, x, 62, 42, 'copper', 4)
    glow(near, x, 62, 22, 'ember', 4)
  }
  for (let index = 0; index < 120; index += 1) {
    near.pixel(rng.int(0, GALLERY_WIDTH - 1), rng.int(30, 140), rng.next() < 0.5 ? 'mist' : 'slate')
  }
  const posts = [30, 130, 230, 330, 430, 530, 630, 730, 830, 930]
  posts.forEach((x, index) => {
    const next = posts[index + 1]
    if (next !== undefined) rope(near, x + 2, next - 2)
  })
  for (const x of posts) stanchion(near, x)
  return near
}

export const generateGallery = (rng: Rng): BackdropLayers => ({
  far: paintFar(),
  mid: paintMid(rng),
  near: paintNear(rng),
})
