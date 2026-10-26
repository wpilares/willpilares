import { describe, expect, it } from 'vitest'
import { GESTURE_NAMES, type GestureName } from '../gestures'
import { assertSpriteSize, decodeFrame, type PixelMatrix, TRANSPARENT_KEY } from '../sprite'
import { createMascotGestures } from './gestures'
import { applyOutfit, OUTFIT_NAMES, outfits } from './outfits'
import { basePalette } from './palettes'

const OUTLINE_KEY = 'o'
const MIN_OPAQUE_PIXELS = 120

const expectedShape: Readonly<Record<GestureName, { frames: number; frameDuration: number }>> = {
  idle: { frames: 2, frameDuration: 600 },
  wave: { frames: 2, frameDuration: 300 },
  walk: { frames: 4, frameDuration: 140 },
  think: { frames: 1, frameDuration: 800 },
  thumbs: { frames: 1, frameDuration: 800 },
  cheer: { frames: 2, frameDuration: 250 },
  sulk: { frames: 1, frameDuration: 800 },
  sleep: { frames: 2, frameDuration: 700 },
}

const countOpaque = (matrix: PixelMatrix): number =>
  matrix.pixels.reduce(
    (total, row) => total + row.reduce((count, pixel) => count + (pixel === null ? 0 : 1), 0),
    0
  )

const gestures = createMascotGestures()
const frameCases = GESTURE_NAMES.flatMap((name) =>
  gestures[name].frames.map((frame, index) => ({ name, index, frame }))
)

describe('mascot frames', () => {
  it.each(frameCases)('$name frame $index has the sprite size and decodes', ({ frame }) => {
    expect(() => assertSpriteSize(frame)).not.toThrow()
    expect(() => decodeFrame(frame, basePalette)).not.toThrow()
  })

  it.each(frameCases)('$name frame $index is drawn and outlined', ({ frame }) => {
    expect(countOpaque(decodeFrame(frame, basePalette))).toBeGreaterThanOrEqual(MIN_OPAQUE_PIXELS)
    expect(frame.some((row) => row.includes(OUTLINE_KEY))).toBe(true)
  })

  it.each(GESTURE_NAMES)('%s has the expected frame count and duration', (name) => {
    expect(gestures[name].frames).toHaveLength(expectedShape[name].frames)
    expect(gestures[name].frameDuration).toBe(expectedShape[name].frameDuration)
    expect(gestures[name].loop).toBe(true)
  })

  it.each(GESTURE_NAMES)('%s has no duplicated frames', (name) => {
    const serialised = gestures[name].frames.map((frame) => frame.join('\n'))
    expect(new Set(serialised).size).toBe(serialised.length)
  })
})

describe('mascot outfits', () => {
  it.each(OUTFIT_NAMES)('%s overlay has the sprite size and only accessory pixels', (name) => {
    const overlay = outfits[name].overlay
    if (overlay === undefined) return
    expect(() => assertSpriteSize(overlay)).not.toThrow()
    expect(overlay.some((row) => Array.from(row).some((key) => key !== TRANSPARENT_KEY))).toBe(true)
  })

  it.each(OUTFIT_NAMES)('%s composes every frame and decodes with its palette', (name) => {
    const outfit = outfits[name]
    const dressed = applyOutfit(gestures, outfit)
    for (const gesture of GESTURE_NAMES) {
      expect(dressed[gesture].frames).toHaveLength(gestures[gesture].frames.length)
      for (const frame of dressed[gesture].frames) {
        expect(() => assertSpriteSize(frame)).not.toThrow()
        expect(() => decodeFrame(frame, outfit.palette)).not.toThrow()
      }
    }
  })

  it('returns the same gesture set when the outfit has no overlay', () => {
    expect(applyOutfit(gestures, outfits.default)).toBe(gestures)
  })
})
