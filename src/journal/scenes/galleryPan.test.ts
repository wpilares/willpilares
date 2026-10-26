import { galleryFrameCentres } from '@backdrops/layout'
import { describe, expect, it } from 'vitest'
import {
  centredProgress,
  frameCentredProgress,
  GALLERY_PAN_END,
  GALLERY_PAN_START,
  galleryPanProgress,
  panShift,
  visibleShare,
} from './galleryPan'

describe('gallery pan mapping', () => {
  it('holds the pan still before 0.1 and after 0.9 and travels linearly between', () => {
    expect(GALLERY_PAN_START).toBe(0.1)
    expect(GALLERY_PAN_END).toBe(0.9)
    expect(galleryPanProgress(0)).toBe(0)
    expect(galleryPanProgress(0.1)).toBe(0)
    expect(galleryPanProgress(0.5)).toBeCloseTo(0.5)
    expect(galleryPanProgress(0.9)).toBe(1)
    expect(galleryPanProgress(1)).toBe(1)
  })

  it('shifts the panorama across its whole overflow', () => {
    expect(panShift(0, 3360)).toBe(1680)
    expect(panShift(0.5, 3360)).toBe(0)
    expect(panShift(1, 3360)).toBe(-1680)
    expect(panShift(0.3, 0)).toBe(0)
  })

  it('finds the scene progress that centres a point of the panorama', () => {
    expect(centredProgress(720, 1440, 3360)).toBeCloseTo(0.5)
    expect(centredProgress(-280, 1440, 3360)).toBeCloseTo(0.1 + 0.8 * (680 / 3360))
    expect(centredProgress(1720, 1440, 3360)).toBeCloseTo(0.1 + 0.8 * (2680 / 3360))
  })

  it('reports points the pan can never bring to the centre', () => {
    expect(centredProgress(-1280, 1440, 3360)).toBeNull()
    expect(centredProgress(2720, 1440, 3360)).toBeNull()
    expect(centredProgress(720, 1440, 0)).toBeNull()
  })

  describe.each([
    { width: 1440, height: 900 },
    { width: 1280, height: 800 },
    { width: 1920, height: 1080 },
    { width: 1600, height: 900 },
  ])('at $width x $height', (stage) => {
    it('brings every company frame to the screen centre during the pan', () => {
      const moments = galleryFrameCentres.map((centre) => frameCentredProgress(centre, stage))
      for (const moment of moments) {
        expect(moment).not.toBeNull()
        expect(moment ?? 0).toBeGreaterThanOrEqual(GALLERY_PAN_START)
        expect(moment ?? 1).toBeLessThanOrEqual(GALLERY_PAN_END)
      }
      expect(moments).toEqual([...moments].sort((a, b) => (a ?? 0) - (b ?? 0)))
    })
  })

  it('hangs one frame per company', () => {
    expect(galleryFrameCentres).toHaveLength(4)
  })

  it('centres the middle of the panorama halfway through the pan', () => {
    expect(frameCentredProgress(480, { width: 1440, height: 900 })).toBeCloseTo(0.5)
  })
})

describe('visible share of a plaque on the stage', () => {
  it('is whole when the plaque sits inside the viewport', () => {
    expect(visibleShare({ left: 100, right: 500 }, 1440)).toBe(1)
  })

  it('is the clipped fraction when the plaque straddles an edge', () => {
    expect(visibleShare({ left: 1240, right: 1640 }, 1440)).toBe(0.5)
  })

  it('is zero when the plaque has panned off the stage', () => {
    expect(visibleShare({ left: -900, right: -500 }, 1440)).toBe(0)
  })

  it('is zero for an unmeasured plaque', () => {
    expect(visibleShare({ left: 0, right: 0 }, 1440)).toBe(0)
  })
})
