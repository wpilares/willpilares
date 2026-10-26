import {
  backdropRectToStage,
  PANORAMA_WIDTH,
  panoramaOverflow,
  type StageSize,
} from '@backdrops/layout'
import { segment } from '@scenes'

export const GALLERY_PAN_START = 0.1
export const GALLERY_PAN_END = 0.9

export const galleryPanProgress = (progress: number): number =>
  segment(progress, GALLERY_PAN_START, GALLERY_PAN_END)

export const panShift = (panProgress: number, overflow: number): number => {
  const shift = overflow / 2 - overflow * panProgress
  return shift === 0 ? 0 : shift
}

export const centredProgress = (
  stageX: number,
  stageWidth: number,
  overflow: number
): number | null => {
  if (overflow <= 0) return null
  const panProgress = (stageX + overflow / 2 - stageWidth / 2) / overflow
  if (panProgress < 0 || panProgress > 1) return null
  return GALLERY_PAN_START + panProgress * (GALLERY_PAN_END - GALLERY_PAN_START)
}

export const frameCentredProgress = (centre: number, stage: StageSize): number | null => {
  const point = backdropRectToStage({ x: centre, y: 0, width: 0, height: 0 }, stage, PANORAMA_WIDTH)
  return centredProgress(point.x, stage.width, panoramaOverflow(stage.width, stage.height))
}

export type HorizontalSpan = {
  readonly left: number
  readonly right: number
}

export const visibleShare = ({ left, right }: HorizontalSpan, stageWidth: number): number => {
  const width = right - left
  if (width <= 0) return 0
  const shown = Math.min(right, stageWidth) - Math.max(left, 0)
  return Math.max(0, shown) / width
}
