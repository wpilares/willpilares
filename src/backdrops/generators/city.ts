import { createPixelBuffer, type PixelBuffer } from '../painter'
import type { PaletteKey } from '../palette'
import type { Rng } from '../prng'
import { fogStrip, gableHouse, HEIGHT, moon, spire, stars, verticalGradient, WIDTH } from './shared'
import type { BackdropLayers } from './types'

export type SkylineOptions = {
  readonly x: number
  readonly width: number
  readonly baseY: number
  readonly scale: number
  readonly body: PaletteKey
  readonly rim: PaletteKey
  readonly lights: PaletteKey
}

const towerWindows = (
  buffer: PixelBuffer,
  rng: Rng,
  x: number,
  top: number,
  width: number,
  bottom: number,
  lights: PaletteKey
) => {
  for (let row = top + 3; row < bottom - 2; row += 5) {
    for (let column = x + 1; column < x + width - 1; column += 3) {
      if (rng.next() < 0.14) buffer.pixel(column, row, lights)
    }
  }
}

export const cathedral = (
  buffer: PixelBuffer,
  rng: Rng,
  originX: number,
  baseY: number,
  scale: number,
  body: PaletteKey,
  rim: PaletteKey,
  lights: PaletteKey
) => {
  const s = (value: number) => Math.round(value * scale)
  const left = originX
  buffer.fillRect(left, baseY - s(36), s(74), s(36), body)
  buffer.polygon(
    [
      [left + s(14), baseY - s(36)],
      [left + s(37), baseY - s(50)],
      [left + s(60), baseY - s(36)],
    ],
    body
  )
  const towers = [left + s(2), left + s(58)]
  for (const towerX of towers) {
    buffer.fillRect(towerX, baseY - s(70), s(14), s(70), body)
    spire(buffer, towerX - s(1), baseY - s(70), s(16), s(34), body)
    spire(buffer, towerX - s(3), baseY - s(66), s(4), s(10), body)
    spire(buffer, towerX + s(13), baseY - s(66), s(4), s(10), body)
    buffer.line(towerX + s(14) - 1, baseY - s(70), towerX + s(14) - 1, baseY - 1, rim)
    buffer.line(towerX + s(7), baseY - s(104), towerX + s(15), baseY - s(70), rim)
    for (let row = baseY - s(62); row < baseY - s(10); row += s(12)) {
      buffer.fillRect(towerX + s(6), row, Math.max(1, s(2)), Math.max(2, s(5)), lights)
    }
  }
  const crossing = left + s(33)
  buffer.fillRect(crossing, baseY - s(56), s(8), s(20), body)
  spire(buffer, crossing - s(1), baseY - s(56), s(10), s(40), body)
  buffer.line(crossing + s(4), baseY - s(96), crossing + s(9), baseY - s(56), rim)
  const roseX = left + s(37)
  const roseY = baseY - s(26)
  buffer.circle(roseX, roseY, s(6), rim)
  buffer.circle(roseX, roseY, s(5), lights)
  if (scale >= 1) {
    buffer.line(roseX - s(5), roseY, roseX + s(5), roseY, body)
    buffer.line(roseX, roseY - s(5), roseX, roseY + s(5), body)
    buffer.pixel(roseX, roseY, 'parchment')
  }
  for (let column = left + s(20); column < left + s(56); column += s(6)) {
    if (Math.abs(column - roseX) < s(8)) continue
    if (rng.next() < 0.7) buffer.fillRect(column, baseY - s(14), Math.max(1, s(2)), s(6), lights)
  }
}

export const skyline = (buffer: PixelBuffer, rng: Rng, options: SkylineOptions) => {
  const { x, width, baseY, scale, body, rim, lights } = options
  const s = (value: number) => Math.max(1, Math.round(value * scale))
  let column = x - s(6)
  while (column < x + width) {
    const towerWidth = s(rng.int(5, 11))
    const towerHeight = s(rng.int(8, 30))
    const top = baseY - towerHeight
    buffer.fillRect(column, top, towerWidth, towerHeight + s(40), body)
    const roof = rng.int(0, 3)
    if (roof < 2) spire(buffer, column - 1, top, towerWidth + 2, s(rng.int(8, 22)), body)
    else if (roof === 2) {
      buffer.polygon(
        [
          [column - 1, top + 1],
          [column + towerWidth / 2, top - s(5)],
          [column + towerWidth + 1, top + 1],
        ],
        body
      )
    }
    buffer.line(column + towerWidth - 1, top, column + towerWidth - 1, baseY + s(40), rim)
    towerWindows(buffer, rng, column, top, towerWidth, baseY, lights)
    column += towerWidth + s(rng.int(1, 9))
  }
}

const paintFar = (rng: Rng): PixelBuffer => {
  const far = createPixelBuffer(WIDTH, HEIGHT)
  verticalGradient(far, 0, 0, WIDTH, 150, ['void', 'night', 'stone', 'ash'])
  far.fillRect(0, 150, WIDTH, HEIGHT - 150, 'ash')
  stars(far, rng, 46, 96, ['slate', 'slate', 'mist', 'mist', 'moonGlow', 'parchment'])
  moon(far, rng, 248, 50, 34)
  skyline(far, rng, {
    x: 0,
    width: WIDTH,
    baseY: 136,
    scale: 1,
    body: 'stone',
    rim: 'ash',
    lights: 'gold',
  })
  cathedral(far, rng, 66, 140, 1, 'stone', 'ash', 'gold')
  far.fillRect(0, 138, WIDTH, HEIGHT - 138, 'stone')
  return far
}

const paintWindows = (buffer: PixelBuffer, rng: Rng, x: number, top: number, width: number) => {
  for (let row = top + 5; row < HEIGHT - 4; row += 11) {
    for (let column = x + 4; column < x + width - 5; column += 9) {
      const roll = rng.next()
      if (roll < 0.16) {
        buffer.fillRect(column, row, 3, 5, 'gold')
        buffer.pixel(column + 1, row + 2, 'parchment')
        buffer.line(column, row + 5, column + 2, row + 5, 'slate')
      } else if (roll < 0.62) {
        buffer.fillRect(column, row, 3, 5, 'night')
        buffer.line(column, row + 5, column + 2, row + 5, 'slate')
      }
    }
  }
}

const bellTower = (mid: PixelBuffer, x: number) => {
  mid.fillRect(x, 54, 20, HEIGHT - 54, 'ash')
  mid.fillRect(x - 2, 52, 24, 3, 'slate')
  spire(mid, x - 1, 52, 22, 30, 'ash')
  mid.line(x + 10, 22, x + 21, 52, 'slate')
  mid.fillRect(x + 10, 15, 1, 8, 'slate')
  mid.fillRect(x + 8, 17, 5, 1, 'slate')
  mid.fillRect(x + 5, 60, 10, 14, 'night')
  mid.polygon(
    [
      [x + 5, 61],
      [x + 10, 56],
      [x + 15, 61],
    ],
    'night'
  )
  mid.fillRect(x + 9, 63, 2, 6, 'gold')
  mid.circle(x + 10, 85, 4, 'moonGlow')
  mid.circle(x + 10, 85, 3, 'moon')
  mid.line(x + 10, 85, x + 10, 83, 'night')
  mid.line(x + 10, 85, x + 12, 85, 'night')
  mid.line(x + 19, 54, x + 19, HEIGHT, 'slate')
  mid.fillRect(x - 2, 76, 24, 2, 'slate')
}

const paintMid = (rng: Rng): PixelBuffer => {
  const mid = createPixelBuffer(WIDTH, HEIGHT)
  bellTower(mid, 194)
  let x = -8
  let toggle = false
  while (x < WIDTH) {
    const width = rng.int(28, 46)
    const top = rng.int(98, 122)
    const roof = rng.int(9, 17)
    const body: PaletteKey = toggle ? 'stone' : 'ash'
    const rim: PaletteKey = toggle ? 'ash' : 'slate'
    if (rng.next() < 0.6) {
      const chimneyX = x + rng.int(4, width - 10)
      const chimneyTop = top + Math.round(roof / 2) - rng.int(8, 14)
      mid.fillRect(chimneyX, chimneyTop, 5, top + roof - chimneyTop, body)
      mid.fillRect(chimneyX - 1, chimneyTop, 7, 2, rim)
      mid.fillRect(chimneyX + 1, chimneyTop - 3, 2, 3, body)
      mid.line(chimneyX + 4, chimneyTop + 2, chimneyX + 4, top + roof, rim)
    }
    gableHouse(mid, x, top, width, HEIGHT, roof, body, rim)
    mid.fillRect(x - 2, top + roof, width + 4, 1, rim)
    paintWindows(mid, rng, x, top + roof, width)
    x += width + rng.int(-2, 3)
    toggle = !toggle
  }
  return mid
}

const railing = (near: PixelBuffer) => {
  near.fillRect(0, 146, WIDTH, 3, 'night')
  near.line(0, 146, WIDTH, 146, 'stone')
  near.fillRect(0, 160, WIDTH, 2, 'night')
  for (let x = 2; x < WIDTH; x += 6) {
    near.line(x, 143, x, 166, 'night')
    const tall = x % 24 === 2
    near.polygon(
      [
        [x - (tall ? 2 : 1), 143],
        [x + 0.5, tall ? 137 : 140],
        [x + (tall ? 3 : 2), 143],
      ],
      'night'
    )
    if (tall) near.circle(x, 145, 1, 'night')
    near.pixel(x + 3, 153, 'night')
    near.pixel(x + 2, 152, 'night')
    near.pixel(x + 4, 152, 'night')
    near.pixel(x + 2, 154, 'night')
    near.pixel(x + 4, 154, 'night')
    near.pixel(x + 3, 151, 'night')
    near.pixel(x + 3, 155, 'night')
  }
}

const ledge = (near: PixelBuffer) => {
  near.fillRect(0, 164, WIDTH, HEIGHT - 164, 'night')
  near.fillRect(0, 164, WIDTH, 1, 'slate')
  near.fillRect(0, 165, WIDTH, 2, 'ash')
  near.fillRect(0, 167, WIDTH, 1, 'stone')
  for (let x = 14; x < WIDTH; x += 32) near.line(x, 168, x, HEIGHT, 'void')
  near.fillRect(0, 176, WIDTH, HEIGHT - 176, 'void')
}

const paintNear = (rng: Rng): PixelBuffer => {
  const near = createPixelBuffer(WIDTH, HEIGHT)
  fogStrip(near, rng, 100, 9, 'mist', 5)
  fogStrip(near, rng, 122, 12, 'mist', 7)
  fogStrip(near, rng, 140, 8, 'slate', 8)
  railing(near)
  ledge(near)
  return near
}

export const generateCity = (rng: Rng): BackdropLayers => ({
  far: paintFar(rng),
  mid: paintMid(rng),
  near: paintNear(rng),
})
