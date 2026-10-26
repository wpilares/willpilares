import type { MascotEvent } from '@mascot'
import { chapters, sceneById } from '@scenes'

export type AnchorBand = {
  readonly anchor: string
  readonly top: number
  readonly bottom: number
}

export type RailState = {
  readonly visible: boolean
  readonly chapter: string | null
}

const prologueAnchor = sceneById('prologue')?.anchor ?? 'prologue'
const cityAnchor = sceneById('city')?.anchor ?? 'home'
const hiddenAnchors: readonly string[] = [prologueAnchor, cityAnchor]
const chapterAnchors: readonly string[] = chapters.map((chapter) => chapter.anchor)

export const activeAnchorAt = (bands: readonly AnchorBand[], line: number): string | null => {
  let active: string | null = null
  for (const band of bands) {
    if (band.top > line) break
    active = band.anchor
    if (line < band.bottom) return band.anchor
  }
  return active
}

export const railState = (
  activeAnchor: string | null,
  previousChapter: string | null
): RailState => {
  if (activeAnchor === null || hiddenAnchors.includes(activeAnchor)) {
    return { visible: false, chapter: null }
  }
  const chapter = chapterAnchors.includes(activeAnchor) ? activeAnchor : previousChapter
  return { visible: true, chapter }
}

export const travelEvent = (anchor: string): MascotEvent => ({ type: 'travel', anchor })
