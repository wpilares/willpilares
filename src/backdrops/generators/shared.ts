import { bayerHit, type Ink, type PixelBuffer, type Point } from '../painter'
import type { PaletteKey } from '../palette'
import type { Rng } from '../prng'

export const WIDTH = 320
export const HEIGHT = 180

export const verticalGradient = (
  buffer: PixelBuffer,
  x: number,
  y: number,
  width: number,
  height: number,
  stops: readonly PaletteKey[]
) => {
  const segments = stops.length - 1
  if (segments < 1) {
    const only = stops[0]
    if (only) buffer.fillRect(x, y, width, height, only)
    return
  }
  for (let row = 0; row < height; row += 1) {
    const position = (row / height) * segments
    const segment = Math.min(segments - 1, Math.floor(position))
    const local = position - segment
    const from = stops[segment] ?? 'void'
    const to = stops[segment + 1] ?? from
    const level = Math.round(Math.min(1, Math.max(0, (local - 0.25) / 0.7)) * 16)
    for (let column = x; column < x + width; column += 1) {
      buffer.pixel(column, y + row, bayerHit(level, column, y + row) ? to : from)
    }
  }
}

export const glow = (
  buffer: PixelBuffer,
  cx: number,
  cy: number,
  radius: number,
  ink: Ink,
  strength = 12,
  squash = 1
) => {
  for (let row = Math.floor(cy - radius * squash); row <= cy + radius * squash; row += 1) {
    for (let column = Math.floor(cx - radius); column <= cx + radius; column += 1) {
      const distance = Math.hypot(column - cx, (row - cy) / squash) / radius
      if (distance >= 1) continue
      const level = Math.round((1 - distance) ** 1.6 * strength)
      if (bayerHit(level, column, row)) buffer.pixel(column, row, ink)
    }
  }
}

export const ditherFill = (
  buffer: PixelBuffer,
  x: number,
  y: number,
  width: number,
  height: number,
  ink: Ink,
  level: number
) => {
  for (let row = y; row < y + height; row += 1) {
    for (let column = x; column < x + width; column += 1) {
      if (bayerHit(level, column, row)) buffer.pixel(column, row, ink)
    }
  }
}

export const ditherPolygon = (
  buffer: PixelBuffer,
  points: readonly Point[],
  ink: Ink,
  level: number,
  scratch: PixelBuffer
) => {
  scratch.data.fill(0)
  scratch.polygon(points, 'void')
  for (let row = 0; row < scratch.height; row += 1) {
    for (let column = 0; column < scratch.width; column += 1) {
      if (scratch.data[row * scratch.width + column] !== 0 && bayerHit(level, column, row)) {
        buffer.pixel(column, row, ink)
      }
    }
  }
}

export const stars = (
  buffer: PixelBuffer,
  rng: Rng,
  count: number,
  maxY: number,
  keys: readonly PaletteKey[]
) => {
  for (let index = 0; index < count; index += 1) {
    const x = rng.int(0, buffer.width - 1)
    const y = rng.int(0, maxY)
    buffer.pixel(x, y, rng.pick(keys))
  }
}

export const moon = (buffer: PixelBuffer, rng: Rng, cx: number, cy: number, radius: number) => {
  glow(buffer, cx, cy, radius * 1.9, 'stone', 16)
  glow(buffer, cx, cy, radius * 1.55, 'slate', 11)
  glow(buffer, cx, cy, radius * 1.3, 'moonGlow', 9)
  buffer.circle(cx, cy, radius, 'moonGlow')
  buffer.circle(cx + 1, cy - 1, radius - 2, 'moon')
  for (let row = cy - radius; row <= cy + radius; row += 1) {
    for (let column = cx - radius; column <= cx + radius; column += 1) {
      const distance = Math.hypot(column - (cx + radius * 0.35), row - (cy - radius * 0.2))
      if (distance > radius * 1.05 && Math.hypot(column - cx, row - cy) <= radius) {
        if (bayerHit(9, column, row)) buffer.pixel(column, row, 'moonGlow')
      }
    }
  }
  const craters = Math.max(4, Math.round(radius / 5))
  for (let index = 0; index < craters; index += 1) {
    const angle = rng.next() * Math.PI * 2
    const reach = rng.next() * radius * 0.65
    const size = rng.int(1, Math.max(2, Math.round(radius / 9)))
    const x = Math.round(cx + Math.cos(angle) * reach)
    const y = Math.round(cy + Math.sin(angle) * reach)
    buffer.circle(x, y, size, 'moonGlow')
    buffer.circle(x - 1, y - 1, Math.max(0, size - 1), 'mist')
  }
}

export const fogStrip = (
  buffer: PixelBuffer,
  rng: Rng,
  y: number,
  thickness: number,
  ink: PaletteKey,
  density = 6
) => {
  let x = rng.int(-40, 0)
  while (x < buffer.width) {
    const length = rng.int(60, 140)
    const lift = rng.int(-3, 3)
    const phase = rng.next() * 10
    for (let column = x; column < x + length; column += 1) {
      const along = (column - x) / length
      const taper = Math.sin(along * Math.PI) ** 0.6
      const top = Math.sin(column / 11 + phase) * 2 + Math.sin(column / 4.3 + phase) * 0.8
      const bottom = Math.sin(column / 17 - phase) * 1.5
      const span = thickness * taper
      for (let row = Math.floor(top); row < span + bottom; row += 1) {
        const across = (row - top) / Math.max(1, span + bottom - top)
        const profile = Math.sin(Math.min(1, Math.max(0, across)) * Math.PI)
        const level = Math.round(density * taper * profile)
        const py = y + lift + row
        if (bayerHit(level, column, py)) buffer.pixel(column, py, ink)
      }
    }
    x += length + rng.int(10, 36)
  }
}

export const flame = (buffer: PixelBuffer, x: number, baseY: number, size = 1) => {
  const height = 3 + size * 2
  for (let row = 0; row < height; row += 1) {
    const t = row / height
    const half = Math.round(Math.sin(t * Math.PI * 0.9 + 0.2) * (size + 0.4))
    buffer.line(x - half, baseY - row, x + half, baseY - row, 'ember')
  }
  for (let row = 0; row < height - 2; row += 1) {
    const half = row < height - 3 ? Math.max(0, size - 1) : 0
    buffer.line(x - half, baseY - row, x + half, baseY - row, 'gold')
  }
  buffer.pixel(x, baseY - 1, 'parchment')
  buffer.pixel(x, baseY - height, 'ember')
}

export const candle = (
  buffer: PixelBuffer,
  x: number,
  baseY: number,
  height: number,
  width = 3
) => {
  const left = x - Math.floor(width / 2)
  buffer.fillRect(left, baseY - height, width, height, 'parchment')
  buffer.line(left + width - 1, baseY - height + 1, left + width - 1, baseY - 1, 'mist')
  buffer.pixel(left, baseY - height + 2, 'moon')
  buffer.pixel(x, baseY - height - 1, 'night')
  flame(buffer, x, baseY - height - 2, width > 3 ? 2 : 1)
}

export const gableHouse = (
  buffer: PixelBuffer,
  x: number,
  topY: number,
  width: number,
  bottomY: number,
  roofHeight: number,
  body: PaletteKey,
  rim: PaletteKey
) => {
  const eaveY = topY + roofHeight
  buffer.fillRect(x, eaveY, width, bottomY - eaveY, body)
  buffer.polygon(
    [
      [x - 2, eaveY + 1],
      [x + width / 2, topY],
      [x + width + 2, eaveY + 1],
    ],
    body
  )
  buffer.line(x + width / 2, topY, x + width + 2, eaveY, rim)
  buffer.line(x + width - 1, eaveY + 1, x + width - 1, bottomY, rim)
}

export const spire = (
  buffer: PixelBuffer,
  x: number,
  baseY: number,
  width: number,
  height: number,
  ink: PaletteKey
) => {
  buffer.polygon(
    [
      [x, baseY],
      [x + width / 2, baseY - height],
      [x + width, baseY],
    ],
    ink
  )
}

export const bricks = (
  buffer: PixelBuffer,
  rng: Rng,
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    readonly brickWidth: number
    readonly brickHeight: number
    readonly mortar: PaletteKey
    readonly face: PaletteKey
    readonly accents: readonly PaletteKey[]
  }
) => {
  buffer.fillRect(x, y, width, height, options.mortar)
  for (let row = 0; row * options.brickHeight < height; row += 1) {
    const offset = row % 2 === 0 ? 0 : Math.floor(options.brickWidth / 2)
    const top = y + row * options.brickHeight
    for (let column = x - offset; column < x + width; column += options.brickWidth) {
      const ink = rng.next() < 0.18 ? rng.pick(options.accents) : options.face
      const left = Math.max(x, column)
      const right = Math.min(x + width, column + options.brickWidth - 1)
      const bottom = Math.min(y + height, top + options.brickHeight - 1)
      buffer.fillRect(left, top, right - left, bottom - top, ink)
    }
  }
}

export const arch = (
  buffer: PixelBuffer,
  cx: number,
  springY: number,
  halfWidth: number,
  rise: number,
  bottomY: number,
  ink: Ink
) => {
  for (let row = Math.floor(springY - rise); row < bottomY; row += 1) {
    if (row >= springY) {
      buffer.fillRect(cx - halfWidth, row, halfWidth * 2, 1, ink)
      continue
    }
    const t = (springY - row) / rise
    const half = halfWidth * (1 - t ** 1.6)
    if (half > 0) buffer.fillRect(Math.round(cx - half), row, Math.round(half * 2), 1, ink)
  }
}
