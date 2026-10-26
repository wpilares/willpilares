import { useMotionValueEvent, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import type { ReactNode } from 'react'
import { segment } from './progress'
import { useSceneStage } from './SceneContext'
import { useRevealGate } from './useRevealGate'

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

  const revealOpacity = (value: number) => {
    const entered = segment(value, start, end)
    if (!hasExit) return entered
    return entered * (1 - segment(value, exitStart, exitEnd))
  }
  const opacity = useTransform(progress, revealOpacity)
  const y = useTransform(progress, (value) => (1 - segment(value, start, end)) * liftDistance)
  const gate = useRevealGate(revealOpacity(progress.get()), isStatic)

  useMotionValueEvent(progress, 'change', (value) => gate.update(revealOpacity(value)))

  return (
    <m.div
      ref={gate.ref}
      className={className}
      style={{ opacity, y }}
      aria-hidden={gate.hidden ? true : undefined}
    >
      {children}
    </m.div>
  )
}
