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

export const layerWidth = (id: BackdropId, layer: BackdropLayerName): number =>
  isPanoramaLayer(id, layer) ? PANORAMA_WIDTH : BACKDROP_WIDTH

export const panoramaOverflow = (containerWidth: number, containerHeight: number): number =>
  Math.max(0, Math.round((containerHeight * PANORAMA_WIDTH) / BACKDROP_HEIGHT - containerWidth))

export const BACKDROP_VERTICAL_TRAVEL = 120

export const layerBleed = (depth: number): number =>
  Math.ceil((BACKDROP_VERTICAL_TRAVEL * depth) / 2)

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

export const galleryFrameCentres: readonly number[] = [240, 400, 560, 720]

export const labMirrorRect: StageRect = { x: 56, y: 36, width: 108, height: 84 }

export const belfryMoon = { x: 160, y: 38, radius: 26 } as const

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
