import { useMotionValue, useScroll } from 'motion/react'
import { type ReactNode, useEffect, useMemo, useRef } from 'react'
import type { SceneMeta } from './registry'
import { type SceneStage, SceneStageContext, useSceneRegistry } from './SceneContext'
import { useStaticScenes } from './useStaticScenes'

export type SceneProgressMode = 'pinned' | 'exit'

type SceneProps = {
  meta: SceneMeta
  progressMode?: SceneProgressMode
  children: ReactNode
  className?: string
}

const pinnedStageClass = 'sticky top-0 h-svh overflow-hidden'
const staticStageClass = 'relative min-h-svh'
const exitStageClass = 'relative h-svh overflow-hidden'

type ScrollOffset = NonNullable<NonNullable<Parameters<typeof useScroll>[0]>['offset']>

const scrollOffsets: Readonly<Record<SceneProgressMode, ScrollOffset>> = {
  pinned: ['start start', 'end end'],
  exit: ['start start', 'end start'],
}

export const Scene = ({ meta, progressMode = 'pinned', children, className }: SceneProps) => {
  const sectionRef = useRef<HTMLElement>(null)
  const isStatic = useStaticScenes()
  const { register } = useSceneRegistry()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: scrollOffsets[progressMode],
  })
  const finalProgress = useMotionValue(1)
  const progress = isStatic ? finalProgress : scrollYProgress

  useEffect(() => register({ id: meta.id, progress }), [register, meta.id, progress])

  const stage = useMemo<SceneStage>(() => ({ progress, isStatic }), [progress, isStatic])

  return (
    <section
      ref={sectionRef}
      id={meta.anchor}
      data-mascot={meta.mascotSide}
      data-mascot-gesture={meta.mascotGesture}
      data-mascot-outfit={meta.mascotOutfit}
      data-scene={meta.id}
      style={isStatic ? undefined : { height: `${meta.lengthVh}svh` }}
      className={className ? `relative ${className}` : 'relative'}
    >
      <div
        data-scene-stage
        className={
          isStatic ? staticStageClass : progressMode === 'exit' ? exitStageClass : pinnedStageClass
        }
      >
        <SceneStageContext.Provider value={stage}>{children}</SceneStageContext.Provider>
      </div>
    </section>
  )
}
