import { describe, expect, it } from 'vitest'
import { GESTURE_NAMES, type GestureName } from '../gestures'
import {
  assertSpriteSize,
  decodeFrame,
  type PixelMatrix,
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  TRANSPARENT_KEY,
} from '../sprite'
import { createMascotGestures } from './gestures'
import { applyOutfit, DEFAULT_OUTFIT, OUTFIT_NAMES, outfits } from './outfits'
import { basePalette } from './palettes'

const OUTLINE_KEY = 'o'
const MIN_OPAQUE_PIXELS = 180

const expectedShape: Readonly<Record<GestureName, { frames: number; frameDuration: number }>> = {
  idle: { frames: 2, frameDuration: 650 },
  walk: { frames: 4, frameDuration: 130 },
  sit: { frames: 2, frameDuration: 900 },
  lick: { frames: 3, frameDuration: 220 },
  stretch: { frames: 3, frameDuration: 300 },
  cheer: { frames: 2, frameDuration: 240 },
  sulk: { frames: 1, frameDuration: 800 },
  sleep: { frames: 2, frameDuration: 800 },
  wave: { frames: 2, frameDuration: 280 },
  purr: { frames: 2, frameDuration: 400 },
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

describe('cat frames', () => {
  it('uses a 32x32 grid', () => {
    expect(SPRITE_WIDTH).toBe(32)
    expect(SPRITE_HEIGHT).toBe(32)
  })

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

describe('cat outfits', () => {
  it('offers hunter, inventor and scholar with hunter as default', () => {
    expect([...OUTFIT_NAMES]).toEqual(['hunter', 'inventor', 'scholar'])
    expect(DEFAULT_OUTFIT).toBe('hunter')
  })

  it.each(OUTFIT_NAMES)('%s has one drawn overlay per frame of every gesture', (name) => {
    const { overlays } = outfits[name]
    for (const gesture of GESTURE_NAMES) {
      expect(overlays[gesture]).toHaveLength(gestures[gesture].frames.length)
      for (const overlay of overlays[gesture]) {
        expect(() => assertSpriteSize(overlay)).not.toThrow()
        expect(overlay.some((row) => Array.from(row).some((key) => key !== TRANSPARENT_KEY))).toBe(
          true
        )
      }
    }
  })

  it.each(OUTFIT_NAMES)('%s composes every frame and decodes with its palette', (name) => {
    const outfit = outfits[name]
    const dressed = applyOutfit(gestures, outfit)
    for (const gesture of GESTURE_NAMES) {
      expect(dressed[gesture].frames).toHaveLength(gestures[gesture].frames.length)
      expect(dressed[gesture].frameDuration).toBe(gestures[gesture].frameDuration)
      dressed[gesture].frames.forEach((frame, index) => {
        expect(() => assertSpriteSize(frame)).not.toThrow()
        expect(() => decodeFrame(frame, outfit.palette)).not.toThrow()
        expect(frame).not.toEqual(gestures[gesture].frames[index])
      })
    }
  })

  it('gives each outfit a distinct look', () => {
    const looks = OUTFIT_NAMES.map((name) =>
      applyOutfit(gestures, outfits[name]).idle.frames[0]?.join('\n')
    )
    expect(new Set(looks).size).toBe(OUTFIT_NAMES.length)
    expect(outfits.inventor.palette.r).toBe('#9a5b34')
    expect(outfits.scholar.palette.c).toBe('#1f2a24')
  })
})
