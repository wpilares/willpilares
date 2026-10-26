export type SpriteFrame = readonly string[]

export type Palette = Readonly<Record<string, string>>

export type PixelMatrix = {
  readonly width: number
  readonly height: number
  readonly pixels: ReadonlyArray<ReadonlyArray<string | null>>
}

export type SpriteDecodeReason = 'empty' | 'ragged' | 'unknown-key' | 'size'

export const TRANSPARENT_KEY = '.'
export const SPRITE_WIDTH = 24
export const SPRITE_HEIGHT = 32

export class SpriteDecodeError extends Error {
  readonly reason: SpriteDecodeReason
  readonly detail: string

  constructor(reason: SpriteDecodeReason, detail: string) {
    super(`Sprite decode failed (${reason}): ${detail}`)
    this.name = 'SpriteDecodeError'
    this.reason = reason
    this.detail = detail
  }
}

const assertRectangular = (frame: SpriteFrame): number => {
  const firstRow = frame[0]
  if (firstRow === undefined) throw new SpriteDecodeError('empty', 'frame has no rows')
  const width = firstRow.length
  frame.forEach((row, index) => {
    if (row.length !== width) {
      throw new SpriteDecodeError(
        'ragged',
        `row ${index} has ${row.length} columns, expected ${width}`
      )
    }
  })
  return width
}

export const decodeFrame = (frame: SpriteFrame, palette: Palette): PixelMatrix => {
  const width = assertRectangular(frame)
  const pixels = frame.map((row, rowIndex) =>
    Array.from(row, (key, columnIndex) => {
      if (key === TRANSPARENT_KEY) return null
      const colour = palette[key]
      if (colour === undefined) {
        throw new SpriteDecodeError(
          'unknown-key',
          `character "${key}" at row ${rowIndex}, column ${columnIndex} is not in the palette`
        )
      }
      return colour
    })
  )
  return { width, height: frame.length, pixels }
}

export const composeFrame = (base: SpriteFrame, overlay: SpriteFrame): SpriteFrame => {
  const baseWidth = assertRectangular(base)
  const overlayWidth = assertRectangular(overlay)
  if (base.length !== overlay.length || baseWidth !== overlayWidth) {
    throw new SpriteDecodeError(
      'ragged',
      `overlay is ${overlayWidth}x${overlay.length}, base is ${baseWidth}x${base.length}`
    )
  }
  return base.map((row, rowIndex) => {
    const overlayRow = overlay[rowIndex] ?? ''
    return Array.from(row, (key, columnIndex) => {
      const overlayKey = overlayRow[columnIndex]
      return overlayKey === undefined || overlayKey === TRANSPARENT_KEY ? key : overlayKey
    }).join('')
  })
}

export const flipFrame = (frame: SpriteFrame): SpriteFrame =>
  frame.map((row) => Array.from(row).reverse().join(''))

export const assertSpriteSize = (frame: SpriteFrame): void => {
  const width = assertRectangular(frame)
  if (width !== SPRITE_WIDTH || frame.length !== SPRITE_HEIGHT) {
    throw new SpriteDecodeError(
      'size',
      `frame is ${width}x${frame.length}, expected ${SPRITE_WIDTH}x${SPRITE_HEIGHT}`
    )
  }
}
