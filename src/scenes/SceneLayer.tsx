import { useSpring, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import type { ReactNode } from 'react'
import { parallaxOffset } from './progress'
import { useSceneProgress } from './SceneContext'

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
  const progress = useSceneProgress()
  const offset = useTransform(progress, (value) => parallaxOffset(value, depth, travel))
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
