import { usePrefersReducedMotion } from '@hooks'
import { SceneLayer, useSceneIsStatic } from '@scenes'
import { type CSSProperties, useRef } from 'react'
import {
  BACKDROP_VERTICAL_TRAVEL,
  BACKDROP_WIDTH,
  backdropDepths,
  backdropRectToStage,
  CANDLE_FLAME_HEIGHT,
  CANDLE_FLAME_WICK_COLUMN,
  CANDLE_FLAME_WIDTH,
  layerBleed,
  prologueFlameRect,
  type StageRect,
} from './layout'
import { type CandleFlameFrame, useCandleFlame } from './useCandleFlame'
import { useElementSize } from './useElementSize'
import { useFlameFrame } from './useFlameFrame'

const flameDepth = backdropDepths.mid
const HALO_RADIUS = 18
const HALO_LIFT = 6

const haloBackground =
  'radial-gradient(circle, rgba(233, 223, 200, 0.22) 0%, rgba(176, 141, 87, 0.16) 28%, rgba(194, 69, 45, 0.08) 52%, transparent 72%)'

type FlameArtProps = {
  readonly rect: StageRect
  readonly frame: CandleFlameFrame
  readonly index: number
  readonly hidden: boolean
}

const FlameArt = ({ rect, frame, index, hidden }: FlameArtProps) => {
  const pixel = rect.width / CANDLE_FLAME_WIDTH
  const centreX = rect.x + (CANDLE_FLAME_WICK_COLUMN + 0.5) * pixel
  const centreY = rect.y + (CANDLE_FLAME_HEIGHT - HALO_LIFT) * pixel
  const radius = HALO_RADIUS * pixel
  const visibility: CSSProperties['visibility'] = hidden ? 'hidden' : 'visible'
  return (
    <>
      <div
        data-candle-halo
        className="absolute rounded-full"
        style={{
          left: centreX - radius,
          top: centreY - radius,
          width: radius * 2,
          height: radius * 2,
          backgroundImage: haloBackground,
          mixBlendMode: 'screen',
          opacity: frame.glow,
          visibility,
        }}
      />
      <img
        src={frame.src}
        alt=""
        aria-hidden="true"
        draggable={false}
        data-candle-flame-frame={index}
        className="absolute max-w-none"
        style={{
          left: rect.x,
          top: rect.y,
          width: rect.width,
          height: rect.height,
          imageRendering: 'pixelated',
          visibility,
        }}
      />
    </>
  )
}

export const CandleFlame = () => {
  const frames = useCandleFlame()
  const isStatic = useSceneIsStatic()
  const prefersReducedMotion = usePrefersReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const stage = useElementSize(stageRef)
  const index = useFlameFrame(frames?.length ?? 0, stageRef, !prefersReducedMotion)
  const bleed = isStatic ? 0 : layerBleed(flameDepth)
  const rect = backdropRectToStage(prologueFlameRect, stage, BACKDROP_WIDTH, bleed)
  const frame = frames?.[index]
  const art = frame ? (
    <FlameArt rect={rect} frame={frame} index={index} hidden={stage.width === 0} />
  ) : null

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      data-candle-flame
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {isStatic ? (
        art
      ) : (
        <SceneLayer depth={flameDepth} travel={BACKDROP_VERTICAL_TRAVEL}>
          {art}
        </SceneLayer>
      )}
    </div>
  )
}
