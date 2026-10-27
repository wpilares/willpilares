import { Backdrop } from '@backdrops'
import { useCountUp, useIntersectionObserver } from '@hooks'
import { FogVeil, Scene, SceneReveal, sceneById, segment, useSceneStage } from '@scenes'
import { useMotionValueEvent, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { type HeroStat, heroStats } from '@/constants'
import { GlyphTitle } from '../glyphs'
import { TallyMarks } from './TallyMarks'

const hunterMeta = sceneById('hunter')

const STATS_START = 0.7
const EXIT_START = 0.88

const noteKeys = ['journal.hunter.notes.one', 'journal.hunter.notes.two'] as const

const JournalPage = () => {
  const { t } = useTranslation()
  return (
    <article className="journal-page iron-frame -rotate-1 px-7 py-8 md:px-10 md:py-10">
      <header className="flex items-baseline gap-4">
        <span aria-hidden="true" className="chapter-numeral text-blood">
          I
        </span>
        <GlyphTitle id="hunter" as="h2" size="var(--glyph-title)" className="text-night" />
      </header>
      <p className="mt-5 text-2xl leading-snug font-semibold md:text-[1.7rem]">
        {t('journal.hunter.statement')}
      </p>
      <p className="mt-4 text-lg leading-relaxed text-night/85">
        {t('journal.hunter.description')}
      </p>
    </article>
  )
}

const HandwrittenNote = ({ i18nKey }: { i18nKey: (typeof noteKeys)[number] }) => (
  <p className="bg-night/55 px-5 py-4 font-fell text-xl leading-snug text-parchment italic shadow-[0_0_30px_rgba(11,10,15,0.6)] md:text-2xl">
    <Trans i18nKey={i18nKey} components={{ accent: <span className="text-ember" /> }} />
  </p>
)

type StatTallyProps = {
  readonly stat: HeroStat
  readonly start: boolean
}

const StatTally = ({ stat, start }: StatTallyProps) => {
  const { t } = useTranslation()
  const value = useCountUp(stat.value, { start })
  return (
    <li className="flex flex-col gap-2">
      <TallyMarks count={stat.value} className="text-parchment-dim" />
      <span className="font-fell text-3xl text-parchment tabular-nums">
        {value}
        {stat.suffix}
      </span>
      <span className="fell-label">{t(`journal.hunter.stats.${stat.key}`)}</span>
    </li>
  )
}

const Tallies = ({ reached }: { reached: boolean }) => {
  const [ref, visible] = useIntersectionObserver<HTMLUListElement>({ threshold: 0.3 })
  return (
    <ul ref={ref} className="grid grid-cols-2 gap-x-8 gap-y-6 bg-night/50 px-5 py-5 md:grid-cols-4">
      {heroStats.map((stat) => (
        <StatTally key={stat.key} stat={stat} start={visible && reached} />
      ))}
    </ul>
  )
}

const useReached = (threshold: number): boolean => {
  const { progress, isStatic } = useSceneStage()
  const [reached, setReached] = useState(() => isStatic || progress.get() >= threshold)

  useEffect(() => {
    if (isStatic || progress.get() >= threshold) setReached(true)
  }, [isStatic, progress, threshold])

  useMotionValueEvent(progress, 'change', (value) => {
    if (value >= threshold) setReached(true)
  })

  return reached
}

const DoorExit = () => {
  const { progress } = useSceneStage()
  const opacity = useTransform(progress, (value) => segment(value, EXIT_START, 1))
  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-night"
      style={{ opacity }}
    />
  )
}

const PinnedHunter = () => {
  const { progress } = useSceneStage()
  const reached = useReached(STATS_START)
  const nearScale = useTransform(progress, (value) => 1 + 0.14 * segment(value, EXIT_START, 1))
  const midScale = useTransform(progress, (value) => 1 + 0.06 * segment(value, EXIT_START, 1))

  return (
    <>
      <Backdrop
        id="street"
        layerStyles={{
          mid: { scale: midScale, transformOrigin: '62% 60%' },
          near: { scale: nearScale, transformOrigin: '62% 60%' },
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-3/5 bg-gradient-to-r from-night/70 to-transparent"
      />
      <div className="absolute inset-x-0 top-[12svh] bottom-[max(16svh,var(--cat-reserve))] px-[var(--margin)]">
        <SceneReveal
          start={0.05}
          end={0.25}
          exitStart={0.84}
          exitEnd={0.94}
          className="absolute top-0 left-[var(--margin)] w-[min(46vw,40rem)]"
        >
          <JournalPage />
        </SceneReveal>
        <div className="absolute top-[4svh] right-[calc(var(--margin)+4.5rem)] flex w-[min(38vw,30rem)] flex-col gap-5">
          <SceneReveal start={0.3} end={0.45} exitStart={0.84} exitEnd={0.94}>
            <HandwrittenNote i18nKey={noteKeys[0]} />
          </SceneReveal>
          <SceneReveal start={0.5} end={0.65} exitStart={0.84} exitEnd={0.94}>
            <HandwrittenNote i18nKey={noteKeys[1]} />
          </SceneReveal>
        </div>
        <SceneReveal
          start={STATS_START}
          end={0.85}
          exitStart={0.88}
          exitEnd={0.96}
          className="absolute right-[calc(var(--margin)+4.5rem)] bottom-0 w-[min(44vw,40rem)]"
        >
          <Tallies reached={reached} />
        </SceneReveal>
      </div>
      <FogVeil />
      <DoorExit />
    </>
  )
}

const StaticHunter = () => (
  <>
    <Backdrop id="street" />
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-night/70" />
    <div className="relative mx-auto flex max-w-[48rem] flex-col gap-8 px-[var(--margin)] pt-[12svh] pb-[20svh]">
      <JournalPage />
      {noteKeys.map((key) => (
        <HandwrittenNote key={key} i18nKey={key} />
      ))}
      <Tallies reached />
    </div>
  </>
)

const HunterStage = () => {
  const { isStatic } = useSceneStage()
  return isStatic ? <StaticHunter /> : <PinnedHunter />
}

export const Hunter = () => {
  if (!hunterMeta) return null
  return (
    <Scene meta={hunterMeta} className="bg-night">
      <HunterStage />
    </Scene>
  )
}
