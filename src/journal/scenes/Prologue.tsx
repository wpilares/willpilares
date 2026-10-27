import { Backdrop, CandleFlame } from '@backdrops'
import { Scene, sceneById, segment, useSceneStage } from '@scenes'
import { useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { useTranslation } from 'react-i18next'
import { GlyphTitle } from '../glyphs'
import { PROLOGUE_INTRO_END, prologueProgress } from './prologueProgress'
import { useIntroProgress } from './useIntroProgress'

const INTRO_DURATION_MS = 2600

const prologueMeta = sceneById('prologue')

const PrologueStage = () => {
  const { t } = useTranslation()
  const { progress: exit, isStatic } = useSceneStage()
  const intro = useIntroProgress(PROLOGUE_INTRO_END, INTRO_DURATION_MS, !isStatic)
  const progress = useTransform(() => prologueProgress(intro.get(), exit.get()))
  const strokeProgress = useTransform(progress, (value) => (isStatic ? 1 : segment(value, 0, 0.6)))
  const fillProgress = useTransform(progress, (value) => (isStatic ? 1 : segment(value, 0.5, 0.8)))
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[16%] flex justify-center px-[var(--margin)]"
        data-prologue-ink
      >
        <GlyphTitle
          id="name"
          as="span"
          size="var(--glyph-prologue)"
          className="block max-w-full text-parchment"
          strokeProgress={strokeProgress}
          fillProgress={fillProgress}
        />
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
