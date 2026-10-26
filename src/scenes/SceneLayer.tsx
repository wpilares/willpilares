import { useSpring, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import type { ReactNode } from 'react'
import { descentOffset, parallaxOffset } from './progress'
import { useSceneCamera } from './SceneCamera'
import { useSceneStage } from './SceneContext'

type SceneLayerProps = {
  depth: number
  travel?: number
  axis?: 'x' | 'y'
  children: ReactNode
  className?: string
}

const layerSpring = { stiffness: 160, damping: 32, mass: 0.4 }

export const SceneLayer = ({
  depth,
  travel = 120,
  axis = 'y',
  children,
  className,
}: SceneLayerProps) => {
  const { progress, isStatic } = useSceneStage()
  const camera = useSceneCamera()
  const offset = useTransform(progress, (value) => {
    const parallax = parallaxOffset(value, depth, travel)
    if (camera === null || isStatic || axis === 'x') return parallax
    return parallax + descentOffset(value, depth, camera)
  })
  const smoothOffset = useSpring(offset, layerSpring)

  return (
    <m.div
      className={className ? `absolute inset-0 ${className}` : 'absolute inset-0'}
      style={axis === 'x' ? { x: smoothOffset } : { y: smoothOffset }}
    >
      {children}
    </m.div>
  )
}
