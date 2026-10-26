import { Backdrop, CandleFlame } from '@backdrops'
import { Scene, sceneById, segment, useSceneStage } from '@scenes'
import { useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { useTranslation } from 'react-i18next'
import { OWNER_NAME } from '../identity'
import { PROLOGUE_INTRO_END, prologueProgress } from './prologueProgress'
import { useIntroProgress } from './useIntroProgress'

const INK_DASH = 1400
const INTRO_DURATION_MS = 2600
const VIEW_WIDTH = 1200
const VIEW_HEIGHT = 240

const prologueMeta = sceneById('prologue')

const PrologueStage = () => {
  const { t } = useTranslation()
  const { progress: exit, isStatic } = useSceneStage()
  const intro = useIntroProgress(PROLOGUE_INTRO_END, INTRO_DURATION_MS, !isStatic)
  const progress = useTransform(() => prologueProgress(intro.get(), exit.get()))
  const dashOffset = useTransform(progress, (value) =>
    isStatic ? 0 : INK_DASH * (1 - segment(value, 0, 0.6))
  )
  const fillOpacity = useTransform(progress, (value) => (isStatic ? 1 : segment(value, 0.5, 0.8)))
  const hintOpacity = useTransform(
    progress,
    (value) => segment(value, 0.2, 0.3) * (1 - segment(value, 0.8, 0.9))
  )

  return (
    <>
      <Backdrop id="prologue" />
      <CandleFlame />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-night"
      />
      <div className="pointer-events-none absolute inset-x-0 top-[16%] flex justify-center px-[var(--margin)]">
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="w-full max-w-[1100px] overflow-visible"
          data-prologue-ink
        >
          <m.text
            x={VIEW_WIDTH / 2}
            y={VIEW_HEIGHT * 0.72}
            textAnchor="middle"
            textLength={VIEW_WIDTH - 40}
            lengthAdjust="spacingAndGlyphs"
            className="fill-parchment stroke-parchment font-blackletter"
            fontSize={170}
            strokeWidth={2}
            strokeLinejoin="round"
            style={{
              strokeDasharray: INK_DASH,
              strokeDashoffset: dashOffset,
              fillOpacity,
            }}
          >
            {OWNER_NAME}
          </m.text>
        </svg>
      </div>
      {!isStatic && (
        <m.p
          className="fell-label absolute inset-x-0 top-[41%] text-center"
          style={{ opacity: hintOpacity }}
        >
          {t('journal.prologue.hint')}
        </m.p>
      )}
    </>
  )
}

export const Prologue = () => {
  if (!prologueMeta) return null
  return (
    <Scene meta={prologueMeta} progressMode="exit" className="bg-night">
      <PrologueStage />
    </Scene>
  )
}
