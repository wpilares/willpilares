import { describe, expect, it } from 'vitest'
import { placeholderFrame, placeholderPalette } from './fixtures'
import {
  assertSpriteSize,
  composeFrame,
  decodeFrame,
  flipFrame,
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  SpriteDecodeError,
} from './sprite'

const palette = { a: '#ff0000', b: '#00ff00' } as const

describe('decodeFrame', () => {
  it('maps characters to palette colours and dots to null', () => {
    const matrix = decodeFrame(['a.', '.b'], palette)
    expect(matrix.width).toBe(2)
    expect(matrix.height).toBe(2)
    expect(matrix.pixels).toEqual([
      ['#ff0000', null],
      [null, '#00ff00'],
    ])
  })

  it('throws empty when the frame has no rows', () => {
    expect(() => decodeFrame([], palette)).toThrow(SpriteDecodeError)
    expect(() => decodeFrame([], palette)).toThrow(
      expect.objectContaining<Partial<SpriteDecodeError>>({ reason: 'empty' })
    )
  })

  it('throws ragged when rows differ in length', () => {
    expect(() => decodeFrame(['ab', 'a'], palette)).toThrow(
      expect.objectContaining<Partial<SpriteDecodeError>>({ reason: 'ragged' })
    )
  })

  it('throws unknown-key with the offending character', () => {
    expect(() => decodeFrame(['az'], palette)).toThrow(
      expect.objectContaining<Partial<SpriteDecodeError>>({
        reason: 'unknown-key',
        detail: expect.stringContaining('z'),
      })
    )
  })

  it('decodes the placeholder fixture at the sprite size', () => {
    const matrix = decodeFrame(placeholderFrame(), placeholderPalette)
    expect(matrix.width).toBe(SPRITE_WIDTH)
    expect(matrix.height).toBe(SPRITE_HEIGHT)
    expect(matrix.pixels[0]?.[0]).toBe(placeholderPalette.o)
    expect(matrix.pixels[1]?.[1]).toBe(placeholderPalette.f)
  })
})

describe('composeFrame', () => {
  it('lets overlay characters replace base characters and keeps base under dots', () => {
    expect(composeFrame(['ab', 'ab'], ['.c', 'd.'])).toEqual(['ac', 'db'])
  })

  it('throws ragged when dimensions differ', () => {
    expect(() => composeFrame(['ab'], ['ab', 'ab'])).toThrow(
      expect.objectContaining<Partial<SpriteDecodeError>>({ reason: 'ragged' })
    )
    expect(() => composeFrame(['ab'], ['abc'])).toThrow(
      expect.objectContaining<Partial<SpriteDecodeError>>({ reason: 'ragged' })
    )
  })
})

describe('flipFrame', () => {
  it('mirrors every row horizontally', () => {
    expect(flipFrame(['ab.', 'c..'])).toEqual(['.ba', '..c'])
  })

  it('is its own inverse', () => {
    const frame = placeholderFrame()
    expect(flipFrame(flipFrame(frame))).toEqual(frame)
  })
})

describe('assertSpriteSize', () => {
  it('accepts a 24x32 frame', () => {
    expect(() => assertSpriteSize(placeholderFrame())).not.toThrow()
  })

  it('throws size for other dimensions', () => {
    expect(() => assertSpriteSize(['ab', 'ab'])).toThrow(
      expect.objectContaining<Partial<SpriteDecodeError>>({ reason: 'size' })
    )
  })
})
