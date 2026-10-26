import { describe, expect, it } from 'vitest'
import { createPixelBuffer, type PixelBuffer } from './painter'
import { backdropPalette, paletteIndex } from './palette'

const countIndex = (buffer: PixelBuffer, index: number): number =>
  buffer.data.reduce((total, value) => (value === index ? total + 1 : total), 0)

const filled = (buffer: PixelBuffer): number => buffer.data.length - countIndex(buffer, 0)

describe('createPixelBuffer', () => {
  it('starts fully transparent with the requested size', () => {
    const buffer = createPixelBuffer(8, 4)
    expect(buffer.width).toBe(8)
    expect(buffer.height).toBe(4)
    expect(buffer.data.length).toBe(32)
    expect(filled(buffer)).toBe(0)
  })

  it('ignores pixels outside the bounds', () => {
    const buffer = createPixelBuffer(4, 4)
    buffer.pixel(-1, 0, 'moon')
    buffer.pixel(4, 2, 'moon')
    buffer.pixel(1, 9, 'moon')
    expect(filled(buffer)).toBe(0)
    buffer.pixel(3, 3, 'moon')
    expect(buffer.get(3, 3)).toBe('moon')
  })

  it('clips rectangles that overflow the bounds', () => {
    const buffer = createPixelBuffer(10, 10)
    buffer.fillRect(-5, -5, 10, 10, 'ash')
    expect(filled(buffer)).toBe(25)
    buffer.fillRect(8, 8, 50, 50, 'ash')
    expect(filled(buffer)).toBe(29)
  })

  it('erases with the clear ink', () => {
    const buffer = createPixelBuffer(3, 3)
    buffer.fillRect(0, 0, 3, 3, 'stone')
    buffer.pixel(1, 1, 'clear')
    expect(buffer.get(1, 1)).toBeNull()
    expect(filled(buffer)).toBe(8)
  })

  it('draws a Bresenham line touching both ends', () => {
    const buffer = createPixelBuffer(10, 10)
    buffer.line(0, 0, 9, 3, 'gold')
    expect(filled(buffer)).toBe(10)
    expect(buffer.get(0, 0)).toBe('gold')
    expect(buffer.get(9, 3)).toBe('gold')
  })

  it('fills a symmetric circle', () => {
    const buffer = createPixelBuffer(21, 21)
    buffer.circle(10, 10, 5, 'moon')
    const area = filled(buffer)
    expect(area).toBeGreaterThan(Math.PI * 16)
    expect(area).toBeLessThan(Math.PI * 36)
    expect(buffer.get(10, 5)).toBe('moon')
    expect(buffer.get(15, 10)).toBe('moon')
    expect(buffer.get(5, 10)).toBe('moon')
    expect(buffer.get(10, 15)).toBe('moon')
    expect(buffer.get(15, 15)).toBeNull()
  })

  it.each([
    ['checker', 8],
    ['bayer25', 4],
    ['bayer50', 8],
    ['bayer75', 12],
  ] as const)('dithers %s with %i of 16 pixels in the first key', (pattern, expected) => {
    const buffer = createPixelBuffer(4, 4)
    buffer.ditherRect(0, 0, 4, 4, 'void', 'night', pattern)
    expect(countIndex(buffer, paletteIndex('void'))).toBe(expected)
    expect(countIndex(buffer, paletteIndex('night'))).toBe(16 - expected)
  })

  it('dithers towards transparency with the clear ink', () => {
    const buffer = createPixelBuffer(8, 8)
    buffer.ditherRect(0, 0, 8, 8, 'ember', 'clear', 'bayer25')
    expect(filled(buffer)).toBe(16)
  })

  it('fills a known triangle by scanline', () => {
    const buffer = createPixelBuffer(12, 12)
    buffer.polygon(
      [
        [0, 0],
        [10, 0],
        [0, 10],
      ],
      'slate'
    )
    expect(filled(buffer)).toBe(45)
    expect(buffer.get(0, 0)).toBe('slate')
    expect(buffer.get(9, 9)).toBeNull()
  })

  it('fills an axis aligned polygon with its exact area', () => {
    const buffer = createPixelBuffer(12, 12)
    buffer.polygon(
      [
        [2, 2],
        [8, 2],
        [8, 7],
        [2, 7],
      ],
      'slate'
    )
    expect(filled(buffer)).toBe(30)
  })

  it('exports rgba with zero alpha for transparent pixels', () => {
    const buffer = createPixelBuffer(2, 1)
    buffer.pixel(1, 0, 'blood')
    const rgba = buffer.toRgba()
    expect(rgba.length).toBe(8)
    expect([...rgba.slice(0, 4)]).toEqual([0, 0, 0, 0])
    expect([...rgba.slice(4, 8)]).toEqual([0x8b, 0x1e, 0x1e, 255])
    expect(backdropPalette.blood).toBe('#8b1e1e')
  })
})
