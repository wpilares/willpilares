import { SceneReveal, segment, useRevealGate, useSceneStage } from '@scenes'
import { useMotionValueEvent, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { SkillPlate, SkillShelf } from '@/constants'
import {
  pinnedSpineRange,
  type ShelfPlacement,
  type SpineShape,
  spineShape,
  staticSpineRange,
} from './bookGeometry'
import { bookMargins, SkillBook } from './SkillBook'

export type ShelfTiming = {
  readonly start: number
  readonly end: number
  readonly exitStart: number
  readonly exitEnd: number
}

const SLIDE_DISTANCE = 72
const BOOK_WINDOW_SHARE = 0.5
const ROW_HEADROOM = 24

const useBookReveal = (start: number, end: number, timing: ShelfTiming) => {
  const { progress } = useSceneStage()
  const visibility = (value: number) =>
    segment(value, start, end) * (1 - segment(value, timing.exitStart, timing.exitEnd))
  const opacity = useTransform(progress, visibility)
  const x = useTransform(progress, (value) => (1 - segment(value, start, end)) * SLIDE_DISTANCE)
  const gate = useRevealGate(visibility(progress.get()), false)
  useMotionValueEvent(progress, 'change', (value) => gate.update(visibility(value)))
  return { opacity, x, gate }
}

type ShelvedBookProps = {
  readonly skill: SkillPlate
  readonly shelf: SkillShelf
  readonly shape: SpineShape
  readonly start: number
  readonly end: number
  readonly timing: ShelfTiming
  readonly onLight: () => void
}

const ShelvedBook = ({ skill, shelf, shape, start, end, timing, onLight }: ShelvedBookProps) => {
  const { opacity, x, gate } = useBookReveal(start, end, timing)
  return (
    <li
      className="pointer-events-auto flex"
      style={bookMargins(shape)}
      aria-hidden={gate.hidden ? true : undefined}
    >
      <m.div ref={gate.ref} className="flex" style={{ opacity, x }}>
        <SkillBook skill={skill} category={shelf.key} shape={shape} onLight={onLight} />
      </m.div>
    </li>
  )
}

type PinnedShelfRowProps = {
  readonly shelf: SkillShelf
  readonly placement: ShelfPlacement
  readonly timing: ShelfTiming
  readonly onLight: () => void
}

export const PinnedShelfRow = ({ shelf, placement, timing, onLight }: PinnedShelfRowProps) => {
  const { t } = useTranslation()
  const headingId = useId()
  const range = pinnedSpineRange(placement.unit)
  const rowHeight = range.maxHeight + ROW_HEADROOM
  const span = timing.end - timing.start
  const bookWindow = span * BOOK_WINDOW_SHARE
  const stagger = shelf.skills.length > 1 ? (span - bookWindow) / (shelf.skills.length - 1) : 0
  const plaqueFont = Math.min(14, Math.max(10, placement.boardHeight * 0.46))

  return (
    <div data-shelf={shelf.key}>
      <div
        className="absolute flex items-center"
        style={{
          left: placement.plaqueLeft,
          top: placement.boardTop,
          height: placement.boardHeight,
        }}
      >
        <SceneReveal
          start={timing.start}
          end={timing.start + bookWindow}
          exitStart={timing.exitStart}
          exitEnd={timing.exitEnd}
        >
          <h3 id={headingId}>
            <span
              className="shelf-plaque"
              style={{ fontSize: plaqueFont, height: placement.boardHeight - 4 }}
            >
              {t(`journal.arms.categories.${shelf.key}`)}
            </span>
          </h3>
        </SceneReveal>
      </div>
      <ul
        aria-labelledby={headingId}
        data-shelf-row={shelf.key}
        className="absolute flex items-end gap-[3px]"
        style={{
          left: placement.left,
          width: placement.width,
          top: placement.boardTop - rowHeight,
          height: rowHeight,
        }}
      >
        {shelf.skills.map((skill, index) => {
          const start = timing.start + index * stagger
          return (
            <ShelvedBook
              key={skill.name}
              skill={skill}
              shelf={shelf}
              shape={spineShape(skill.name, range)}
              start={start}
              end={start + bookWindow}
              timing={timing}
              onLight={onLight}
            />
          )
        })}
      </ul>
    </div>
  )
}

export const StaticShelfRow = ({
  shelf,
  onLight,
}: {
  readonly shelf: SkillShelf
  readonly onLight: () => void
}) => {
  const { t } = useTranslation()
  const headingId = useId()
  return (
    <div data-shelf={shelf.key} className="flex flex-col items-start gap-3">
      <h3 id={headingId}>
        <span className="brass-plaque">{t(`journal.arms.categories.${shelf.key}`)}</span>
      </h3>
      <ul
        aria-labelledby={headingId}
        data-shelf-row={shelf.key}
        className="static-shelf flex w-full flex-wrap items-end gap-x-[3px] gap-y-5"
      >
        {shelf.skills.map((skill) => {
          const shape = spineShape(skill.name, staticSpineRange)
          return (
            <li key={skill.name} className="flex" style={bookMargins(shape)}>
              <SkillBook skill={skill} category={shelf.key} shape={shape} onLight={onLight} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
