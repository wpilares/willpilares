import { useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import type { CSSProperties } from 'react'
import { fogOpacity } from './progress'
import { useSceneStage } from './SceneContext'

type FogVeilProps = {
  edge?: number
  className?: string
}

const veilStyle: CSSProperties = {
  backgroundImage: [
    'radial-gradient(ellipse 80% 60% at 50% 55%, rgba(201, 214, 227, 0.16), transparent 70%)',
    'linear-gradient(180deg, rgba(233, 223, 200, 0.05) 0%, rgba(11, 10, 15, 0.9) 100%)',
  ].join(', '),
}

const driftStyle: CSSProperties = {
  backgroundImage: [
    'radial-gradient(ellipse 30% 18% at 20% 40%, rgba(233, 223, 200, 0.08), transparent 70%)',
    'radial-gradient(ellipse 26% 14% at 70% 65%, rgba(201, 214, 227, 0.1), transparent 70%)',
  ].join(', '),
  backgroundSize: '50% 100%',
  backgroundRepeat: 'repeat-x',
}

export const FogVeil = ({ edge = 0.15, className }: FogVeilProps) => {
  const { progress, isStatic } = useSceneStage()
  const opacity = useTransform(progress, (value) => fogOpacity(value, edge))

  if (isStatic) return null

  return (
    <m.div
      aria-hidden
      data-fog-veil
      className={
        className
          ? `pointer-events-none absolute inset-0 overflow-hidden ${className}`
          : 'pointer-events-none absolute inset-0 overflow-hidden'
      }
      style={{ ...veilStyle, opacity }}
    >
      <div className="absolute inset-y-0 left-0 w-[200%] animate-fog-drift" style={driftStyle} />
    </m.div>
  )
}
