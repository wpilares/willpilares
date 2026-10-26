import { describe, expect, it } from 'vitest'
import {
  CANDLE_FLAME_FRAME_COUNT,
  CANDLE_FLAME_HEIGHT,
  CANDLE_FLAME_WICK_COLUMN,
  CANDLE_FLAME_WIDTH,
} from '../layout'
import type { PixelBuffer } from '../painter'
import { paletteKeys } from '../palette'
import { createRng } from '../prng'
import { flameBodyHeight, generateCandleFlameFrames } from './candleFlame'

const SEED = 0xf1a3e

const opaqueCount = (buffer: PixelBuffer): number =>
  buffer.data.reduce((total, value) => (value === 0 ? total : total + 1), 0)

const frames = generateCandleFlameFrames(createRng(SEED))

describe('candle flame frames', () => {
  it('produces eight frames on the flame buffer size', () => {
    expect(frames).toHaveLength(CANDLE_FLAME_FRAME_COUNT)
    expect(CANDLE_FLAME_FRAME_COUNT).toBe(8)
    for (const frame of frames) {
      expect(frame.width).toBe(CANDLE_FLAME_WIDTH)
      expect(frame.height).toBe(CANDLE_FLAME_HEIGHT)
    }
  })

  it('is identical for the same seed', () => {
    const again = generateCandleFlameFrames(createRng(SEED))
    frames.forEach((frame, index) => {
      expect(Array.from(again[index]?.data ?? [])).toEqual(Array.from(frame.data))
    })
  })

  it('changes between every frame, including the loop back to the first', () => {
    frames.forEach((frame, index) => {
      const next = frames[(index + 1) % frames.length]
      expect(Array.from(next?.data ?? [])).not.toEqual(Array.from(frame.data))
    })
  })

  it('paints only palette colours', () => {
    for (const frame of frames) {
      expect(frame.data.filter((value) => value > paletteKeys.length)).toHaveLength(0)
    }
  })

  it('paints at least twenty opaque pixels in every frame', () => {
    for (const frame of frames) expect(opaqueCount(frame)).toBeGreaterThanOrEqual(20)
  })

  it('rests the flame base on the wick column in every frame', () => {
    for (const frame of frames) {
      expect(frame.get(CANDLE_FLAME_WICK_COLUMN, CANDLE_FLAME_HEIGHT - 1)).not.toBeNull()
    }
  })

  it('breathes the flame body between nine and thirteen pixels tall', () => {
    const heights = frames.map(flameBodyHeight)
    for (const height of heights) {
      expect(height).toBeGreaterThanOrEqual(9)
      expect(height).toBeLessThanOrEqual(13)
    }
    expect(Math.min(...heights)).toBe(9)
    expect(Math.max(...heights)).toBe(13)
  })
})
