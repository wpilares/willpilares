import { ARMORY_CANVAS, bookcaseBounds, bookcaseShelves, fitRectToStage } from '@backdrops/layout'
import { describe, expect, it } from 'vitest'
import { skillShelves } from '@/constants'
import {
  BARE_SPINE_PADDING,
  LEAN_DEGREES,
  leanAllowance,
  letteringEms,
  MAX_SPINE_FONT,
  MIN_SPINE_FONT,
  pinnedSpineRange,
  type SpineRange,
  shelfPlacement,
  skillHash,
  spineReserve,
  spineShape,
  staticSpineRange,
} from './bookGeometry'

const skillNames = skillShelves.flatMap((shelf) => shelf.skills.map((skill) => skill.name))
const desktop = { width: 1440, height: 900 }
const fit = fitRectToStage(bookcaseBounds, desktop, { top: 32, right: 0, bottom: 176, left: 0 })
const unit = 948 / 180

const fitsSpine = (name: string, range: SpineRange) => {
  const shape = spineShape(name, range)
  const textSpan = shape.height - (shape.medallion ? spineReserve(shape.width) : BARE_SPINE_PADDING)
  return letteringEms(name) * shape.fontSize <= textSpan + 1e-6
}

describe('skill hash', () => {
  it('is stable for a name and differs between names', () => {
    expect(skillHash('React')).toBe(skillHash('React'))
    expect(skillHash('React')).not.toBe(skillHash('Angular'))
    expect(Number.isInteger(skillHash('PostgreSQL'))).toBe(true)
    expect(skillHash('PostgreSQL')).toBeGreaterThanOrEqual(0)
  })
})

describe('spine lettering', () => {
  it('measures wide capitals wider than narrow ones and counts the tracking', () => {
    expect(letteringEms('MMMM')).toBeGreaterThan(letteringEms('IIII'))
    expect(letteringEms('MongoDB')).toBeGreaterThan(6)
    expect(letteringEms('CI/CD')).toBeLessThan(letteringEms('MONGO'))
    expect(letteringEms('a')).toBeCloseTo(letteringEms('A'))
  })
})

describe('spine shape', () => {
  it('keeps pinned spines within 120 to 170 by 34 to 46 pixels at 1440 by 900', () => {
    const range = pinnedSpineRange(unit)
    for (const name of skillNames) {
      const shape = spineShape(name, range)
      expect(shape.height).toBeGreaterThanOrEqual(120)
      expect(shape.height).toBeLessThanOrEqual(170)
      expect(shape.width).toBeGreaterThanOrEqual(34)
      expect(shape.width).toBeLessThanOrEqual(46)
    }
  })

  it('keeps static spines between 100 and 130 pixels tall', () => {
    for (const name of skillNames) {
      const shape = spineShape(name, staticSpineRange)
      expect(shape.height).toBeGreaterThanOrEqual(100)
      expect(shape.height).toBeLessThanOrEqual(130)
    }
  })

  it('varies spine sizes deterministically across the shelf', () => {
    const range = pinnedSpineRange(unit)
    const widths = new Set(skillNames.map((name) => Math.round(spineShape(name, range).width)))
    const heights = new Set(skillNames.map((name) => Math.round(spineShape(name, range).height)))
    expect(widths.size).toBeGreaterThanOrEqual(4)
    expect(heights.size).toBeGreaterThanOrEqual(4)
    expect(spineShape('Docker', range)).toEqual(spineShape('Docker', range))
  })

  it('shrinks the spine lettering until every name fits without clipping', () => {
    const ranges = [3.2, 3.5, 3.76, 4.6, 848 / 180, unit].map(pinnedSpineRange)
    for (const range of [...ranges, staticSpineRange]) {
      for (const name of skillNames) {
        const shape = spineShape(name, range)
        expect(fitsSpine(name, range)).toBe(true)
        expect(shape.fontSize).toBeGreaterThanOrEqual(MIN_SPINE_FONT)
        expect(shape.fontSize).toBeLessThanOrEqual(MAX_SPINE_FONT)
      }
    }
  })

  it('keeps every medallion on large pinned shelves and on the static shelves', () => {
    for (const range of [pinnedSpineRange(4.6), pinnedSpineRange(unit), staticSpineRange]) {
      for (const name of skillNames) expect(spineShape(name, range).medallion).toBe(true)
    }
  })

  it('drops the medallion only from long names that cannot fit beside it on small shelves', () => {
    const range = pinnedSpineRange(3.2)
    expect(spineShape('React', range).medallion).toBe(true)
    expect(spineShape('AWS', range).medallion).toBe(true)
    expect(spineShape('PostgreSQL', range).medallion).toBe(false)
    const bare = skillNames.filter((name) => !spineShape(name, range).medallion)
    expect(bare.length).toBeLessThan(skillNames.length / 2)
  })

  it('gives long names a readable size on pinned shelves', () => {
    const range = pinnedSpineRange(unit)
    expect(spineShape('PostgreSQL', range).fontSize).toBeGreaterThanOrEqual(11)
    expect(spineShape('TypeScript', range).fontSize).toBeGreaterThanOrEqual(11)
  })

  it('leans only an occasional book and leaves room for the tilt', () => {
    const range = pinnedSpineRange(unit)
    const leans = skillNames.map((name) => spineShape(name, range).lean)
    const leaning = leans.filter((lean) => lean !== 0).length
    expect(leaning).toBeGreaterThanOrEqual(1)
    expect(leaning).toBeLessThanOrEqual(Math.ceil(skillNames.length / 3))
    for (const name of skillNames) {
      const shape = spineShape(name, range)
      const tilt = shape.height * Math.sin((LEAN_DEGREES * Math.PI) / 180)
      expect(leanAllowance(shape)).toBe(shape.lean === 0 ? 0 : Math.ceil(tilt))
    }
  })
})

describe('shelf placement', () => {
  it('stands each shelf row exactly on its fitted backdrop board', () => {
    for (const shelf of bookcaseShelves) {
      const placement = shelfPlacement(shelf, fit)
      expect(placement.left).toBeCloseTo(fit.x + (shelf.left + ARMORY_CANVAS.coreX) * fit.scale)
      expect(placement.width).toBeCloseTo((shelf.right - shelf.left) * fit.scale)
      expect(placement.boardTop).toBeCloseTo(
        fit.y + (shelf.boardTop + ARMORY_CANVAS.coreY) * fit.scale
      )
      expect(placement.unit).toBeCloseTo(fit.scale)
    }
  })

  it('places the plaque on the front edge from the inner frame', () => {
    const [first] = bookcaseShelves
    if (!first) throw new Error('missing shelf')
    const placement = shelfPlacement(first, fit)
    expect(placement.plaqueLeft).toBeLessThan(placement.left)
    expect(placement.boardHeight).toBeGreaterThan(15)
  })
})
