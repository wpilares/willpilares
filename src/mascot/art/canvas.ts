import { SPRITE_HEIGHT, SPRITE_WIDTH, type SpriteFrame, TRANSPARENT_KEY } from '../sprite'

export type Part = readonly string[]

export type Layer = {
  readonly part: Part
  readonly x: number
  readonly y: number
}

export type PaintOptions = {
  readonly outline?: boolean
  readonly after?: readonly Layer[]
  readonly shiftX?: number
}

const OUTLINE_KEY = 'o'

const NEIGHBOURS: ReadonlyArray<readonly [number, number]> = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
]

type Grid = string[][]

const blank = (): Grid =>
  Array.from({ length: SPRITE_HEIGHT }, () =>
    Array.from({ length: SPRITE_WIDTH }, () => TRANSPARENT_KEY)
  )

const inside = (x: number, y: number) => x >= 0 && x < SPRITE_WIDTH && y >= 0 && y < SPRITE_HEIGHT

const stamp = (grid: Grid, { part, x, y }: Layer, shiftX: number) => {
  part.forEach((row, rowIndex) => {
    Array.from(row).forEach((key, columnIndex) => {
      const targetX = x + columnIndex + shiftX
      const targetY = y + rowIndex
      if (key === TRANSPARENT_KEY || !inside(targetX, targetY)) return
      const targetRow = grid[targetY]
      if (targetRow !== undefined) targetRow[targetX] = key
    })
  })
}

const isFilled = (grid: Grid, x: number, y: number) =>
  inside(x, y) && (grid[y]?.[x] ?? TRANSPARENT_KEY) !== TRANSPARENT_KEY

const outlined = (grid: Grid): Grid =>
  grid.map((row, y) =>
    row.map((key, x) => {
      if (key !== TRANSPARENT_KEY) return key
      return NEIGHBOURS.some(([dx, dy]) => isFilled(grid, x + dx, y + dy)) ? OUTLINE_KEY : key
    })
  )

export const paint = (layers: readonly Layer[], options: PaintOptions = {}): SpriteFrame => {
  const { outline = true, after = [], shiftX = 0 } = options
  const grid = blank()
  for (const layer of layers) stamp(grid, layer, shiftX)
  const result = outline ? outlined(grid) : grid
  for (const layer of after) stamp(result, layer, shiftX)
  return result.map((row) => row.join(''))
}
