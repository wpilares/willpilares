import { SceneLayer, useSceneIsStatic } from '@scenes'
import { type CSSProperties, useRef } from 'react'
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

type BackdropProps = {
  readonly id: BackdropId
  readonly className?: string
}

const VERTICAL_TRAVEL = 120

const pixelated: CSSProperties = { imageRendering: 'pixelated' }

const staticLayers: readonly BackdropLayerName[] = ['far', 'near']

const bleedFor = (depth: number): number => Math.ceil((VERTICAL_TRAVEL * depth) / 2)

export const Backdrop = ({ id, className }: BackdropProps) => {
  const urls = useBackdrop(id)
  const isStatic = useSceneIsStatic()
  const stageRef = useRef<HTMLDivElement>(null)
  const { width, height } = useElementSize(stageRef)
  const overflow = panoramaOverflow(width, height)
  const layers = isStatic ? staticLayers : backdropLayerNames

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden bg-night ${className ?? ''}`.trim()}
      data-backdrop={id}
    >
      {urls &&
        layers.map((layer) => {
          const depth = backdropDepths[layer]
          if (isPanoramaLayer(id, layer)) {
            return (
              <SceneLayer key={layer} depth={depth} axis="x" travel={overflow / depth}>
                <img
                  src={urls[layer]}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="absolute top-0 left-1/2 h-full w-auto min-w-full max-w-none -translate-x-1/2 object-cover"
                  style={pixelated}
                />
              </SceneLayer>
            )
          }
          const bleed = bleedFor(depth)
          return (
            <SceneLayer key={layer} depth={depth} travel={VERTICAL_TRAVEL}>
              <img
                src={urls[layer]}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="absolute inset-x-0 w-full object-cover"
                style={{ ...pixelated, top: -bleed, height: `calc(100% + ${bleed * 2}px)` }}
              />
            </SceneLayer>
          )
        })}
    </div>
  )
}
