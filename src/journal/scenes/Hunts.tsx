import { Backdrop, backdropDepths, panoramaOverflow } from '@backdrops'
import {
  backdropRectToStage,
  galleryFrameCentres,
  PANORAMA_WIDTH,
  type StageSize,
} from '@backdrops/layout'
import { useElementSize } from '@backdrops/useElementSize'
import {
  FogVeil,
  Scene,
  SceneLayer,
  SceneReveal,
  SceneWindow,
  sceneById,
  useRevealGate,
  useSceneStage,
} from '@scenes'
import { splitMetrics } from '@utils'
import { useMotionValueEvent } from 'motion/react'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { CompanyData, ExperienceData } from '@/types'
import data from '../../../data.json'
import { galleryPanProgress, visibleShare } from './galleryPan'

const huntsMeta = sceneById('hunts')

const { companies }: ExperienceData = data

const CANVAS_HALF_WIDTH = 31
const CANVAS_TOP = 47
const CANVAS_HEIGHT = 54
const FRAME_BOTTOM = 112

type HuntRecord = {
  readonly company: CompanyData
  readonly centre: number
  readonly isCurrent: boolean
}

const huntRecords: readonly HuntRecord[] = companies
  .slice(0, galleryFrameCentres.length)
  .map((company, order) => ({
    company,
    centre: galleryFrameCentres[order] ?? 0,
    isCurrent: order === 0,
  }))

const toStringList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const useHuntCopy = (company: CompanyData) => {
  const { t } = useTranslation()
  const prefix = `experience.companies.${company.key}`
  return {
    period: t(`${prefix}.period`),
    position: t(`${prefix}.position`),
    descriptions: toStringList(t(`${prefix}.descriptions`, { returnObjects: true })),
  }
}

const HighlightedText = ({ text }: { text: string }) => (
  <>
    {splitMetrics(text).map((part) =>
      part.isMetric ? (
        <strong key={part.offset} className="font-semibold text-ember">
          {part.value}
        </strong>
      ) : (
        <span key={part.offset}>{part.value}</span>
      )
    )}
  </>
)

const HuntsHeading = () => {
  const { t } = useTranslation()
  return (
    <header className="flex items-baseline gap-4">
      <span aria-hidden="true" className="chapter-numeral">
        III
      </span>
      <h2 className="journal-title-sm text-parchment">{t('journal.chapters.hunts.title')}</h2>
    </header>
  )
}

const Candle = () => (
  <span aria-hidden="true" className="absolute -top-2 -right-2 flex flex-col items-center">
    <span className="h-4 w-2.5 animate-flicker rounded-[50%_50%_45%_45%] bg-[#f2c46b] shadow-[0_0_18px_6px_rgba(242,196,107,0.55)]" />
    <span className="h-7 w-3 bg-parchment shadow-[inset_-2px_0_0_rgba(0,0,0,0.25)]" />
    <span className="h-1.5 w-6 rounded-sm bg-gold" />
  </span>
)

const CurrentRibbon = () => {
  const { t } = useTranslation()
  return (
    <span className="absolute top-3 -left-2 bg-blood px-3 py-1 font-fell text-sm uppercase tracking-[0.16em] text-parchment shadow-[2px_3px_0_rgba(0,0,0,0.45)]">
      {t('journal.hunts.current')}
    </span>
  )
}

const Portrait = ({ record }: { record: HuntRecord }) => (
  <div
    data-portrait={record.company.key}
    className="relative flex h-full w-full items-center justify-center bg-ash"
    style={{
      backgroundImage:
        'radial-gradient(ellipse at 50% 46%, rgba(233, 223, 200, 0.34), rgba(176, 141, 87, 0.16) 38%, transparent 66%), radial-gradient(ellipse at center, transparent 45%, rgba(11, 10, 15, 0.85) 100%)',
    }}
  >
    <span className="flex h-[62%] w-[72%] items-center justify-center rounded-[50%] bg-parchment/90 px-[12%] py-[8%] shadow-[inset_0_0_24px_rgba(92,64,36,0.55),0_0_0_3px_rgba(176,141,87,0.7),0_10px_24px_rgba(0,0,0,0.6)]">
      <img
        src={`/${record.company.image}`}
        alt=""
        width={96}
        height={96}
        loading="lazy"
        className="max-h-full w-full object-contain"
      />
    </span>
    {record.isCurrent && (
      <>
        <CurrentRibbon />
        <Candle />
      </>
    )}
  </div>
)

type PlaqueDensity = 'pinned' | 'static'

type PlaqueProps = {
  readonly record: HuntRecord
  readonly density: PlaqueDensity
}

const plaqueStyles: Readonly<
  Record<PlaqueDensity, { bullets: number; frame: string; title: string }>
> = {
  pinned: { bullets: 0, frame: 'px-4 py-3', title: 'text-2xl' },
  static: { bullets: 2, frame: 'px-5 py-4', title: 'text-3xl' },
}

const BulletList = ({ items }: { items: readonly string[] }) => (
  <ul className="mt-3 flex flex-col gap-2 text-lg leading-snug">
    {items.map((description) => (
      <li key={description}>
        <HighlightedText text={description} />
      </li>
    ))}
  </ul>
)

const RecordDialog = ({ record }: { record: HuntRecord }) => {
  const { t } = useTranslation()
  const { period, position, descriptions } = useHuntCopy(record.company)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const titleId = `hunt-record-${record.company.key}`

  const open = () => dialogRef.current?.showModal()
  const close = () => dialogRef.current?.close()
  const restoreFocus = () => triggerRef.current?.focus()

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        className="mt-3 font-fell text-base text-gold underline decoration-gold/40 underline-offset-4 hover:text-parchment"
      >
        {t('journal.hunts.readMore')}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={restoreFocus}
        className="iron-frame fixed inset-0 m-auto h-fit max-h-[80svh] w-[min(92vw,40rem)] overflow-y-auto bg-parchment px-7 py-6 text-night backdrop:bg-night/80"
      >
        <p className="font-fell text-base tracking-[0.06em] text-night/70">{period}</p>
        <h3 id={titleId} className="mt-1 font-serif text-3xl font-semibold tracking-[0.02em]">
          {record.company.company}
        </h3>
        <p className="mt-2 font-fell text-lg text-blood">{position}</p>
        <BulletList items={descriptions} />
        <button type="button" onClick={close} className="btn-seal mt-6">
          {t('journal.hunts.closeRecord')}
        </button>
      </dialog>
    </>
  )
}

const Plaque = ({ record, density }: PlaqueProps) => {
  const { period, position, descriptions } = useHuntCopy(record.company)
  const { bullets: visibleBullets, frame, title } = plaqueStyles[density]
  return (
    <article
      className={`iron-frame w-full max-w-[24rem] border border-gold/50 bg-night/85 text-parchment ${frame}`}
    >
      <p className="font-fell text-base tracking-[0.06em] text-parchment-dim">{period}</p>
      <h3 className={`mt-1 font-serif font-semibold tracking-[0.02em] text-parchment ${title}`}>
        {record.company.company}
      </h3>
      <p className="mt-2 font-fell text-lg text-gold">{position}</p>
      {visibleBullets > 0 && <BulletList items={descriptions.slice(0, visibleBullets)} />}
      {descriptions.length > visibleBullets && <RecordDialog record={record} />}
    </article>
  )
}

const usePlaqueGate = (stage: StageSize) => {
  const { progress } = useSceneStage()
  const gate = useRevealGate(1, false)
  const { ref, update } = gate

  const measure = useCallback(() => {
    window.requestAnimationFrame(() => {
      const element = ref.current
      if (element !== null) update(visibleShare(element.getBoundingClientRect(), window.innerWidth))
    })
  }, [ref, update])

  useMotionValueEvent(progress, 'change', measure)

  useEffect(() => {
    if (stage.width > 0) measure()
  }, [stage.width, measure])

  return gate
}

const HangingHunt = ({ record, stage }: { record: HuntRecord; stage: StageSize }) => {
  const canvas = backdropRectToStage(
    {
      x: record.centre - CANVAS_HALF_WIDTH,
      y: CANVAS_TOP,
      width: CANVAS_HALF_WIDTH * 2,
      height: CANVAS_HEIGHT,
    },
    stage,
    PANORAMA_WIDTH
  )
  const plaqueTop = backdropRectToStage(
    { x: record.centre, y: FRAME_BOTTOM, width: 0, height: 0 },
    stage,
    PANORAMA_WIDTH
  )
  const gate = usePlaqueGate(stage)
  return (
    <li>
      <div
        className="absolute"
        style={{ left: canvas.x, top: canvas.y, width: canvas.width, height: canvas.height }}
      >
        <Portrait record={record} />
      </div>
      <div
        ref={gate.ref}
        aria-hidden={gate.hidden ? true : undefined}
        className="absolute flex w-[25rem] -translate-x-1/2 justify-center overflow-y-auto p-1"
        style={{
          left: plaqueTop.x,
          top: plaqueTop.y,
          maxHeight: `calc(${Math.max(0, stage.height - plaqueTop.y)}px - var(--cat-reserve))`,
        }}
      >
        <Plaque record={record} density="pinned" />
      </div>
    </li>
  )
}

const PinnedHunts = () => {
  const stageRef = useRef<HTMLDivElement>(null)
  const stage = useElementSize(stageRef)
  const overflow = panoramaOverflow(stage.width, stage.height)
  const depth = backdropDepths.mid

  return (
    <div ref={stageRef} className="absolute inset-0">
      <SceneWindow map={galleryPanProgress}>
        <Backdrop id="gallery" />
        {stage.width > 0 && (
          <SceneLayer depth={depth} axis="x" travel={overflow / depth}>
            <ol data-hunt-gallery>
              {huntRecords.map((record) => (
                <HangingHunt key={record.company.key} record={record} stage={stage} />
              ))}
            </ol>
          </SceneLayer>
        )}
      </SceneWindow>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[24svh] bg-gradient-to-b from-night/85 to-transparent"
      />
      <SceneReveal start={0} end={0.08} className="absolute top-[7svh] left-[var(--margin)]">
        <HuntsHeading />
      </SceneReveal>
      <FogVeil />
    </div>
  )
}

const StaticHunts = () => (
  <>
    <Backdrop id="gallery" />
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-night/75" />
    <div className="relative mx-auto flex max-w-[48rem] flex-col gap-10 px-[var(--margin)] pt-[12svh] pb-[20svh]">
      <HuntsHeading />
      <ol className="flex flex-col gap-12">
        {huntRecords.map((record) => (
          <li key={record.company.key} className="flex flex-col items-center gap-5">
            <div className="aspect-[31/27] w-full max-w-[18rem] border-[6px] border-gold shadow-[0_0_0_2px_#0b0a0f,0_0_0_4px_rgba(176,141,87,0.5),0_18px_40px_rgba(0,0,0,0.6)]">
              <Portrait record={record} />
            </div>
            <Plaque record={record} density="static" />
          </li>
        ))}
      </ol>
    </div>
  </>
)

const HuntsStage = () => {
  const { isStatic } = useSceneStage()
  return isStatic ? <StaticHunts /> : <PinnedHunts />
}

export const Hunts = () => {
  if (!huntsMeta) return null
  return (
    <Scene meta={huntsMeta} className="bg-night">
      <HuntsStage />
    </Scene>
  )
}
