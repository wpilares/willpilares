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
