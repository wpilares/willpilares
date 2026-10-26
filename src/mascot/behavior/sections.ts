import { type MascotSide, parseMascotSide } from '../anchor'
import { OUTFIT_NAMES, type OutfitName } from '../art/outfits'
import { GESTURE_NAMES, type GestureName } from '../gestures'

export type SectionTarget = {
  readonly side: MascotSide
  readonly gesture: GestureName
  readonly outfit: OutfitName
  readonly element: Element
}

export type SectionEntry = {
  readonly target: Element
  readonly intersectionRatio: number
  readonly isIntersecting: boolean
}

const FALLBACK_GESTURE: GestureName = 'idle'
const FALLBACK_OUTFIT: OutfitName = 'default'

const isGestureName = (value: string): value is GestureName =>
  GESTURE_NAMES.some((name) => name === value)

const isOutfitName = (value: string): value is OutfitName =>
  OUTFIT_NAMES.some((name) => name === value)

const parseGesture = (value: string | null): GestureName =>
  value !== null && isGestureName(value) ? value : FALLBACK_GESTURE

const parseOutfit = (value: string | null): OutfitName =>
  value !== null && isOutfitName(value) ? value : FALLBACK_OUTFIT

export const readSectionTarget = (element: Element): SectionTarget => ({
  side: parseMascotSide(element.getAttribute('data-mascot')),
  gesture: parseGesture(element.getAttribute('data-mascot-gesture')),
  outfit: parseOutfit(element.getAttribute('data-mascot-outfit')),
  element,
})

export const pickActiveSection = (
  entries: ReadonlyArray<SectionEntry>,
  previous: Element | null
): Element | null => {
  const visible = entries.filter((entry) => entry.isIntersecting)
  if (visible.length === 0) return previous
  const bestRatio = Math.max(...visible.map((entry) => entry.intersectionRatio))
  const best = visible.filter((entry) => entry.intersectionRatio === bestRatio)
  const keepsPrevious = best.some((entry) => entry.target === previous)
  if (keepsPrevious) return previous
  return best[0]?.target ?? previous
}
