import { describe, expect, it } from 'vitest'
import { outlineContours } from './glyphOutline'
import { compactPathData } from './pathData'

describe('compactPathData', () => {
  it('rounds to integers and writes relative segments after an absolute move', () => {
    expect(
      compactPathData([
        { type: 'M', x: 10.4, y: 20.6 },
        { type: 'L', x: 30.2, y: 25.1 },
        { type: 'Q', x1: 40, y1: 10, x: 50, y: 21 },
        { type: 'Z' },
      ])
    ).toBe('M10 21l20 4q10-15 20-4z')
  })

  it('uses horizontal and vertical lines and drops repeated command letters', () => {
    expect(
      compactPathData([
        { type: 'M', x: 0, y: 0 },
        { type: 'L', x: 10, y: 0 },
        { type: 'L', x: 10, y: 10 },
        { type: 'L', x: 15, y: 18 },
        { type: 'L', x: 25, y: 12 },
        { type: 'Z' },
      ])
    ).toBe('M0 0h10v10l5 8 10-6z')
  })

  it('merges exactly collinear lines and drops zero length segments', () => {
    expect(
      compactPathData([
        { type: 'M', x: 0, y: 0 },
        { type: 'L', x: 0.2, y: 0.1 },
        { type: 'L', x: 2, y: 2 },
        { type: 'L', x: 4, y: 4 },
        { type: 'L', x: 4, y: 9 },
        { type: 'Z' },
      ])
    ).toBe('M0 0l4 4v5z')
  })

  it('keeps collinear lines that turn back on themselves', () => {
    expect(
      compactPathData([
        { type: 'M', x: 0, y: 0 },
        { type: 'L', x: 10, y: 0 },
        { type: 'L', x: 4, y: 0 },
        { type: 'L', x: 4, y: 6 },
        { type: 'Z' },
      ])
    ).toBe('M0 0h10-6v6z')
  })

  it('drops the closing line that only returns to the contour start', () => {
    expect(
      compactPathData([
        { type: 'M', x: 5, y: 5 },
        { type: 'Q', x1: 10, y1: 0, x: 15, y: 5 },
        { type: 'L', x: 5, y: 5 },
        { type: 'Z' },
      ])
    ).toBe('M5 5q5-5 10 0z')
  })

  it('writes smooth curves when the control point is an exact reflection', () => {
    expect(
      compactPathData([
        { type: 'M', x: 0, y: 0 },
        { type: 'Q', x1: 5, y1: -5, x: 10, y: 0 },
        { type: 'Q', x1: 15, y1: 5, x: 20, y: 0 },
        { type: 'C', x1: 22, y1: 3, x2: 28, y2: 3, x: 30, y: 0 },
        { type: 'C', x1: 32, y1: -3, x2: 38, y2: 1, x: 40, y: 0 },
        { type: 'C', x1: 41, y1: 0, x2: 42, y2: 2, x: 44, y: 4 },
        { type: 'Z' },
      ])
    ).toBe('M0 0q5-5 10 0t10 0c2 3 8 3 10 0s8 1 10 0c1 0 2 2 4 4z')
  })

  it('keeps every contour starting with an absolute move so contours split cleanly', () => {
    const d = compactPathData([
      { type: 'M', x: 0, y: 0 },
      { type: 'L', x: 10, y: 0 },
      { type: 'L', x: 10, y: 10 },
      { type: 'Z' },
      { type: 'M', x: 20, y: 0 },
      { type: 'L', x: 30, y: 0 },
      { type: 'L', x: 30, y: 10 },
      { type: 'Z' },
    ])
    expect(d).toBe('M0 0h10v10zM20 0h10v10z')
    expect(outlineContours(d)).toEqual(['M0 0h10v10z', 'M20 0h10v10z'])
  })

  it('returns nothing for an empty path', () => {
    expect(compactPathData([])).toBe('')
  })
})
