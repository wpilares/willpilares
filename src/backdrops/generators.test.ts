import { describe, expect, it } from 'vitest'
import { type BackdropId, backdropIds, generateBackdrop } from './generators'
import { BOOKCASE_COMPARTMENT_HEIGHT, bookcaseShelves } from './layout'
import type { PixelBuffer } from './painter'
import { paletteKeys } from './palette'

type Size = readonly [width: number, height: number]

const standard: Size = [320, 180]
const panorama: Size = [960, 180]

const expectedSizes: Record<BackdropId, { far: Size; mid: Size; near: Size }> = {
  prologue: { far: standard, mid: standard, near: standard },
  city: { far: standard, mid: standard, near: standard },
  street: { far: standard, mid: standard, near: standard },
  armory: { far: standard, mid: standard, near: standard },
  gallery: { far: standard, mid: panorama, near: panorama },
  lab: { far: standard, mid: standard, near: standard },
  archive: { far: standard, mid: standard, near: standard },
  belfry: { far: standard, mid: standard, near: standard },
}

const hash = (data: Uint8Array): number =>
  data.reduce((value, byte) => Math.imul(value ^ byte, 16777619) >>> 0, 2166136261)

const transparentShare = (buffer: PixelBuffer): number =>
  buffer.data.reduce((total, value) => (value === 0 ? total + 1 : total), 0) / buffer.data.length

const layers = ['far', 'mid', 'near'] as const

describe('backdrop generators', () => {
  it('covers every backdrop scene', () => {
    expect([...backdropIds].sort()).toEqual(Object.keys(expectedSizes).sort())
  })

  describe.each(backdropIds)('%s', (id) => {
    const first = generateBackdrop(id)
    const second = generateBackdrop(id)

    it('is deterministic for its seed', () => {
      for (const layer of layers) {
        expect(hash(first[layer].data)).toBe(hash(second[layer].data))
      }
    })

    it('has the specified dimensions', () => {
      for (const layer of layers) {
        const [width, height] = expectedSizes[id][layer]
        expect(first[layer].width).toBe(width)
        expect(first[layer].height).toBe(height)
        expect(first[layer].data.length).toBe(width * height)
      }
    })

    it('paints only palette colours', () => {
      for (const layer of layers) {
        const invalid = first[layer].data.filter((value) => value > paletteKeys.length)
        expect(invalid.length).toBe(0)
      }
    })

    it('paints an opaque far layer', () => {
      expect(transparentShare(first.far)).toBe(0)
    })

    it('leaves at least a fifth of the near layer transparent', () => {
      expect(transparentShare(first.near)).toBeGreaterThanOrEqual(0.2)
    })
  })
})

describe('armory bookcase', () => {
  const { mid } = generateBackdrop('armory')
  const backPanelInks = new Set(['stone', 'ash', 'night'])

  it('lays a lit board top along every shelf span', () => {
    for (const shelf of bookcaseShelves) {
      for (let x = shelf.left; x < shelf.right; x += 1) {
        expect(mid.get(x, shelf.boardTop)).toBe('woodLight')
      }
    }
  })

  it('keeps the middle of every shelf clear of painted books for the page to fill', () => {
    for (const shelf of bookcaseShelves) {
      const ceiling = shelf.boardTop - BOOKCASE_COMPARTMENT_HEIGHT
      for (let y = ceiling; y < shelf.boardTop; y += 1) {
        for (let x = shelf.left; x < shelf.right; x += 1) {
          expect(backPanelInks.has(mid.get(x, y) ?? 'clear')).toBe(true)
        }
      }
    }
  })
})
