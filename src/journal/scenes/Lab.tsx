import { BACKDROP_WIDTH, Backdrop, backdropDepths } from '@backdrops'
import {
  BACKDROP_VERTICAL_TRAVEL,
  backdropRectToStage,
  labMirrorRect,
  layerBleed,
  type StageRect,
} from '@backdrops/layout'
import { useElementSize } from '@backdrops/useElementSize'
import { FogVeil, Scene, SceneLayer, SceneReveal, sceneById, segment, useSceneStage } from '@scenes'
import { useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { useId, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { netpulseProject } from '@/constants'
import type { ProjectFact, ProjectLineKey } from '@/types'
import { GlyphTitle } from '../glyphs'
import { gaugeTicks, needleAngle } from './gauge'

const labMeta = sceneById('lab')

const SCREENSHOT_START = 0.05
const SCREENSHOT_END = 0.2
const LINES_START = 0.2
const LINES_END = 0.7
const CABLES_START = 0.3
const CABLES_END = 0.8
const NEEDLES_START = 0.6
const NEEDLES_END = 0.85
const FRAME_EDGE = 7
const COLUMN_GAP = 40

const mirrorDepth = backdropDepths.mid

const lineSpan = (LINES_END - LINES_START) / netpulseProject.lines.length

type TopologyNode = {
  readonly id: string
  readonly label: string
  readonly x: number
  readonly y: number
  readonly kind: 'switch' | 'host'
}

const topologyNodes: readonly TopologyNode[] = [
  { id: 's1', label: 's1', x: 240, y: 26, kind: 'switch' },
  { id: 's2', label: 's2', x: 120, y: 82, kind: 'switch' },
  { id: 's3', label: 's3', x: 360, y: 82, kind: 'switch' },
  { id: 'h1', label: '10.0.0.1', x: 60, y: 138, kind: 'host' },
  { id: 'h2', label: '10.0.0.2', x: 180, y: 138, kind: 'host' },
  { id: 'h3', label: '10.0.0.3', x: 300, y: 138, kind: 'host' },
  { id: 'h4', label: '10.0.0.4', x: 420, y: 138, kind: 'host' },
]

const topologyCables: readonly (readonly [string, string])[] = [
  ['s1', 's2'],
  ['s1', 's3'],
  ['s2', 'h1'],
  ['s2', 'h2'],
  ['s3', 'h3'],
  ['s3', 'h4'],
]

const cableSpan = (CABLES_END - CABLES_START) / topologyCables.length

const nodeById = (id: string): TopologyNode | undefined =>
  topologyNodes.find((node) => node.id === id)

const cablePath = (from: TopologyNode, to: TopologyNode): string => {
  const midX = (from.x + to.x) / 2
  const sagY = (from.y + to.y) / 2 + 12
  return `M ${from.x} ${from.y} Q ${midX} ${sagY} ${to.x} ${to.y}`
}

const LabHeading = () => (
  <header className="flex items-baseline gap-4">
    <span aria-hidden="true" className="chapter-numeral">
      IV
    </span>
    <GlyphTitle id="lab" as="h2" size="var(--glyph-title)" className="text-parchment" />
  </header>
)

const JournalLine = ({ line }: { line: ProjectLineKey }) => (
  <p className="font-fell text-lg leading-snug text-parchment italic">
    <Trans
      i18nKey={`journal.lab.lines.${line}`}
      components={{ accent: <span className="text-ember" /> }}
    />
  </p>
)

const MirrorGlass = () => {
  const { t } = useTranslation()
  const { screenshot } = netpulseProject
  return (
    <div className="relative h-full w-full overflow-hidden bg-night">
      <img
        src={screenshot.src}
        alt={screenshot.alt}
        title={t('journal.lab.name')}
        width={screenshot.width}
        height={screenshot.height}
        loading="lazy"
        className="h-full w-full object-cover object-top brightness-[0.82] sepia-[0.25]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(128deg, rgba(233, 223, 200, 0.24) 0%, rgba(233, 223, 200, 0.06) 28%, transparent 42%, transparent 70%, rgba(201, 214, 227, 0.1) 100%), radial-gradient(ellipse at center, transparent 55%, rgba(11, 10, 15, 0.55) 100%)',
        }}
      />
    </div>
  )
}

const Cable = ({ from, to, order }: { from: TopologyNode; to: TopologyNode; order: number }) => {
  const { progress } = useSceneStage()
  const start = CABLES_START + order * cableSpan
  const pathLength = useTransform(progress, (value) => segment(value, start, start + cableSpan))
  return (
    <m.path
      d={cablePath(from, to)}
      fill="none"
      stroke="#b87333"
      strokeWidth={3}
      strokeLinecap="round"
      style={{ pathLength }}
    />
  )
}

const Topology = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  return (
    <svg
      role="img"
      aria-label={t('journal.lab.topology')}
      viewBox="0 0 480 170"
      className={className}
      data-topology
    >
      {topologyCables.map(([fromId, toId], order) => {
        const from = nodeById(fromId)
        const to = nodeById(toId)
        if (!from || !to) return null
        return <Cable key={`${fromId}-${toId}`} from={from} to={to} order={order} />
      })}
      {topologyNodes.map((node) =>
        node.kind === 'switch' ? (
          <g key={node.id}>
            <rect
              x={node.x - 22}
              y={node.y - 12}
              width={44}
              height={24}
              rx={4}
              fill="#1c1a21"
              stroke="#b08d57"
              strokeWidth={2.5}
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className="fill-parchment font-fell"
              fontSize={15}
            >
              {node.label}
            </text>
          </g>
        ) : (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r={8} fill="#b08d57" stroke="#5c4024" strokeWidth={2} />
            <circle cx={node.x - 2} cy={node.y - 2} r={2.5} fill="#e9dfc8" opacity={0.7} />
            <text
              x={node.x}
              y={node.y + 26}
              textAnchor="middle"
              className="fill-parchment-dim font-fell"
              fontSize={15}
            >
              {node.label}
            </text>
          </g>
        )
      )}
    </svg>
  )
}

const Gauge = ({ fact }: { fact: ProjectFact }) => {
  const { t } = useTranslation()
  const { progress } = useSceneStage()
  const tarnishId = useId()
  const fraction = fact.reading / fact.dialMax
  const rotate = useTransform(progress, (value) =>
    needleAngle(fraction * segment(value, NEEDLES_START, NEEDLES_END))
  )
  return (
    <li className="flex flex-col items-center gap-1 text-center">
      <svg viewBox="0 0 100 100" aria-hidden="true" className="h-24 w-24">
        <circle cx={50} cy={50} r={46} fill="#5c4024" />
        <circle cx={50} cy={50} r={43} fill="none" stroke="#b08d57" strokeWidth={4} />
        <circle cx={50} cy={50} r={39} fill="#e9dfc8" />
        <circle cx={50} cy={50} r={39} fill={`url(#${tarnishId})`} />
        {gaugeTicks(fact.dialMax + 1).map((angle) => (
          <line
            key={angle}
            x1={50}
            y1={15}
            x2={50}
            y2={22}
            stroke="#0b0a0f"
            strokeWidth={2}
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
        <m.g style={{ rotate }}>
          <circle cx={50} cy={50} r={36} fill="transparent" />
          <polygon points="50,18 53,50 50,56 47,50" fill="#8b1e1e" />
        </m.g>
        <circle cx={50} cy={50} r={5} fill="#b08d57" stroke="#5c4024" strokeWidth={1.5} />
        <defs>
          <radialGradient id={tarnishId}>
            <stop offset="60%" stopColor="#b08d57" stopOpacity={0} />
            <stop offset="100%" stopColor="#5c4024" stopOpacity={0.45} />
          </radialGradient>
        </defs>
      </svg>
      <span className="font-fell text-2xl text-parchment tabular-nums">{fact.value}</span>
      <span className="fell-label max-w-[11rem] leading-tight">
        {t(`journal.lab.facts.${fact.labelKey}`)}
      </span>
    </li>
  )
}

const Gauges = () => {
  const { t } = useTranslation()
  return (
    <ul aria-label={t('journal.lab.gauges')} className="grid grid-cols-3 gap-4" data-gauges>
      {netpulseProject.facts.map((fact) => (
        <Gauge key={fact.labelKey} fact={fact} />
      ))}
    </ul>
  )
}

const LabFooter = () => {
  const { t } = useTranslation()
  const { stack, status, version, repoUrl } = netpulseProject
  return (
    <div className="flex flex-col gap-4">
      <ul aria-label={t('journal.lab.stack')} className="flex flex-wrap gap-2">
        {stack.map((tech) => (
          <li key={tech} className="engraved-plate text-sm">
            {tech}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-4">
        <span className="brass-plaque gap-2">
          <span aria-hidden="true" className="wax-dot" />
          {t(`journal.lab.status.${status}`)}
          <span className="text-parchment-dim">{version}</span>
        </span>
        <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="btn-seal">
          {t('journal.lab.viewCode')}
        </a>
      </div>
    </div>
  )
}

const ScreenshotInMirror = ({ mirror }: { mirror: StageRect }) => {
  const { progress } = useSceneStage()
  const opacity = useTransform(progress, (value) =>
    segment(value, SCREENSHOT_START, SCREENSHOT_END)
  )
  return (
    <SceneLayer depth={mirrorDepth} travel={BACKDROP_VERTICAL_TRAVEL}>
      <m.div
        className="absolute"
        style={{
          left: mirror.x,
          top: mirror.y,
          width: mirror.width,
          height: mirror.height,
          opacity,
        }}
      >
        <MirrorGlass />
      </m.div>
    </SceneLayer>
  )
}

const PinnedLab = () => {
  const stageRef = useRef<HTMLDivElement>(null)
  const stage = useElementSize(stageRef)
  const bleed = layerBleed(mirrorDepth)
  const mirror = backdropRectToStage(labMirrorRect, stage, BACKDROP_WIDTH, bleed)
  const frameRight = backdropRectToStage(
    { x: labMirrorRect.x + labMirrorRect.width + FRAME_EDGE, y: 0, width: 0, height: 0 },
    stage,
    BACKDROP_WIDTH,
    bleed
  )
  const columnLeft = Math.max(frameRight.x + COLUMN_GAP, stage.width * 0.5)

  return (
    <div ref={stageRef} className="absolute inset-0">
      <Backdrop id="lab" />
      {stage.width > 0 && <ScreenshotInMirror mirror={mirror} />}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-[58%] bg-gradient-to-l from-night/90 via-night/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[30svh] bg-gradient-to-t from-night/90 to-transparent"
      />
      <div
        className="absolute top-[7svh] right-[calc(var(--margin)+4.5rem)] flex flex-col gap-4"
        style={{ left: columnLeft }}
      >
        <SceneReveal
          start={0}
          end={0.1}
          className="bg-night/70 shadow-[0_0_36px_18px_rgba(11,10,15,0.7)]"
        >
          <LabHeading />
        </SceneReveal>
        <div className="flex flex-col gap-3">
          {netpulseProject.lines.map((line, order) => (
            <SceneReveal
              key={line}
              start={LINES_START + order * lineSpan}
              end={LINES_START + (order + 1) * lineSpan}
            >
              <JournalLine line={line} />
            </SceneReveal>
          ))}
        </div>
        <SceneReveal start={0.55} end={0.62}>
          <Gauges />
        </SceneReveal>
      </div>
      <div className="absolute inset-x-0 bottom-[4svh] flex items-end gap-8 pr-[calc(var(--margin)+10rem)] pl-[var(--margin)]">
        <SceneReveal start={0.7} end={0.8} className="w-[min(40vw,34rem)] shrink-0">
          <LabFooter />
        </SceneReveal>
        <Topology className="h-auto w-[min(30vw,26rem)]" />
      </div>
      <FogVeil />
    </div>
  )
}

const StaticLab = () => {
  const { screenshot } = netpulseProject
  return (
    <>
      <Backdrop id="lab" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-night/80" />
      <div className="relative mx-auto flex max-w-[48rem] flex-col gap-8 px-[var(--margin)] pt-[12svh] pb-[20svh]">
        <LabHeading />
        <div
          className="w-full border-[6px] border-gold shadow-[0_0_0_2px_#0b0a0f,0_0_0_4px_rgba(184,115,51,0.6),0_18px_40px_rgba(0,0,0,0.6)]"
          style={{ aspectRatio: `${screenshot.width} / ${screenshot.height}` }}
        >
          <MirrorGlass />
        </div>
        <div className="flex flex-col gap-3">
          {netpulseProject.lines.map((line) => (
            <JournalLine key={line} line={line} />
          ))}
        </div>
        <Gauges />
        <Topology className="h-auto w-full max-w-[30rem] self-center" />
        <LabFooter />
      </div>
    </>
  )
}

const LabStage = () => {
  const { isStatic } = useSceneStage()
  return isStatic ? <StaticLab /> : <PinnedLab />
}

export const Lab = () => {
  if (!labMeta) return null
  return (
    <Scene meta={labMeta} className="bg-night">
      <LabStage />
    </Scene>
  )
}
