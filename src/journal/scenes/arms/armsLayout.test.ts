import { ARMORY_VERTICAL_TRAVEL, parallaxReach } from '@backdrops/layout'
import { describe, expect, it } from 'vitest'
import { ABOVE_TOP_INSET, armsLayout, BESIDE_TOP_INSET, HEADING_GAP } from './armsLayout'

const depth = 0.4
const reach = parallaxReach(depth, ARMORY_VERTICAL_TRAVEL)
const heading = { width: 280, height: 112 }
const reserve = 168
const margin = 40

const layoutFor = (width: number, height: number) =>
  armsLayout({ stage: { width, height }, reserve, margin, heading, depth })

describe('arms layout', () => {
  it('sets the heading beside a wide bookcase scene and fits the bookcase to the height', () => {
    const layout = layoutFor(2000, 1027)
    expect(layout.placement).toBe('beside')
    expect(layout.bookcase.y).toBeCloseTo(BESIDE_TOP_INSET + reach)
    expect(layout.bookcase.y + layout.bookcase.height).toBeCloseTo(1027 - reserve - reach)
    expect(layout.bookcase.x + layout.bookcase.width / 2).toBeCloseTo(1000)
    expect(margin + layout.headingMaxWidth + HEADING_GAP).toBeCloseTo(layout.bookcase.x)
  })

  it('moves the heading above the bookcase when the side room is too narrow', () => {
    const layout = layoutFor(1024, 768)
    expect(layout.placement).toBe('above')
    expect(layout.headingTop).toBe(ABOVE_TOP_INSET)
    expect(layout.bookcase.y).toBeCloseTo(ABOVE_TOP_INSET + heading.height + HEADING_GAP + reach)
    expect(layout.bookcase.y + layout.bookcase.height).toBeLessThanOrEqual(768 - reserve - reach)
  })

  it('keeps a narrow heading beside the bookcase on a 4:3 stage when it fits', () => {
    const layout = armsLayout({
      stage: { width: 1024, height: 768 },
      reserve,
      margin: 29,
      heading: { width: 194, height: 82 },
      depth,
    })
    expect(layout.placement).toBe('beside')
    expect(29 + 194 + HEADING_GAP).toBeLessThanOrEqual(layout.bookcase.x)
  })

  it('moves a heading too wide for the side room above the bookcase', () => {
    const wide = armsLayout({
      stage: { width: 1440, height: 900 },
      reserve,
      margin,
      heading: { width: 900, height: 112 },
      depth,
    })
    expect(wide.placement).toBe('above')
  })

  it('never lets the bookcase cross the reserve at any aspect ratio from 4:3 to 21:9', () => {
    const stages: readonly (readonly [number, number])[] = [
      [1024, 768],
      [1280, 800],
      [1440, 900],
      [1920, 1080],
      [2000, 1027],
      [2560, 1080],
      [800, 900],
    ]
    for (const [width, height] of stages) {
      const layout = layoutFor(width, height)
      const bottom = layout.bookcase.y + layout.bookcase.height
      expect(bottom).toBeLessThanOrEqual(height - reserve - reach + 1e-6)
      expect(layout.bookcase.y).toBeGreaterThanOrEqual(BESIDE_TOP_INSET + reach - 1e-6)
      if (layout.placement === 'beside') {
        expect(margin + layout.headingMaxWidth).toBeLessThan(layout.bookcase.x)
      } else {
        expect(layout.headingTop + heading.height).toBeLessThan(layout.bookcase.y)
      }
    }
  })
})
