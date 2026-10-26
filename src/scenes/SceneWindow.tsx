import { useTransform } from 'motion/react'
import { type ReactNode, useMemo } from 'react'
import { type SceneStage, SceneStageContext, useSceneStage } from './SceneContext'

type SceneWindowProps = {
  readonly map: (progress: number) => number
  readonly children: ReactNode
}

export const SceneWindow = ({ map, children }: SceneWindowProps) => {
  const { progress, isStatic } = useSceneStage()
  const windowed = useTransform(progress, map)
  const stage = useMemo<SceneStage>(() => ({ progress: windowed, isStatic }), [windowed, isStatic])
  return <SceneStageContext.Provider value={stage}>{children}</SceneStageContext.Provider>
}
