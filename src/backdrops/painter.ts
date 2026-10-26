import {
  backdropPalette,
  type PaletteKey,
  paletteIndex,
  paletteKeyAt,
  paletteKeys,
} from './palette'

export type Ink = PaletteKey | 'clear'
export type DitherPattern = 'checker' | 'bayer25' | 'bayer50' | 'bayer75'
export type Point = readonly [x: number, y: number]

export type PixelBuffer = {
  readonly width: number
  readonly height: number
  readonly data: Uint8Array
  get(x: number, y: number): PaletteKey | null
  pixel(x: number, y: number, ink: Ink): void
  fillRect(x: number, y: number, width: number, height: number, ink: Ink): void
  line(x0: number, y0: number, x1: number, y1: number, ink: Ink): void
  circle(cx: number, cy: number, radius: number, ink: Ink): void
  ditherRect(
    x: number,
    y: number,
    width: number,
    height: number,
    inkA: Ink,
    inkB: Ink,
    pattern: DitherPattern
  ): void
  polygon(points: readonly Point[], ink: Ink): void
  toRgba(): Uint8ClampedArray
}

const BAYER: readonly (readonly number[])[] = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

const wrap4 = (value: number): number => ((Math.round(value) % 4) + 4) % 4

export const bayerHit = (level: number, x: number, y: number): boolean =>
  (BAYER[wrap4(y)]?.[wrap4(x)] ?? 16) < level

const patternLevel: Record<Exclude<DitherPattern, 'checker'>, number> = {
  bayer25: 4,
  bayer50: 8,
  bayer75: 12,
}

export const patternHit = (pattern: DitherPattern, x: number, y: number): boolean =>
  pattern === 'checker'
    ? (((Math.round(x) + Math.round(y)) % 2) + 2) % 2 === 0
    : bayerHit(patternLevel[pattern], x, y)

const inkIndex = (ink: Ink): number => (ink === 'clear' ? 0 : paletteIndex(ink))

const hexToRgb = (hex: string): readonly [number, number, number] => {
  const value = Number.parseInt(hex.slice(1), 16)
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff]
}

const rgbByIndex: readonly (readonly [number, number, number])[] = paletteKeys.map((key) =>
  hexToRgb(backdropPalette[key])
)

export const createPixelBuffer = (width: number, height: number): PixelBuffer => {
  const data = new Uint8Array(width * height)

  const inBounds = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < width && y < height

  const get = (x: number, y: number): PaletteKey | null => {
    const column = Math.round(x)
    const row = Math.round(y)
    if (!inBounds(column, row)) return null
    return paletteKeyAt(data[row * width + column] ?? 0)
  }

  const pixel = (x: number, y: number, ink: Ink) => {
    const column = Math.round(x)
    const row = Math.round(y)
    if (!inBounds(column, row)) return
    data[row * width + column] = inkIndex(ink)
  }

  const span = (x0: number, x1: number, y: number, ink: Ink) => {
    const row = Math.round(y)
    if (row < 0 || row >= height) return
    const start = Math.max(0, Math.round(x0))
    const end = Math.min(width - 1, Math.round(x1))
    if (end < start) return
    data.fill(inkIndex(ink), row * width + start, row * width + end + 1)
  }

  const fillRect = (x: number, y: number, rectWidth: number, rectHeight: number, ink: Ink) => {
    const top = Math.round(y)
    const left = Math.round(x)
    for (let row = top; row < top + Math.round(rectHeight); row += 1) {
      span(left, left + Math.round(rectWidth) - 1, row, ink)
    }
  }

  const line = (x0: number, y0: number, x1: number, y1: number, ink: Ink) => {
    let x = Math.round(x0)
    let y = Math.round(y0)
    const endX = Math.round(x1)
    const endY = Math.round(y1)
    const deltaX = Math.abs(endX - x)
    const deltaY = -Math.abs(endY - y)
    const stepX = x < endX ? 1 : -1
    const stepY = y < endY ? 1 : -1
    let error = deltaX + deltaY
    for (;;) {
      pixel(x, y, ink)
      if (x === endX && y === endY) return
      const doubled = 2 * error
      if (doubled >= deltaY) {
        error += deltaY
        x += stepX
      }
      if (doubled <= deltaX) {
        error += deltaX
        y += stepY
      }
    }
  }

  const circle = (cx: number, cy: number, radius: number, ink: Ink) => {
    const centreX = Math.round(cx)
    const centreY = Math.round(cy)
    let x = Math.round(radius)
    let y = 0
    let error = 1 - x
    while (x >= y) {
      span(centreX - x, centreX + x, centreY + y, ink)
      span(centreX - x, centreX + x, centreY - y, ink)
      span(centreX - y, centreX + y, centreY + x, ink)
      span(centreX - y, centreX + y, centreY - x, ink)
      y += 1
      if (error < 0) {
        error += 2 * y + 1
      } else {
        x -= 1
        error += 2 * (y - x) + 1
      }
    }
  }

  const ditherRect = (
    x: number,
    y: number,
    rectWidth: number,
    rectHeight: number,
    inkA: Ink,
    inkB: Ink,
    pattern: DitherPattern
  ) => {
    const left = Math.round(x)
    const top = Math.round(y)
    for (let row = top; row < top + Math.round(rectHeight); row += 1) {
      for (let column = left; column < left + Math.round(rectWidth); column += 1) {
        pixel(column, row, patternHit(pattern, column, row) ? inkA : inkB)
      }
    }
  }

  const polygon = (points: readonly Point[], ink: Ink) => {
    if (points.length < 3) return
    const ys = points.map(([, pointY]) => pointY)
    const top = Math.max(0, Math.floor(Math.min(...ys)))
    const bottom = Math.min(height - 1, Math.ceil(Math.max(...ys)))
    for (let row = top; row <= bottom; row += 1) {
      const sampleY = row + 0.5
      const crossings: number[] = []
      points.forEach(([ax, ay], index) => {
        const [bx, by] = points[(index + 1) % points.length] ?? points[0] ?? [ax, ay]
        if (ay === by) return
        const low = Math.min(ay, by)
        const high = Math.max(ay, by)
        if (sampleY < low || sampleY >= high) return
        crossings.push(ax + ((sampleY - ay) * (bx - ax)) / (by - ay))
      })
      crossings.sort((left, right) => left - right)
      for (let index = 0; index + 1 < crossings.length; index += 2) {
        const from = Math.ceil((crossings[index] ?? 0) - 0.5)
        const to = Math.ceil((crossings[index + 1] ?? 0) - 0.5) - 1
        if (to >= from) span(from, to, row, ink)
      }
    }
  }

  const toRgba = (): Uint8ClampedArray => {
    const rgba = new Uint8ClampedArray(width * height * 4)
    data.forEach((index, offset) => {
      const rgb = rgbByIndex[index - 1]
      if (rgb === undefined) return
      rgba[offset * 4] = rgb[0]
      rgba[offset * 4 + 1] = rgb[1]
      rgba[offset * 4 + 2] = rgb[2]
      rgba[offset * 4 + 3] = 255
    })
    return rgba
  }

  return { width, height, data, get, pixel, fillRect, line, circle, ditherRect, polygon, toRgba }
}
