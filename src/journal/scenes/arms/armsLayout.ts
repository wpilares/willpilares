import {
  ARMORY_VERTICAL_TRAVEL,
  bookcaseBounds,
  fitRectToStage,
  fittedRect,
  parallaxReach,
  type StageFit,
  type StageRect,
  type StageSize,
} from '@backdrops/layout'

export const BESIDE_TOP_INSET = 24
export const ABOVE_TOP_INSET = 24
export const HEADING_GAP = 24
export const BESIDE_HEADING_TOP_SHARE = 0.1

export type HeadingPlacement = 'beside' | 'above'

export type ArmsLayoutInput = {
  readonly stage: StageSize
  readonly reserve: number
  readonly margin: number
  readonly heading: StageSize
  readonly depth: number
}

export type ArmsLayout = {
  readonly fit: StageFit
  readonly bookcase: StageRect
  readonly placement: HeadingPlacement
  readonly headingTop: number
  readonly headingMaxWidth: number
}

export const armsLayout = ({
  stage,
  reserve,
  margin,
  heading,
  depth,
}: ArmsLayoutInput): ArmsLayout => {
  const reach = parallaxReach(depth, ARMORY_VERTICAL_TRAVEL)
  const fitBelow = (top: number): StageFit =>
    fitRectToStage(bookcaseBounds, stage, {
      top: top + reach,
      right: 0,
      bottom: reserve + reach,
      left: 0,
    })
  const beside = fitBelow(BESIDE_TOP_INSET)
  const besideBookcase = fittedRect(bookcaseBounds, beside)
  const room = besideBookcase.x - margin - HEADING_GAP
  if (room >= heading.width) {
    return {
      fit: beside,
      bookcase: besideBookcase,
      placement: 'beside',
      headingTop: Math.round(stage.height * BESIDE_HEADING_TOP_SHARE),
      headingMaxWidth: room,
    }
  }
  const above = fitBelow(ABOVE_TOP_INSET + heading.height + HEADING_GAP)
  return {
    fit: above,
    bookcase: fittedRect(bookcaseBounds, above),
    placement: 'above',
    headingTop: ABOVE_TOP_INSET,
    headingMaxWidth: Math.max(0, stage.width - 2 * margin),
  }
}
