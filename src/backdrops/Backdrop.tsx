import { SceneLayer, useSceneIsStatic } from '@scenes'
import type { MotionStyle } from 'motion/react'
import * as m from 'motion/react-m'
import { type CSSProperties, type ReactNode, useRef } from 'react'
import {
  type BackdropId,
  type BackdropLayerName,
  backdropDepths,
  backdropLayerNames,
  isPanoramaLayer,
  panoramaOverflow,
} from './layout'
import { useBackdrop } from './useBackdrop'
import { useElementSize } from './useElementSize'

type BackdropLayerStyles = Partial<Record<BackdropLayerName, MotionStyle>>

type BackdropProps = {
  readonly id: BackdropId
  readonly className?: string
  readonly layerStyles?: BackdropLayerStyles
}

const VERTICAL_TRAVEL = 120

const pixelated: CSSProperties = { imageRendering: 'pixelated' }

const panoramaImageClass =
  'absolute top-0 left-1/2 h-full w-auto min-w-full max-w-none -translate-x-1/2 object-cover'

const bleedFor = (depth: number): number => Math.ceil((VERTICAL_TRAVEL * depth) / 2)

type LayerImageProps = {
  readonly src: string
  readonly className: string
  readonly style: CSSProperties
}

const LayerImage = ({ src, className, style }: LayerImageProps) => (
  <img src={src} alt="" aria-hidden="true" draggable={false} className={className} style={style} />
)

const StyledLayer = ({ style, children }: { style?: MotionStyle; children: ReactNode }) =>
  style ? (
    <m.div className="absolute inset-0" style={style}>
      {children}
    </m.div>
  ) : (
    children
  )

export const Backdrop = ({ id, className, layerStyles }: BackdropProps) => {
  const urls = useBackdrop(id)
  const isStatic = useSceneIsStatic()
  const stageRef = useRef<HTMLDivElement>(null)
  const { width, height } = useElementSize(stageRef)
  const overflow = panoramaOverflow(width, height)

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden bg-night ${className ?? ''}`.trim()}
      data-backdrop={id}
    >
      {urls &&
        backdropLayerNames.map((layer) => {
          const depth = backdropDepths[layer]
          const panorama = isPanoramaLayer(id, layer)
          if (isStatic) {
            return (
              <div key={layer} data-backdrop-layer={layer} className="absolute inset-0">
                <LayerImage
                  src={urls[layer]}
                  className={
                    panorama ? panoramaImageClass : 'absolute inset-0 h-full w-full object-cover'
                  }
                  style={pixelated}
                />
              </div>
            )
          }
          if (panorama) {
            return (
              <SceneLayer key={layer} depth={depth} axis="x" travel={overflow / depth}>
                <StyledLayer style={layerStyles?.[layer]}>
                  <LayerImage src={urls[layer]} className={panoramaImageClass} style={pixelated} />
                </StyledLayer>
              </SceneLayer>
            )
          }
          const bleed = bleedFor(depth)
          return (
            <SceneLayer key={layer} depth={depth} travel={VERTICAL_TRAVEL}>
              <StyledLayer style={layerStyles?.[layer]}>
                <LayerImage
                  src={urls[layer]}
                  className="absolute inset-x-0 w-full object-cover"
                  style={{ ...pixelated, top: -bleed, height: `calc(100% + ${bleed * 2}px)` }}
                />
              </StyledLayer>
            </SceneLayer>
          )
        })}
    </div>
  )
}
