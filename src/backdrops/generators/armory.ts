import {
  BOOKCASE_BOARD_THICKNESS,
  type BookcaseShelf,
  bookcaseFrame,
  bookcaseShelves,
} from '../layout'
import { createPixelBuffer, type PixelBuffer } from '../painter'
import type { Rng } from '../prng'
import { candle, ditherFill, glow, HEIGHT, WIDTH } from './shared'
import type { BackdropLayers } from './types'

const FLOOR_Y = 152
const SCONCES = [104, 264] as const
const SCONCE_BASE = 68
const { left: FRAME_LEFT, right: FRAME_RIGHT, innerLeft, innerRight, innerTop } = bookcaseFrame
const POST_WIDTH = innerLeft - FRAME_LEFT
const lowestShelf = bookcaseShelves[bookcaseShelves.length - 1]
const PLINTH_TOP = (lowestShelf?.boardTop ?? HEIGHT - 14) + BOOKCASE_BOARD_THICKNESS

const planks = (far: PixelBuffer, rng: Rng) => {
  let x = 0
  while (x < WIDTH) {
    const width = rng.int(9, 13)
    far.fillRect(x, 0, width, FLOOR_Y, 'wood')
    far.line(x, 0, x, FLOOR_Y, 'night')
    far.line(x + 1, 0, x + 1, FLOOR_Y, 'woodLight')
    for (let knot = 0; knot < 5; knot += 1) {
      const knotX = x + rng.int(3, width - 2)
      const knotY = rng.int(4, FLOOR_Y - 6)
      far.line(knotX, knotY, knotX, knotY + rng.int(2, 6), rng.next() < 0.6 ? 'stone' : 'woodLight')
    }
    x += width
  }
  for (let row = 0; row < 20; row += 1) {
    ditherFill(far, 0, row, WIDTH, 1, 'night', Math.round(10 - row * 0.5))
  }
  ditherFill(far, 0, 20, WIDTH, FLOOR_Y - 20, 'night', 5)
}

const floor = (far: PixelBuffer) => {
  far.fillRect(0, FLOOR_Y - 6, WIDTH, 6, 'woodLight')
  far.fillRect(0, FLOOR_Y - 2, WIDTH, 2, 'night')
  let y = FLOOR_Y
  let height = 3
  while (y < HEIGHT) {
    far.fillRect(0, y, WIDTH, height, 'wood')
    far.line(0, y, WIDTH, y, 'woodLight')
    for (let x = (y * 7) % 37; x < WIDTH; x += 37) far.line(x, y, x, y + height - 1, 'night')
    y += height
    height += 1
  }
}

const paintFar = (rng: Rng): PixelBuffer => {
  const far = createPixelBuffer(WIDTH, HEIGHT)
  planks(far, rng)
  floor(far)
  return far
}

const backPanel = (mid: PixelBuffer, rng: Rng) => {
  const height = PLINTH_TOP - innerTop
  let x = innerLeft
  while (x < innerRight) {
    const width = Math.min(rng.int(8, 12), innerRight - x)
    mid.fillRect(x, innerTop, width, height, 'stone')
    mid.line(x, innerTop, x, PLINTH_TOP - 1, 'night')
    for (let grain = 0; grain < 7; grain += 1) {
      const grainX = x + rng.int(2, Math.max(2, width - 2))
      const grainY = rng.int(innerTop + 2, PLINTH_TOP - 8)
      mid.line(grainX, grainY, grainX, grainY + rng.int(3, 9), 'ash')
    }
    x += width
  }
  ditherFill(mid, innerLeft, innerTop, 4, height, 'night', 9)
  ditherFill(mid, innerRight - 4, innerTop, 4, height, 'night', 9)
}

const compartmentShade = (mid: PixelBuffer) => {
  let ceiling = innerTop
  for (const shelf of bookcaseShelves) {
    ditherFill(mid, innerLeft, ceiling, innerRight - innerLeft, 2, 'night', 12)
    ditherFill(mid, innerLeft, ceiling + 2, innerRight - innerLeft, 3, 'night', 6)
    ditherFill(mid, innerLeft, shelf.boardTop - 2, innerRight - innerLeft, 2, 'night', 4)
    ceiling = shelf.boardTop + BOOKCASE_BOARD_THICKNESS
  }
}

const board = (mid: PixelBuffer, rng: Rng, shelf: BookcaseShelf) => {
  const width = innerRight - innerLeft
  mid.fillRect(innerLeft, shelf.boardTop, width, 1, 'woodLight')
  mid.fillRect(innerLeft, shelf.boardTop + 1, width, BOOKCASE_BOARD_THICKNESS - 2, 'wood')
  mid.fillRect(innerLeft, shelf.boardTop + BOOKCASE_BOARD_THICKNESS - 1, width, 1, 'night')
  for (let grain = 0; grain < 6; grain += 1) {
    const grainX = rng.int(innerLeft + 2, innerRight - 12)
    mid.line(grainX, shelf.boardTop + 2, grainX + rng.int(4, 10), shelf.boardTop + 2, 'woodLight')
  }
}

const post = (mid: PixelBuffer, x: number, innerEdge: number) => {
  mid.fillRect(x, 0, POST_WIDTH, PLINTH_TOP, 'wood')
  mid.line(x, 0, x, PLINTH_TOP, 'night')
  mid.line(x + 1, 0, x + 1, PLINTH_TOP, 'woodLight')
  mid.line(innerEdge, 0, innerEdge, PLINTH_TOP, 'night')
  for (let y = 12; y < PLINTH_TOP; y += 23) mid.line(x + 3, y, x + 3, y + 6, 'woodLight')
}

const frame = (mid: PixelBuffer) => {
  post(mid, FRAME_LEFT, innerLeft - 1)
  post(mid, innerRight, innerRight)
  mid.fillRect(FRAME_LEFT - 3, 0, FRAME_RIGHT - FRAME_LEFT + 6, innerTop, 'wood')
  mid.line(FRAME_LEFT - 3, innerTop - 2, FRAME_RIGHT + 2, innerTop - 2, 'woodLight')
  mid.line(FRAME_LEFT - 3, innerTop - 1, FRAME_RIGHT + 2, innerTop - 1, 'night')
  mid.fillRect(
    FRAME_LEFT - 2,
    PLINTH_TOP,
    FRAME_RIGHT - FRAME_LEFT + 4,
    HEIGHT - PLINTH_TOP,
    'wood'
  )
  mid.line(FRAME_LEFT - 2, PLINTH_TOP, FRAME_RIGHT + 1, PLINTH_TOP, 'woodLight')
  mid.line(FRAME_LEFT - 2, PLINTH_TOP + 3, FRAME_RIGHT + 1, PLINTH_TOP + 3, 'night')
  ditherFill(mid, FRAME_RIGHT, innerTop, 5, HEIGHT - innerTop, 'night', 10)
  ditherFill(mid, FRAME_LEFT - 4, innerTop, 4, HEIGHT - innerTop, 'night', 6)
}

const bookend = (mid: PixelBuffer, x: number, boardTop: number, facing: -1 | 1) => {
  mid.fillRect(x, boardTop - 13, 2, 13, 'slate')
  mid.line(x, boardTop - 13, x, boardTop - 1, 'mist')
  const footX = facing === 1 ? x : x - 2
  mid.fillRect(footX, boardTop - 1, 4, 1, 'slate')
  mid.pixel(x + (facing === 1 ? 1 : 0), boardTop - 14, 'gold')
}

const globe = (mid: PixelBuffer, x: number, boardTop: number) => {
  const cx = x + 5
  const cy = boardTop - 10
  mid.fillRect(cx - 3, boardTop - 1, 7, 1, 'wood')
  mid.line(cx, boardTop - 4, cx, boardTop - 2, 'gold')
  mid.circle(cx, cy, 4, 'slate')
  mid.pixel(cx - 2, cy - 1, 'copper')
  mid.pixel(cx - 1, cy - 1, 'copper')
  mid.pixel(cx + 1, cy + 1, 'copper')
  mid.pixel(cx + 2, cy, 'copper')
  mid.pixel(cx - 1, cy - 3, 'mist')
  for (let row = -5; row <= 5; row += 1) {
    const reach = Math.round(Math.sqrt(Math.max(0, 25 - row * row)))
    mid.pixel(cx + reach, cy + row, 'gold')
  }
}

const hourglass = (mid: PixelBuffer, x: number, boardTop: number) => {
  const top = boardTop - 13
  mid.fillRect(x, top, 6, 1, 'wood')
  mid.fillRect(x, boardTop - 1, 6, 1, 'wood')
  mid.line(x, top + 1, x, boardTop - 2, 'woodLight')
  mid.line(x + 5, top + 1, x + 5, boardTop - 2, 'woodLight')
  for (let row = 0; row < 5; row += 1) {
    mid.line(
      x + 1 + Math.floor(row / 2),
      top + 1 + row,
      x + 4 - Math.floor(row / 2),
      top + 1 + row,
      'mist'
    )
    mid.line(
      x + 1 + Math.floor(row / 2),
      boardTop - 2 - row,
      x + 4 - Math.floor(row / 2),
      boardTop - 2 - row,
      row < 3 ? 'parchment' : 'mist'
    )
  }
  mid.pixel(x + 2, top + 6, 'parchment')
}

const candleStub = (mid: PixelBuffer, x: number, boardTop: number) => {
  mid.fillRect(x, boardTop - 1, 5, 1, 'gold')
  mid.pixel(x + 4, boardTop - 2, 'gold')
  candle(mid, x + 2, boardTop - 1, 4)
}

const shelfOrnaments = (mid: PixelBuffer, shelf: BookcaseShelf, index: number) => {
  bookend(mid, shelf.left - 4, shelf.boardTop, 1)
  const x = shelf.right + 2
  if (index === 0) globe(mid, x, shelf.boardTop)
  else if (index === 2) candleStub(mid, x + 1, shelf.boardTop)
  else if (index === 3) bookend(mid, x + 1, shelf.boardTop, -1)
  else hourglass(mid, x + 1, shelf.boardTop)
}

const sconce = (mid: PixelBuffer, x: number) => {
  mid.fillRect(x - 2, SCONCE_BASE - 8, 5, 9, 'gold')
  mid.fillRect(x - 1, SCONCE_BASE - 7, 3, 7, 'copper')
  mid.fillRect(x - 4, SCONCE_BASE, 9, 2, 'gold')
  candle(mid, x, SCONCE_BASE, 7)
}

const paintMid = (rng: Rng): PixelBuffer => {
  const mid = createPixelBuffer(WIDTH, HEIGHT)
  backPanel(mid, rng)
  compartmentShade(mid)
  bookcaseShelves.forEach((shelf, index) => {
    board(mid, rng, shelf)
    shelfOrnaments(mid, shelf, index)
  })
  frame(mid)
  for (const x of SCONCES) sconce(mid, x)
  return mid
}

const table = (near: PixelBuffer) => {
  near.fillRect(0, 164, 96, 16, 'wood')
  near.fillRect(0, 162, 98, 2, 'woodLight')
  near.fillRect(0, 166, 96, 1, 'night')
  near.fillRect(14, 155, 30, 7, 'parchment')
  near.line(29, 155, 29, 161, 'mist')
  near.line(17, 157, 26, 157, 'mist')
  near.line(32, 157, 41, 157, 'mist')
  near.line(17, 159, 24, 159, 'mist')
  near.fillRect(70, 150, 6, 12, 'blood')
  near.fillRect(71, 147, 4, 3, 'slate')
  near.pixel(71, 152, 'ember')
}

const paintNear = (rng: Rng): PixelBuffer => {
  const near = createPixelBuffer(WIDTH, HEIGHT)
  for (const x of SCONCES) {
    glow(near, x, SCONCE_BASE - 10, 26, 'copper', 3)
    glow(near, x, SCONCE_BASE - 10, 14, 'ember', 4)
    for (let mote = 0; mote < 10; mote += 1) {
      near.pixel(x + rng.int(-16, 16), SCONCE_BASE - 10 + rng.int(-18, 18), 'gold')
    }
  }
  table(near)
  return near
}

export const generateArmory = (rng: Rng): BackdropLayers => ({
  far: paintFar(rng),
  mid: paintMid(rng),
  near: paintNear(rng),
})
