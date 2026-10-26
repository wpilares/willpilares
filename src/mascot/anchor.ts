export type MascotSide = 'hero' | 'left' | 'right' | 'badge' | 'outro'

export type MascotFacing = 'left' | 'right'

export type Viewport = {
  readonly width: number
  readonly height: number
}

export type AnchorInput = {
  readonly side: MascotSide
  readonly viewport: Viewport
  readonly spriteWidth: number
  readonly spriteHeight: number
  readonly margin: number
}

export type Anchor = {
  x: number
  y: number
  facing: MascotFacing
}

const MASCOT_SIDES: readonly MascotSide[] = ['hero', 'left', 'right', 'badge', 'outro']

const FALLBACK_SIDE: MascotSide = 'left'

const clampToCanvas = (value: number): number => Math.max(0, Math.round(value))

const isMascotSide = (value: string): value is MascotSide =>
  MASCOT_SIDES.some((side) => side === value)

export const parseMascotSide = (value: string | null | undefined): MascotSide =>
  value !== null && value !== undefined && isMascotSide(value) ? value : FALLBACK_SIDE

export const resolveAnchor = ({
  side,
  viewport,
  spriteWidth,
  spriteHeight,
  margin,
}: AnchorInput): Anchor => {
  const bottom = viewport.height - margin - spriteHeight
  const rightEdge = viewport.width - margin - spriteWidth
  const centre = (viewport.width - spriteWidth) / 2

  switch (side) {
    case 'hero':
    case 'outro':
      return { x: clampToCanvas(centre), y: clampToCanvas(bottom), facing: 'right' }
    case 'left':
      return { x: clampToCanvas(margin), y: clampToCanvas(bottom), facing: 'right' }
    case 'right':
      return { x: clampToCanvas(rightEdge), y: clampToCanvas(bottom), facing: 'left' }
    case 'badge':
      return { x: clampToCanvas(rightEdge), y: clampToCanvas(margin), facing: 'left' }
  }
}
