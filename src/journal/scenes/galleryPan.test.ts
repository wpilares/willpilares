import { describe, expect, it } from 'vitest'
import {
  centredProgress,
  GALLERY_PAN_END,
  GALLERY_PAN_START,
  galleryPanProgress,
  panShift,
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
})
