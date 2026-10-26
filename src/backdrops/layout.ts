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
