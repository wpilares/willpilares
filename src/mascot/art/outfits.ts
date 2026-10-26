import { createGestureSet, GESTURE_NAMES, type GestureName, type GestureSet } from '../gestures'
import { composeFrame, type Palette, type SpriteFrame } from '../sprite'
import { paint } from './canvas'
import { type Pose, poses } from './frames'
import {
  brassGoggles,
  gogglesStrap,
  type HeadwearPiece,
  hunterHat,
  placeHeadwear,
  roundSpectacles,
} from './headwear'
import { basePalette } from './palettes'

export type OutfitName = 'hunter' | 'inventor' | 'scholar'

export type OutfitOverlays = Readonly<Record<GestureName, readonly SpriteFrame[]>>

export type Outfit = {
  readonly name: OutfitName
  readonly palette: Palette
  readonly overlays: OutfitOverlays
}

export const OUTFIT_NAMES: readonly OutfitName[] = ['hunter', 'inventor', 'scholar']

export const DEFAULT_OUTFIT: OutfitName = 'hunter'

const dress = (pose: Pose, pieces: readonly HeadwearPiece[]): SpriteFrame => {
  const shiftX = pose.shiftX ?? 0
  const outlined = pieces.filter((piece) => piece.outline)
  const flat = pieces.filter((piece) => !piece.outline)
  const toLayers = (group: readonly HeadwearPiece[]) =>
    group.flatMap((piece) => {
      const placed = placeHeadwear(piece, pose.head)
      return placed === null ? [] : [placed]
    })
  return paint(toLayers(outlined), { shiftX, after: toLayers(flat) })
}

const overlaysFor = (pieces: readonly HeadwearPiece[]): OutfitOverlays =>
  GESTURE_NAMES.reduce<Partial<Record<GestureName, readonly SpriteFrame[]>>>((set, name) => {
    set[name] = poses[name].map((pose) => dress(pose, pieces))
    return set
  }, {}) as OutfitOverlays

export const outfits: Readonly<Record<OutfitName, Outfit>> = {
  hunter: { name: 'hunter', palette: basePalette, overlays: overlaysFor([hunterHat]) },
  inventor: {
    name: 'inventor',
    palette: { ...basePalette, r: '#9a5b34' },
    overlays: overlaysFor([gogglesStrap, brassGoggles]),
  },
  scholar: {
    name: 'scholar',
    palette: { ...basePalette, c: '#1f2a24', d: '#141c18', r: '#b08d57' },
    overlays: overlaysFor([hunterHat, roundSpectacles]),
  },
}

export const applyOutfit = (gestures: GestureSet, outfit: Outfit): GestureSet =>
  createGestureSet((name) => {
    const definition = gestures[name]
    const overlays = outfit.overlays[name]
    return {
      ...definition,
      frames: definition.frames.map((frame, index) => {
        const overlay = overlays[index]
        return overlay === undefined ? frame : composeFrame(frame, overlay)
      }),
    }
  })
