import { type Palette, SPRITE_HEIGHT, SPRITE_WIDTH, type SpriteFrame } from './sprite'

export const placeholderPalette: Palette = {
  o: '#0b0b0c',
  f: '#2261e9',
}

export const placeholderFrame = (fillKey = 'f', outlineKey = 'o'): SpriteFrame => {
  const edgeRow = outlineKey.repeat(SPRITE_WIDTH)
  const innerRow = `${outlineKey}${fillKey.repeat(SPRITE_WIDTH - 2)}${outlineKey}`
  return Array.from({ length: SPRITE_HEIGHT }, (_, rowIndex) =>
    rowIndex === 0 || rowIndex === SPRITE_HEIGHT - 1 ? edgeRow : innerRow
  )
}
