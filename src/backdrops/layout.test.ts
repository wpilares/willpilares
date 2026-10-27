import { describe, expect, it } from 'vitest'
import {
  ARMORY_CANVAS,
  ARMORY_VERTICAL_TRAVEL,
  armoryCoreRect,
  BACKDROP_HEIGHT,
  BACKDROP_VERTICAL_TRAVEL,
  BOOKCASE_BOARD_THICKNESS,
  BOOKCASE_COMPARTMENT_HEIGHT,
  backdropRectToStage,
  backdropScale,
  bookcaseBounds,
  bookcaseFrame,
  bookcaseShelves,
  CANDLE_FLAME_WICK_COLUMN,
  fitRectToStage,
  fittedRect,
  isPanoramaLayer,
  layerBleed,
  layerSize,
  layerWidth,
  PROLOGUE_CANDLE_X,
  PROLOGUE_WICK_TOP,
  panoramaOverflow,
  parallaxReach,
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

describe('fit a rect to the stage', () => {
  const source = { x: 10, y: 20, width: 100, height: 200 }
  const none = { top: 0, right: 0, bottom: 0, left: 0 }

  it('scales by height on a wide stage and centres the rect horizontally', () => {
    const fit = fitRectToStage(source, { width: 2000, height: 1000 }, none)
    expect(fit.scale).toBe(5)
    const rect = fittedRect(source, fit)
    expect(rect).toEqual({ x: 750, y: 0, width: 500, height: 1000 })
  })

  it('scales by width when the stage is too narrow for the height fit', () => {
    const fit = fitRectToStage(source, { width: 300, height: 1000 }, none)
    expect(fit.scale).toBe(3)
    const rect = fittedRect(source, fit)
    expect(rect.x).toBe(0)
    expect(rect.width).toBe(300)
    expect(rect.y).toBe(200)
  })

  it('keeps the rect between the top and bottom insets', () => {
    const insets = { top: 40, right: 0, bottom: 160, left: 0 }
    const fit = fitRectToStage(source, { width: 1600, height: 1000 }, insets)
    const rect = fittedRect(source, fit)
    expect(fit.scale).toBe(4)
    expect(rect.y).toBe(40)
    expect(rect.y + rect.height).toBe(840)
    expect(rect.x + rect.width / 2).toBe(800)
  })

  it('maps the source origin so other rects stay aligned with the fitted one', () => {
    const fit = fitRectToStage(source, { width: 2000, height: 1000 }, none)
    expect(fit.x).toBe(700)
    expect(fit.y).toBe(-100)
    expect(fittedRect({ x: 0, y: 0, width: 1, height: 1 }, fit)).toEqual({
      x: 700,
      y: -100,
      width: 5,
      height: 5,
    })
  })

  it('collapses to a zero scale when the insets leave no room', () => {
    const fit = fitRectToStage(source, { width: 500, height: 100 }, { ...none, bottom: 200 })
    expect(fit.scale).toBe(0)
  })
})

describe('armory canvas', () => {
  it('widens and deepens the armory layers around the 320 by 180 core', () => {
    expect(ARMORY_CANVAS.width).toBeGreaterThan(320)
    expect(ARMORY_CANVAS.height).toBeGreaterThan(BACKDROP_HEIGHT)
    for (const layer of ['far', 'mid', 'near'] as const) {
      expect(layerSize('armory', layer)).toEqual({
        width: ARMORY_CANVAS.width,
        height: ARMORY_CANVAS.height,
      })
      expect(layerWidth('armory', layer)).toBe(ARMORY_CANVAS.width)
    }
    expect(layerSize('lab', 'mid')).toEqual({ width: 320, height: 180 })
    expect(layerSize('gallery', 'near')).toEqual({ width: 960, height: 180 })
  })

  it('centres the bookcase horizontally in the canvas', () => {
    expect(bookcaseBounds.x + bookcaseBounds.width / 2).toBe(ARMORY_CANVAS.width / 2)
    expect(ARMORY_CANVAS.coreX % 4).toBe(0)
    expect(ARMORY_CANVAS.coreY % 4).toBe(0)
  })

  it('bounds the whole bookcase from its crown to its plinth', () => {
    const frame = armoryCoreRect({
      x: bookcaseFrame.left,
      y: 0,
      width: bookcaseFrame.right - bookcaseFrame.left,
      height: BACKDROP_HEIGHT,
    })
    expect(bookcaseBounds.x).toBeLessThan(frame.x)
    expect(bookcaseBounds.x + bookcaseBounds.width).toBeGreaterThan(frame.x + frame.width)
    expect(bookcaseBounds.y).toBeLessThan(frame.y)
    expect(bookcaseBounds.y + bookcaseBounds.height).toBe(frame.y + frame.height)
    expect(bookcaseBounds.y).toBeGreaterThanOrEqual(0)
    expect(bookcaseBounds.y + bookcaseBounds.height).toBeLessThan(ARMORY_CANVAS.height)
  })

  it('shifts core rects into canvas coordinates', () => {
    expect(armoryCoreRect({ x: 1, y: 2, width: 3, height: 4 })).toEqual({
      x: 1 + ARMORY_CANVAS.coreX,
      y: 2 + ARMORY_CANVAS.coreY,
      width: 3,
      height: 4,
    })
  })

  it('travels less than the other scenes and reaches half its travel per depth', () => {
    expect(ARMORY_VERTICAL_TRAVEL).toBeLessThan(BACKDROP_VERTICAL_TRAVEL)
    expect(parallaxReach(0.4, 40)).toBe(8)
    expect(parallaxReach(0.15, 40)).toBe(3)
  })

  it('fits the full bookcase above the cat reserve from 4:3 to 21:9', () => {
    const stages = [
      { width: 1024, height: 768 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 },
      { width: 2000, height: 1027 },
      { width: 2560, height: 1080 },
    ]
    for (const stage of stages) {
      const insets = { top: 32, right: 0, bottom: 176, left: 0 }
      const fit = fitRectToStage(bookcaseBounds, stage, insets)
      const rect = fittedRect(bookcaseBounds, fit)
      expect(rect.y).toBeGreaterThanOrEqual(32 - 1e-6)
      expect(rect.y + rect.height).toBeLessThanOrEqual(stage.height - 176 + 1e-6)
      const canvas = fittedRect({ x: 0, y: 0, ...ARMORY_CANVAS }, fit)
      expect(canvas.x).toBeLessThanOrEqual(0)
      expect(canvas.x + canvas.width).toBeGreaterThanOrEqual(stage.width)
      expect(canvas.y + canvas.height).toBeGreaterThanOrEqual(stage.height)
    }
  })
})
