import { Backdrop, backdropDepths } from '@backdrops'
import type { BackdropFit } from '@backdrops/Backdrop'
import { ARMORY_VERTICAL_TRAVEL, bookcaseShelves } from '@backdrops/layout'
import { useElementSize } from '@backdrops/useElementSize'
import { mascotBus } from '@mascot/react'
import { FogVeil, Scene, SceneLayer, SceneReveal, sceneById, segment, useSceneStage } from '@scenes'
import { type MotionStyle, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo, useRef } from 'react'
import { skillShelves } from '@/constants'
import { GlyphTitle } from '../glyphs'
import { armsLayout } from './arms/armsLayout'
import { shelfPlacement } from './arms/bookGeometry'
import { PinnedShelfRow, type ShelfTiming, StaticShelfRow } from './arms/ShelfRow'
import { createThrottle } from './throttle'

const armsMeta = sceneById('arms')

const STRETCH_INTERVAL_MS = 3000
const SHELVES_START = 0.1
const SHELVES_END = 0.7
const FADE_START = 0.86
const FADE_END = 0.95
const EXIT_START = 0.88
const WINDOW_ORIGIN = '86% 40%'
const shelfDepth = backdropDepths.mid

const shelfSpan = (SHELVES_END - SHELVES_START) / skillShelves.length

const shelfTiming = (order: number): ShelfTiming => ({
  start: SHELVES_START + order * shelfSpan,
  end: SHELVES_START + (order + 1) * shelfSpan,
  exitStart: FADE_START,
  exitEnd: FADE_END,
})

const useLanternStretch = (): (() => void) =>
  useMemo(() => {
    const allow = createThrottle(STRETCH_INTERVAL_MS)
    return () => {
      if (allow()) mascotBus.emit({ type: 'gesture', name: 'stretch' })
    }
  }, [])

type ExitStyles = {
  readonly far: MotionStyle
  readonly mid: MotionStyle
  readonly near: MotionStyle
}

const useExitPan = (): ExitStyles => {
  const { progress } = useSceneStage()
  const pan = (value: number) => segment(value, EXIT_START, 1)
  const farX = useTransform(progress, (value) => `${-1 * pan(value)}%`)
  const midX = useTransform(progress, (value) => `${-2 * pan(value)}%`)
  const nearX = useTransform(progress, (value) => `${-3 * pan(value)}%`)
  const farScale = useTransform(progress, (value) => 1 + 0.1 * pan(value))
  const midScale = useTransform(progress, (value) => 1 + 0.2 * pan(value))
  const nearScale = useTransform(progress, (value) => 1 + 0.3 * pan(value))
  return {
    far: { x: farX, scale: farScale, transformOrigin: WINDOW_ORIGIN },
    mid: { x: midX, scale: midScale, transformOrigin: WINDOW_ORIGIN },
    near: { x: nearX, scale: nearScale, transformOrigin: WINDOW_ORIGIN },
  }
}

const ArmsHeading = () => (
  <header className="flex items-baseline gap-4">
    <span aria-hidden="true" className="chapter-numeral">
      II
    </span>
    <GlyphTitle id="arms" as="h2" size="var(--glyph-title)" className="text-parchment" />
  </header>
)

const PinnedArms = () => {
  const stageRef = useRef<HTMLDivElement>(null)
  const insetRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const stage = useElementSize(stageRef)
  const inset = useElementSize(insetRef)
  const heading = useElementSize(headingRef)
  const onLight = useLanternStretch()
  const exit = useExitPan()
  const layout = armsLayout({
    stage,
    reserve: inset.height,
    margin: inset.width,
    heading,
    depth: shelfDepth,
  })
  const fit: BackdropFit = { ...layout.fit, travel: ARMORY_VERTICAL_TRAVEL }

  return (
    <div ref={stageRef} className="absolute inset-0" data-heading-placement={layout.placement}>
      <div
        ref={insetRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute bottom-0 left-0 h-[var(--cat-reserve)] w-[var(--margin)]"
      />
      <Backdrop id="armory" layerStyles={exit} fit={fit} />
      {layout.placement === 'beside' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-night/85 via-night/60 to-transparent"
          style={{ width: Math.max(0, layout.bookcase.x) }}
        />
      )}
      {stage.width > 0 && (
        <SceneLayer
          depth={shelfDepth}
          travel={ARMORY_VERTICAL_TRAVEL}
          className="pointer-events-none"
        >
          <m.div className="absolute inset-0" style={exit.mid} data-bookcase>
            {skillShelves.map((shelf, order) => {
              const board = bookcaseShelves[order]
              if (!board) return null
              return (
                <PinnedShelfRow
                  key={shelf.key}
                  shelf={shelf}
                  placement={shelfPlacement(board, layout.fit)}
                  timing={shelfTiming(order)}
                  onLight={onLight}
                />
              )
            })}
          </m.div>
        </SceneLayer>
      )}
      <div
        className="absolute left-[var(--margin)]"
        style={{ top: layout.headingTop, maxWidth: layout.headingMaxWidth }}
      >
        <SceneReveal start={0} end={0.1} exitStart={FADE_START} exitEnd={FADE_END}>
          <div ref={headingRef} className="w-max">
            <ArmsHeading />
          </div>
        </SceneReveal>
      </div>
      <FogVeil />
    </div>
  )
}

const StaticArms = () => {
  const onLight = useLanternStretch()
  return (
    <>
      <Backdrop id="armory" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-night/75" />
      <div className="relative mx-auto flex max-w-[64rem] flex-col gap-8 px-[var(--margin)] pt-[12svh] pb-[20svh]">
        <ArmsHeading />
        <div className="flex flex-col gap-8">
          {skillShelves.map((shelf) => (
            <StaticShelfRow key={shelf.key} shelf={shelf} onLight={onLight} />
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
