import { Backdrop } from '@backdrops'
import { mascotBus } from '@mascot/react'
import { FogVeil, Scene, SceneReveal, sceneById, segment, useSceneStage } from '@scenes'
import { useTransform } from 'motion/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type SkillPlate, type SkillShelf, skillShelves } from '@/constants'
import { createThrottle } from './throttle'

const armsMeta = sceneById('arms')

const STRETCH_INTERVAL_MS = 3000
const SHELVES_START = 0.1
const SHELVES_END = 0.7
const EXIT_START = 0.88
const WINDOW_ORIGIN = '86% 40%'

const shelfSpan = (SHELVES_END - SHELVES_START) / skillShelves.length

const useLanternStretch = (): (() => void) =>
  useMemo(() => {
    const allow = createThrottle(STRETCH_INTERVAL_MS)
    return () => {
      if (allow()) mascotBus.emit({ type: 'gesture', name: 'stretch' })
    }
  }, [])

const ArmsHeading = () => {
  const { t } = useTranslation()
  return (
    <header className="flex items-baseline gap-4">
      <span aria-hidden="true" className="chapter-numeral">
        II
      </span>
      <h2 className="journal-title-sm text-parchment">{t('journal.chapters.arms.title')}</h2>
    </header>
  )
}

const EngravedPlate = ({ skill, onLight }: { skill: SkillPlate; onLight: () => void }) => (
  <li>
    <button type="button" className="engraved-plate" onPointerEnter={onLight} onFocus={onLight}>
      <img
        src={skill.iconUrl}
        alt=""
        width={18}
        height={18}
        loading="lazy"
        className="h-[18px] w-[18px] flex-shrink-0 object-contain"
      />
      <span>{skill.name}</span>
    </button>
  </li>
)

const Shelf = ({ shelf, onLight }: { shelf: SkillShelf; onLight: () => void }) => {
  const { t } = useTranslation()
  return (
    <div className="shelf-board grid gap-3 py-3 md:grid-cols-[14rem_1fr] md:items-center md:gap-6">
      <h3 className="justify-self-start">
        <span className="brass-plaque">{t(`journal.arms.categories.${shelf.key}`)}</span>
      </h3>
      <ul className="flex flex-wrap gap-2.5">
        {shelf.skills.map((skill) => (
          <EngravedPlate key={skill.name} skill={skill} onLight={onLight} />
        ))}
      </ul>
    </div>
  )
}

const PinnedArms = () => {
  const { progress } = useSceneStage()
  const onLight = useLanternStretch()
  const pan = (value: number) => segment(value, EXIT_START, 1)
  const farX = useTransform(progress, (value) => `${-1 * pan(value)}%`)
  const midX = useTransform(progress, (value) => `${-2 * pan(value)}%`)
  const nearX = useTransform(progress, (value) => `${-3 * pan(value)}%`)
  const farScale = useTransform(progress, (value) => 1 + 0.1 * pan(value))
  const midScale = useTransform(progress, (value) => 1 + 0.2 * pan(value))
  const nearScale = useTransform(progress, (value) => 1 + 0.3 * pan(value))

  return (
    <>
      <Backdrop
        id="armory"
        layerStyles={{
          far: { x: farX, scale: farScale, transformOrigin: WINDOW_ORIGIN },
          mid: { x: midX, scale: midScale, transformOrigin: WINDOW_ORIGIN },
          near: { x: nearX, scale: nearScale, transformOrigin: WINDOW_ORIGIN },
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-night/80 via-night/55 to-transparent"
      />
      <div className="absolute inset-x-0 top-[10svh] bottom-[max(8svh,var(--cat-reserve))] flex w-[min(74vw,64rem)] flex-col gap-6 px-[var(--margin)]">
        <SceneReveal start={0} end={0.1} exitStart={0.86} exitEnd={0.95}>
          <ArmsHeading />
        </SceneReveal>
        <div className="flex flex-col gap-3">
          {skillShelves.map((shelf, order) => (
            <SceneReveal
              key={shelf.key}
              start={SHELVES_START + order * shelfSpan}
              end={SHELVES_START + (order + 1) * shelfSpan}
              exitStart={0.86}
              exitEnd={0.95}
            >
              <Shelf shelf={shelf} onLight={onLight} />
            </SceneReveal>
          ))}
        </div>
      </div>
      <FogVeil />
    </>
  )
}

const StaticArms = () => {
  const onLight = useLanternStretch()
  return (
    <>
      <Backdrop id="armory" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-night/75" />
      <div className="relative mx-auto flex max-w-[64rem] flex-col gap-6 px-[var(--margin)] pt-[12svh] pb-[20svh]">
        <ArmsHeading />
        <div className="flex flex-col gap-4">
          {skillShelves.map((shelf) => (
            <Shelf key={shelf.key} shelf={shelf} onLight={onLight} />
          ))}
        </div>
      </div>
    </>
  )
}

const ArmsStage = () => {
  const { isStatic } = useSceneStage()
  return isStatic ? <StaticArms /> : <PinnedArms />
}

export const Arms = () => {
  if (!armsMeta) return null
  return (
    <Scene meta={armsMeta} className="bg-night">
      <ArmsStage />
    </Scene>
  )
}
