import { belfryMoon } from '../layout'
import { bayerHit, createPixelBuffer, type PixelBuffer } from '../painter'
import type { Rng } from '../prng'
import { cathedral, skyline } from './city'
import { arch, fogStrip, HEIGHT, moon, stars, verticalGradient, WIDTH } from './shared'
import type { BackdropLayers } from './types'

const HORIZON_Y = 126
const OPENING = { centre: 160, springY: 70, halfWidth: 112, rise: 62, bottom: 138 } as const

const paintFar = (rng: Rng): PixelBuffer => {
  const far = createPixelBuffer(WIDTH, HEIGHT)
  verticalGradient(far, 0, 0, WIDTH, HORIZON_Y, ['void', 'night', 'stone', 'ash'])
  stars(far, rng, 60, 90, ['slate', 'mist', 'mist', 'moonGlow', 'parchment'])
  moon(far, rng, belfryMoon.x, belfryMoon.y, belfryMoon.radius)
  skyline(far, rng, {
    x: 0,
    width: WIDTH,
    baseY: HORIZON_Y,
    scale: 0.6,
    body: 'slate',
    rim: 'mist',
    lights: 'gold',
  })
  cathedral(far, rng, 96, HORIZON_Y + 2, 0.55, 'slate', 'mist', 'gold')
  far.fillRect(0, HORIZON_Y, WIDTH, HEIGHT - HORIZON_Y, 'ash')
  for (let index = 0; index < 70; index += 1) {
    const y = rng.int(HORIZON_Y + 2, HEIGHT - 1)
    far.pixel(rng.int(0, WIDTH - 1), y, rng.next() < 0.7 ? 'gold' : 'ember')
  }
  for (let y = HORIZON_Y + 4; y < HEIGHT; y += 6) far.line(0, y, WIDTH, y, 'slate')
  return far
}

const ashlar = (mid: PixelBuffer, rng: Rng) => {
  mid.fillRect(0, 0, WIDTH, HEIGHT, 'stone')
  for (let row = 0; row * 9 < HEIGHT; row += 1) {
    const y = row * 9
    mid.line(0, y, WIDTH, y, 'night')
    const offset = row % 2 === 0 ? 0 : 10
    for (let x = offset; x < WIDTH; x += 20) {
      mid.line(x, y, x, y + 8, 'night')
      if (rng.next() < 0.25) mid.fillRect(x + 1, y + 1, 19, 8, 'ash')
      mid.line(x + 1, y + 1, x + 18, y + 1, 'ash')
    }
  }
}

const moonlitEdge = (mid: PixelBuffer) => {
  const edges: [number, number][] = []
  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      if (mid.get(x, y) === null) continue
      const towardsLight = x < OPENING.centre ? 1 : -1
      if (mid.get(x + towardsLight, y) === null || mid.get(x, y + 1) === null) edges.push([x, y])
    }
  }
  for (const [x, y] of edges) {
    mid.pixel(x, y, 'mist')
    mid.pixel(x - (x < OPENING.centre ? 1 : -1), y, 'slate')
  }
}

const bell = (mid: PixelBuffer) => {
  mid.fillRect(40, 76, 240, 5, 'wood')
  mid.fillRect(40, 76, 240, 1, 'woodLight')
  mid.fillRect(40, 81, 240, 1, 'night')
  mid.fillRect(154, 70, 12, 6, 'wood')
  mid.fillRect(156, 82, 8, 4, 'copper')
  mid.polygon(
    [
      [150, 86],
      [170, 86],
      [174, 100],
      [182, 116],
      [138, 116],
      [146, 100],
    ],
    'gold'
  )
  for (let y = 86; y < 116; y += 1) {
    for (let x = 136; x < 184; x += 1) {
      if (mid.get(x, y) !== 'gold') continue
      if (x > 164 && bayerHit(Math.min(16, (x - 160) * 1.2), x, y)) mid.pixel(x, y, 'copper')
    }
  }
  mid.line(148, 88, 141, 114, 'parchment')
  mid.fillRect(134, 116, 52, 3, 'gold')
  mid.line(134, 118, 185, 118, 'copper')
  mid.fillRect(132, 119, 56, 1, 'night')
  mid.fillRect(158, 119, 4, 6, 'night')
  mid.circle(160, 126, 3, 'night')
  for (const x of [146, 152, 158, 164, 170]) mid.pixel(x, 108, 'copper')
  mid.line(184, 80, 196, 150, 'woodLight')
}

const parapet = (mid: PixelBuffer) => {
  mid.fillRect(0, OPENING.bottom - 4, WIDTH, 5, 'ash')
  mid.fillRect(0, OPENING.bottom - 4, WIDTH, 1, 'mist')
  mid.fillRect(0, OPENING.bottom + 1, WIDTH, 1, 'night')
}

const paintMid = (rng: Rng): PixelBuffer => {
  const mid = createPixelBuffer(WIDTH, HEIGHT)
  ashlar(mid, rng)
  arch(
    mid,
    OPENING.centre,
    OPENING.springY,
    OPENING.halfWidth,
    OPENING.rise,
    OPENING.bottom - 4,
    'clear'
  )
  moonlitEdge(mid)
  parapet(mid)
  bell(mid)
  return mid
}

const crow = (near: PixelBuffer, x: number, y: number, span: number, up: boolean) => {
  const tip = up ? -2 : 1
  near.line(x - span, y + tip, x, y, 'night')
  near.line(x, y, x + span, y + tip, 'night')
  near.fillRect(x - 1, y, 3, 2, 'night')
  near.pixel(x + 2, y - 1, 'night')
}

const paintNear = (rng: Rng): PixelBuffer => {
  const near = createPixelBuffer(WIDTH, HEIGHT)
  fogStrip(near, rng, HORIZON_Y - 6, 10, 'mist', 6)
  fogStrip(near, rng, HORIZON_Y + 4, 8, 'moonGlow', 3)
  for (let index = 0; index < 9; index += 1) {
    const angle = (index / 9) * Math.PI * 2 + rng.next() * 0.4
    const x = Math.round(160 + Math.cos(angle) * rng.int(40, 92))
    const y = Math.round(40 + Math.sin(angle) * rng.int(14, 28))
    crow(near, x, y, rng.int(3, 5), rng.next() < 0.5)
  }
  return near
}

export const generateBelfry = (rng: Rng): BackdropLayers => ({
  far: paintFar(rng),
  mid: paintMid(rng),
  near: paintNear(rng),
})
