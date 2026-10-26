import { describe, expect, it } from 'vitest'
import { backdropPalette, paletteKeys } from '../backdrops/palette'
import { CLEAR_PIXEL, CURSOR_SIZE, cursorLegend, cursors, OUTLINE_PIXEL } from './art'
import { encodeIndexedPng } from './exportPng'

const NEIGHBOURS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const

const pixelAt = (rows: readonly string[], x: number, y: number): string =>
  rows[y]?.[x] ?? CLEAR_PIXEL

describe('cursor art', () => {
  it('defines the quill, the pointing glove, the open glove and the gripping glove', () => {
    expect(cursors.map((cursor) => cursor.file)).toEqual([
      'quill',
      'glove',
      'glove-open',
      'glove-grip',
    ])
  })

  it('maps every legend character to a backdrop palette key', () => {
    expect(cursorLegend[OUTLINE_PIXEL]).toBe('void')
    for (const key of Object.values(cursorLegend)) {
      expect(paletteKeys).toContain(key)
    }
  })

  describe.each(cursors)('$file', (cursor) => {
    it('is a 32 by 32 grid', () => {
      expect(CURSOR_SIZE).toBe(32)
      expect(cursor.rows).toHaveLength(CURSOR_SIZE)
      for (const row of cursor.rows) expect(row).toHaveLength(CURSOR_SIZE)
    })

    it('uses only clear pixels and legend characters', () => {
      const used = new Set(cursor.rows.join(''))
      used.delete(CLEAR_PIXEL)
      for (const character of used) expect(Object.keys(cursorLegend)).toContain(character)
      expect(used.size).toBeGreaterThan(3)
    })

    it('wraps every coloured pixel in a void outline', () => {
      let outlined = 0
      cursor.rows.forEach((row, y) => {
        Array.from(row).forEach((character, x) => {
          if (character === CLEAR_PIXEL || character === OUTLINE_PIXEL) return
          for (const [dx, dy] of NEIGHBOURS) {
            expect(pixelAt(cursor.rows, x + dx, y + dy), `${x},${y}`).not.toBe(CLEAR_PIXEL)
          }
          outlined += 1
        })
      })
      expect(outlined).toBeGreaterThan(40)
      expect(cursor.rows.join('')).toContain(OUTLINE_PIXEL)
    })

    it('places the hotspot on an opaque pixel inside the grid', () => {
      const { x, y } = cursor.hotspot
      expect(Number.isInteger(x) && Number.isInteger(y)).toBe(true)
      expect(x).toBeGreaterThanOrEqual(0)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThan(CURSOR_SIZE)
      expect(y).toBeLessThan(CURSOR_SIZE)
      expect(pixelAt(cursor.rows, x, y)).not.toBe(CLEAR_PIXEL)
    })
  })

  it('keeps pointer hotspots at the top-left tip and grip hotspots near the centre', () => {
    const [quill, glove, open, grip] = cursors
    expect(quill?.hotspot.x).toBeLessThan(6)
    expect(quill?.hotspot.y).toBeLessThan(6)
    expect(glove?.hotspot.x).toBeLessThan(8)
    expect(glove?.hotspot.y).toBeLessThan(8)
    for (const centred of [open, grip]) {
      expect(centred?.hotspot.x).toBeGreaterThan(10)
      expect(centred?.hotspot.x).toBeLessThan(22)
      expect(centred?.hotspot.y).toBeGreaterThan(10)
      expect(centred?.hotspot.y).toBeLessThan(24)
    }
  })
})

describe('encodeIndexedPng', () => {
  const ihdr = (bytes: Uint8Array) => {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    return { width: view.getUint32(16), height: view.getUint32(20), colourType: bytes[25] }
  }

  it('writes an indexed PNG at the requested integer scale', () => {
    const [quill] = cursors
    if (quill === undefined) throw new Error('quill missing')
    const single = encodeIndexedPng(quill.rows, cursorLegend, backdropPalette, 1)
    const double = encodeIndexedPng(quill.rows, cursorLegend, backdropPalette, 2)

    expect(Array.from(single.subarray(0, 8))).toEqual([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ])
    expect(ihdr(single)).toEqual({ width: 32, height: 32, colourType: 3 })
    expect(ihdr(double)).toEqual({ width: 64, height: 64, colourType: 3 })
  })

  it('rejects unknown pixels and non-integer scales', () => {
    const palette = { void: '#000000' }
    expect(() => encodeIndexedPng(['x'], { o: 'void' }, palette, 1)).toThrow('unknown pixel x')
    expect(() => encodeIndexedPng(['o'], { o: 'void' }, palette, 1.5)).toThrow('invalid scale')
  })
})
