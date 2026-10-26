import { useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import type { ReactNode } from 'react'
import { segment } from './progress'
import { useSceneStage } from './SceneContext'

type SceneRevealProps = {
  start: number
  end: number
  exitStart?: number
  exitEnd?: number
  children: ReactNode
  className?: string
}

const liftDistance = 24

export const SceneReveal = ({
  start,
  end,
  exitStart,
  exitEnd,
  children,
  className,
}: SceneRevealProps) => {
  const { progress, isStatic } = useSceneStage()
  const hasExit = !isStatic && exitStart !== undefined && exitEnd !== undefined

  const opacity = useTransform(progress, (value) => {
    const entered = segment(value, start, end)
    if (!hasExit) return entered
    return entered * (1 - segment(value, exitStart, exitEnd))
  })
  const y = useTransform(progress, (value) => (1 - segment(value, start, end)) * liftDistance)

  return (
    <m.div className={className} style={{ opacity, y }}>
      {children}
    </m.div>
  )
}
