import {
  CANDLE_FLAME_FRAME_COUNT,
  CANDLE_FLAME_HEIGHT,
  CANDLE_FLAME_WICK_COLUMN,
  CANDLE_FLAME_WIDTH,
} from '../layout'
import { createPixelBuffer, type PixelBuffer } from '../painter'
import type { PaletteKey } from '../palette'
import type { Rng } from '../prng'

type FlamePose = {
  readonly height: number
  readonly sway: number
  readonly tipLean: number
  readonly coreShift: number
  readonly coreReach: number
  readonly spark: number
}

type RowSpan = { readonly left: number; readonly right: number }

const poses: readonly FlamePose[] = [
  { height: 11, sway: 0, tipLean: 0, coreShift: 0, coreReach: 0.5, spark: 0 },
  { height: 12, sway: 1, tipLean: 0, coreShift: 0, coreReach: 0.55, spark: 0 },
  { height: 13, sway: 1, tipLean: 1, coreShift: 1, coreReach: 0.6, spark: 0 },
  { height: 12, sway: 1, tipLean: 1, coreShift: 0, coreReach: 0.5, spark: 2 },
  { height: 10, sway: 0, tipLean: -1, coreShift: 0, coreReach: 0.45, spark: 5 },
  { height: 9, sway: -1, tipLean: -1, coreShift: -1, coreReach: 0.45, spark: 0 },
  { height: 10, sway: -1, tipLean: 0, coreShift: 0, coreReach: 0.5, spark: 0 },
  { height: 11, sway: 0, tipLean: -1, coreShift: 0, coreReach: 0.55, spark: 0 },
]

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value))

const centreAt = (pose: FlamePose, t: number): number =>
  CANDLE_FLAME_WICK_COLUMN + pose.sway * clamp01((t - 0.15) / 0.55) + pose.tipLean * t ** 3

const baseHalfWidths: readonly number[] = [1, 2, 2]

const halfWidthAt = (row: number, last: number): number =>
  baseHalfWidths[row] ?? 2.5 * (1 - (row - 2) / (last - 2)) ** 0.9

const bodySpans = (pose: FlamePose): RowSpan[] => {
  const last = pose.height - 1
  return Array.from({ length: pose.height }, (_, row) => {
    const centre = centreAt(pose, row / last)
    const half = halfWidthAt(row, last)
    const left = Math.round(centre - half)
    return { left, right: Math.max(left, Math.round(centre + half)) }
  })
}

const rimInk = (t: number, rng: Rng): PaletteKey => {
  if (t < 0.25) return 'copper'
  return t < 0.75 && rng.next() < 0.3 ? 'copper' : 'ember'
}

const paintBody = (frame: PixelBuffer, spans: readonly RowSpan[], base: number, rng: Rng) => {
  const last = spans.length - 1
  spans.forEach(({ left, right }, row) => {
    const y = base - row
    if (row >= last - 1) {
      frame.line(left, y, right, y, 'ember')
      return
    }
    frame.line(left, y, right, y, 'gold')
    frame.pixel(left, y, rimInk(row / last, rng))
    frame.pixel(right, y, rimInk(row / last, rng))
  })
}

const paintCore = (
  frame: PixelBuffer,
  pose: FlamePose,
  spans: readonly RowSpan[],
  base: number
) => {
  const last = spans.length - 1
  const coreTop = Math.max(2, Math.round(last * pose.coreReach))
  for (let row = 1; row <= coreTop; row += 1) {
    const span = spans[row]
    if (span === undefined) continue
    const centre = Math.round(centreAt(pose, row / last) + pose.coreShift * clamp01(row / coreTop))
    const half = row >= coreTop - 1 || row === 1 ? 0 : 1
    const from = Math.max(span.left + 1, centre - half)
    const to = Math.min(span.right - 1, centre + half)
    if (to >= from) frame.line(from, base - row, to, base - row, 'parchment')
  }
}

const paintPose = (pose: FlamePose, rng: Rng): PixelBuffer => {
  const frame = createPixelBuffer(CANDLE_FLAME_WIDTH, CANDLE_FLAME_HEIGHT)
  const base = CANDLE_FLAME_HEIGHT - 1
  const spans = bodySpans(pose)
  paintBody(frame, spans, base, rng)
  paintCore(frame, pose, spans, base)
  frame.pixel(CANDLE_FLAME_WICK_COLUMN, base, 'night')
  if (pose.spark > 0) {
    const tipX = Math.round(centreAt(pose, 1))
    frame.pixel(tipX + pose.tipLean, base - pose.height + 1 - pose.spark, 'gold')
  }
  return frame
}

export const generateCandleFlameFrames = (rng: Rng): PixelBuffer[] =>
  poses.slice(0, CANDLE_FLAME_FRAME_COUNT).map((pose) => paintPose(pose, rng))

const rowIsLit = (buffer: PixelBuffer, row: number): boolean =>
  buffer.data.subarray(row * buffer.width, (row + 1) * buffer.width).some((value) => value !== 0)

export const flameBodyHeight = (buffer: PixelBuffer): number => {
  let height = 0
  while (height < buffer.height && rowIsLit(buffer, buffer.height - 1 - height)) height += 1
  return height
}
