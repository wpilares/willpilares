import type { Layer, Part } from './canvas'
import type { HeadPlacement } from './frames'

export type HeadwearPiece = {
  readonly part: Part
  readonly dx: number
  readonly dy: number
  readonly outline: boolean
  readonly showsFromBehind: boolean
}

export const hunterHat: HeadwearPiece = {
  part: [
    '......kkk...',
    '.....kkkkk..',
    '.....kkkkk..',
    '....bbbbbbk.',
    '...kkkkkkkk.',
    'kkkkkkk.....',
  ],
  dx: -2,
  dy: -4,
  outline: true,
  showsFromBehind: true,
}

export const brassGoggles: HeadwearPiece = {
  part: ['..ooo.ooo..', '.olylolylo.', 'oolllollloo'],
  dx: 0,
  dy: 1,
  outline: false,
  showsFromBehind: false,
}

export const gogglesStrap: HeadwearPiece = {
  part: ['ooooooooooo', 'lllllllllll', 'ooooooooooo'],
  dx: 0,
  dy: 2,
  outline: false,
  showsFromBehind: true,
}

export const roundSpectacles: HeadwearPiece = {
  part: ['.oooo.oooo.', 'bo..obo..ob', '.o..o.o..o.', '..oo...oo..'],
  dx: 0,
  dy: 4,
  outline: false,
  showsFromBehind: false,
}

export const placeHeadwear = (piece: HeadwearPiece, head: HeadPlacement): Layer | null => {
  if (head.variant === 'back' && !piece.showsFromBehind) return null
  return { part: piece.part, x: head.x + piece.dx, y: head.y + piece.dy }
}
