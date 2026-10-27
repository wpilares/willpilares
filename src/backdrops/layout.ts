export type BackdropId =
  | 'prologue'
  | 'city'
  | 'street'
  | 'armory'
  | 'gallery'
  | 'lab'
  | 'archive'
  | 'belfry'

export type BackdropLayerName = 'far' | 'mid' | 'near'

export const BACKDROP_WIDTH = 320
export const BACKDROP_HEIGHT = 180
export const PANORAMA_WIDTH = 960

export const backdropLayerNames: readonly BackdropLayerName[] = ['far', 'mid', 'near']

export const backdropDepths: Readonly<Record<BackdropLayerName, number>> = {
  far: 0.15,
  mid: 0.4,
  near: 0.8,
}

const panoramaLayers: Readonly<Partial<Record<BackdropId, readonly BackdropLayerName[]>>> = {
  gallery: ['mid', 'near'],
}

export const isPanoramaLayer = (id: BackdropId, layer: BackdropLayerName): boolean =>
  panoramaLayers[id]?.includes(layer) ?? false

export const ARMORY_CANVAS = { width: 640, height: 300, coreX: 136, coreY: 40 } as const

export const layerWidth = (id: BackdropId, layer: BackdropLayerName): number => {
  if (id === 'armory') return ARMORY_CANVAS.width
  return isPanoramaLayer(id, layer) ? PANORAMA_WIDTH : BACKDROP_WIDTH
}

export const layerSize = (id: BackdropId, layer: BackdropLayerName): StageSize => ({
  width: layerWidth(id, layer),
  height: id === 'armory' ? ARMORY_CANVAS.height : BACKDROP_HEIGHT,
})

export const panoramaOverflow = (containerWidth: number, containerHeight: number): number =>
  Math.max(0, Math.round((containerHeight * PANORAMA_WIDTH) / BACKDROP_HEIGHT - containerWidth))

export const BACKDROP_VERTICAL_TRAVEL = 120

export const ARMORY_VERTICAL_TRAVEL = 40

export const parallaxReach = (depth: number, travel: number): number =>
  Math.ceil((travel * depth) / 2)

export const layerBleed = (depth: number): number => parallaxReach(depth, BACKDROP_VERTICAL_TRAVEL)

export type StageSize = { readonly width: number; readonly height: number }

export type StageRect = {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export const backdropScale = (stage: StageSize, sourceWidth: number, bleed = 0): number =>
  Math.max(stage.width / sourceWidth, (stage.height + 2 * bleed) / BACKDROP_HEIGHT)

export const backdropRectToStage = (
  rect: StageRect,
  stage: StageSize,
  sourceWidth: number,
  bleed = 0
): StageRect => {
  const scale = backdropScale(stage, sourceWidth, bleed)
  const originX = (stage.width - sourceWidth * scale) / 2
  const originY = (stage.height - BACKDROP_HEIGHT * scale) / 2
  return {
    x: originX + rect.x * scale,
    y: originY + rect.y * scale,
    width: rect.width * scale,
    height: rect.height * scale,
  }
}

export type StageInsets = {
  readonly top: number
  readonly right: number
  readonly bottom: number
  readonly left: number
}

export type StageFit = {
  readonly scale: number
  readonly x: number
  readonly y: number
}

export const fitRectToStage = (
  source: StageRect,
  stage: StageSize,
  insets: StageInsets
): StageFit => {
  const width = Math.max(0, stage.width - insets.left - insets.right)
  const height = Math.max(0, stage.height - insets.top - insets.bottom)
  const scale = Math.min(width / source.width, height / source.height)
  return {
    scale,
    x: insets.left + (width - source.width * scale) / 2 - source.x * scale,
    y: insets.top + (height - source.height * scale) / 2 - source.y * scale,
  }
}

export const fittedRect = (rect: StageRect, fit: StageFit): StageRect => ({
  x: fit.x + rect.x * fit.scale,
  y: fit.y + rect.y * fit.scale,
  width: rect.width * fit.scale,
  height: rect.height * fit.scale,
})

export const galleryFrameCentres: readonly number[] = [240, 400, 560, 720]

export const labMirrorRect: StageRect = { x: 56, y: 36, width: 108, height: 84 }

export const belfryMoon = { x: 160, y: 38, radius: 26 } as const

export const bookcaseFrame = {
  left: 118,
  right: 250,
  innerLeft: 124,
  innerRight: 244,
  innerTop: 9,
} as const

export const armoryCoreRect = (rect: StageRect): StageRect => ({
  ...rect,
  x: rect.x + ARMORY_CANVAS.coreX,
  y: rect.y + ARMORY_CANVAS.coreY,
})

export const BOOKCASE_CROWN_HEIGHT = 4
export const BOOKCASE_CROWN_OVERHANG = 5

export const bookcaseBounds: StageRect = armoryCoreRect({
  x: bookcaseFrame.left - BOOKCASE_CROWN_OVERHANG,
  y: -BOOKCASE_CROWN_HEIGHT,
  width: bookcaseFrame.right - bookcaseFrame.left + 2 * BOOKCASE_CROWN_OVERHANG,
  height: BACKDROP_HEIGHT + BOOKCASE_CROWN_HEIGHT,
})

export const BOOKCASE_COMPARTMENT_HEIGHT = 28
export const BOOKCASE_BOARD_THICKNESS = 5

export type BookcaseShelf = {
  readonly left: number
  readonly right: number
  readonly boardTop: number
}

const shelfRights: readonly number[] = [230, 234, 236, 236, 234]

export const bookcaseShelves: readonly BookcaseShelf[] = shelfRights.map((right, index) => ({
  left: bookcaseFrame.innerLeft + 7,
  right,
  boardTop:
    bookcaseFrame.innerTop +
    BOOKCASE_COMPARTMENT_HEIGHT +
    index * (BOOKCASE_COMPARTMENT_HEIGHT + BOOKCASE_BOARD_THICKNESS),
}))

export const PROLOGUE_CANDLE_X = 160
export const PROLOGUE_WAX_TOP = 106
export const PROLOGUE_WICK_TOP = PROLOGUE_WAX_TOP - 3

export const CANDLE_FLAME_FRAME_COUNT = 8
export const CANDLE_FLAME_WIDTH = 15
export const CANDLE_FLAME_HEIGHT = 24
export const CANDLE_FLAME_WICK_COLUMN = 7

export const prologueFlameRect: StageRect = {
  x: PROLOGUE_CANDLE_X - CANDLE_FLAME_WICK_COLUMN,
  y: PROLOGUE_WICK_TOP - CANDLE_FLAME_HEIGHT,
  width: CANDLE_FLAME_WIDTH,
  height: CANDLE_FLAME_HEIGHT,
}
