import {
  armoryCoreRect,
  BOOKCASE_BOARD_THICKNESS,
  type BookcaseShelf,
  bookcaseFrame,
  fittedRect,
  type StageFit,
} from '@backdrops/layout'

export type SpineRange = {
  readonly minHeight: number
  readonly maxHeight: number
  readonly minWidth: number
  readonly maxWidth: number
}

export type SpineLean = -1 | 0 | 1

export type SpineShape = {
  readonly height: number
  readonly width: number
  readonly lean: SpineLean
  readonly shade: number
  readonly fontSize: number
  readonly medallion: boolean
}

export const MIN_SPINE_FONT = 7
export const MEDALLION_FONT_FLOOR = 8
export const MAX_SPINE_FONT = 14
export const READABLE_SPINE_FONT = 11
export const SPINE_TRACKING = 0.08
export const LEAN_DEGREES = 2
export const MEDALLION_RATIO = 0.56
export const SPINE_PADDING = 24
export const BARE_SPINE_PADDING = 21

const PINNED_HEIGHT_UNITS = [23, 27.2] as const
const PINNED_WIDTH_UNITS = [6.6, 8.6] as const
const LEAN_EVERY = 6

export const pinnedSpineRange = (unit: number): SpineRange => ({
  minHeight: PINNED_HEIGHT_UNITS[0] * unit,
  maxHeight: PINNED_HEIGHT_UNITS[1] * unit,
  minWidth: PINNED_WIDTH_UNITS[0] * unit,
  maxWidth: PINNED_WIDTH_UNITS[1] * unit,
})

export const staticSpineRange: SpineRange = {
  minHeight: 100,
  maxHeight: 130,
  minWidth: 34,
  maxWidth: 46,
}

export const skillHash = (name: string): number => {
  let value = 2166136261
  for (const character of name) {
    value = Math.imul(value ^ (character.codePointAt(0) ?? 0), 16777619) >>> 0
  }
  return value
}

const unitFrom = (hash: number, shift: number): number => ((hash >>> shift) & 0xff) / 0xff

const mix = (from: number, to: number, amount: number): number => from + (to - from) * amount

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

export const medallionSize = (width: number): number => Math.round(width * MEDALLION_RATIO)

export const spineReserve = (width: number): number => medallionSize(width) + SPINE_PADDING

const WIDE_CAPITALS = new Set(['M', 'W'])
const ROUND_CAPITALS = new Set(['A', 'C', 'D', 'G', 'H', 'N', 'O', 'Q', 'U', 'V'])
const NARROW_GLYPHS = new Set(['I', 'J', '.', '/', ' ', '-'])

const capitalEms = (character: string): number => {
  if (WIDE_CAPITALS.has(character)) return 1.05
  if (ROUND_CAPITALS.has(character)) return 0.82
  if (NARROW_GLYPHS.has(character)) return 0.4
  return 0.72
}

export const letteringEms = (name: string): number =>
  [...name.toUpperCase()].reduce(
    (total, character) => total + capitalEms(character) + SPINE_TRACKING,
    0
  )

const leanFrom = (hash: number): SpineLean => {
  if ((hash >>> 24) % LEAN_EVERY !== 0) return 0
  return (hash >>> 3) % 2 === 0 ? -1 : 1
}

export const spineShape = (name: string, range: SpineRange): SpineShape => {
  const hash = skillHash(name)
  const width = mix(range.minWidth, range.maxWidth, unitFrom(hash, 8))
  const reserve = spineReserve(width)
  const readableHeight = reserve + letteringEms(name) * READABLE_SPINE_FONT
  const height = clamp(
    Math.max(mix(range.minHeight, range.maxHeight, unitFrom(hash, 0)), readableHeight),
    range.minHeight,
    range.maxHeight
  )
  const ems = letteringEms(name)
  const medallion = (height - reserve) / ems >= MEDALLION_FONT_FLOOR
  const fitted = (height - (medallion ? reserve : BARE_SPINE_PADDING)) / ems
  const fontSize = clamp(Math.min(fitted, width * 0.36), MIN_SPINE_FONT, MAX_SPINE_FONT)
  return { height, width, lean: leanFrom(hash), shade: (hash >>> 16) % 2, fontSize, medallion }
}

export const leanAllowance = (shape: SpineShape): number =>
  shape.lean === 0 ? 0 : Math.ceil(shape.height * Math.sin((LEAN_DEGREES * Math.PI) / 180))

export type ShelfPlacement = {
  readonly left: number
  readonly width: number
  readonly boardTop: number
  readonly boardHeight: number
  readonly plaqueLeft: number
  readonly unit: number
}

export const shelfPlacement = (shelf: BookcaseShelf, fit: StageFit): ShelfPlacement => {
  const board = fittedRect(
    armoryCoreRect({
      x: shelf.left,
      y: shelf.boardTop,
      width: shelf.right - shelf.left,
      height: BOOKCASE_BOARD_THICKNESS,
    }),
    fit
  )
  const inner = fittedRect(
    armoryCoreRect({ x: bookcaseFrame.innerLeft + 2, y: 0, width: 0, height: 0 }),
    fit
  )
  return {
    left: board.x,
    width: board.width,
    boardTop: board.y,
    boardHeight: board.height,
    plaqueLeft: inner.x,
    unit: fit.scale,
  }
}
