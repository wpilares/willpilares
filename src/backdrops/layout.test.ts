import { describe, expect, it } from 'vitest'
import {
  BACKDROP_HEIGHT,
  BACKDROP_VERTICAL_TRAVEL,
  BOOKCASE_BOARD_THICKNESS,
  BOOKCASE_COMPARTMENT_HEIGHT,
  backdropRectToStage,
  backdropScale,
  bookcaseFrame,
  bookcaseShelves,
  CANDLE_FLAME_WICK_COLUMN,
  isPanoramaLayer,
  layerBleed,
  layerWidth,
  PROLOGUE_CANDLE_X,
  PROLOGUE_WICK_TOP,
  panoramaOverflow,
  prologueFlameRect,
} from './layout'

describe('backdrop layout', () => {
  it('marks only the gallery mid and near layers as panoramas', () => {
    expect(isPanoramaLayer('gallery', 'mid')).toBe(true)
    expect(isPanoramaLayer('gallery', 'near')).toBe(true)
    expect(isPanoramaLayer('gallery', 'far')).toBe(false)
    expect(isPanoramaLayer('city', 'mid')).toBe(false)
    expect(layerWidth('gallery', 'near')).toBe(960)
    expect(layerWidth('lab', 'near')).toBe(320)
  })

  it('measures how far a panorama overflows its container', () => {
    expect(panoramaOverflow(1280, 720)).toBe(2560)
    expect(panoramaOverflow(4000, 180)).toBe(0)
  })

  it('bleeds each vertical layer by half its parallax travel', () => {
    expect(BACKDROP_VERTICAL_TRAVEL).toBe(120)
    expect(layerBleed(0.15)).toBe(9)
    expect(layerBleed(0.4)).toBe(24)
    expect(layerBleed(0.8)).toBe(48)
  })

  it('scales a backdrop to cover the stage including its bleed', () => {
    expect(backdropScale({ width: 1440, height: 900 }, 960)).toBe(5)
    expect(backdropScale({ width: 4000, height: 180 }, 960)).toBeCloseTo(4000 / 960)
    expect(backdropScale({ width: 1440, height: 900 }, 320, 24)).toBeCloseTo(948 / 180)
  })

  it('converts a gallery frame centre into unpanned stage pixels', () => {
    const stage = { width: 1440, height: 900 }
    expect(backdropRectToStage({ x: 480, y: 74, width: 0, height: 0 }, stage, 960)).toEqual({
      x: 720,
      y: 370,
      width: 0,
      height: 0,
    })
    expect(backdropRectToStage({ x: 80, y: 47, width: 62, height: 54 }, stage, 960)).toEqual({
      x: -1280,
      y: 235,
      width: 310,
      height: 270,
    })
  })

  it('converts the lab mirror into stage pixels on a bled layer', () => {
    const scale = 948 / 180
    const rect = backdropRectToStage(
      { x: 56, y: 36, width: 108, height: 84 },
      { width: 1440, height: 900 },
      320,
      24
    )
    expect(rect.x).toBeCloseTo((1440 - 320 * scale) / 2 + 56 * scale)
    expect(rect.y).toBeCloseTo((900 - 180 * scale) / 2 + 36 * scale)
    expect(rect.width).toBeCloseTo(108 * scale)
    expect(rect.height).toBeCloseTo(84 * scale)
  })

  it('rests the prologue flame base directly on top of the wick', () => {
    expect(prologueFlameRect.y + prologueFlameRect.height).toBe(PROLOGUE_WICK_TOP)
    expect(prologueFlameRect.x + CANDLE_FLAME_WICK_COLUMN).toBe(PROLOGUE_CANDLE_X)
  })

  it('stacks five evenly spaced shelf boards inside the bookcase frame', () => {
    expect(bookcaseShelves).toHaveLength(5)
    const tops = bookcaseShelves.map((shelf) => shelf.boardTop)
    const pitch = BOOKCASE_COMPARTMENT_HEIGHT + BOOKCASE_BOARD_THICKNESS
    tops.slice(1).forEach((top, index) => {
      expect(top - (tops[index] ?? 0)).toBe(pitch)
    })
    expect((tops[0] ?? 0) - BOOKCASE_COMPARTMENT_HEIGHT).toBe(bookcaseFrame.innerTop)
    const lowest = bookcaseShelves[bookcaseShelves.length - 1]
    expect((lowest?.boardTop ?? 0) + BOOKCASE_BOARD_THICKNESS).toBeLessThan(BACKDROP_HEIGHT - 4)
  })

  it('keeps every usable shelf span inside the frame with room for end decorations', () => {
    for (const shelf of bookcaseShelves) {
      expect(shelf.left).toBeGreaterThan(bookcaseFrame.innerLeft + 4)
      expect(shelf.right).toBeLessThan(bookcaseFrame.innerRight - 5)
      expect(shelf.right - shelf.left).toBeGreaterThanOrEqual(90)
      expect(Number.isInteger(shelf.boardTop)).toBe(true)
    }
  })
})
