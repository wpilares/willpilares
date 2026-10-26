import { createContext, type ReactNode, useContext, useMemo } from 'react'
import type { SceneCameraPath } from './progress'

type SceneCameraProps = SceneCameraPath & {
  readonly children: ReactNode
}

const SceneCameraContext = createContext<SceneCameraPath | null>(null)

export const useSceneCamera = (): SceneCameraPath | null => useContext(SceneCameraContext)

export const SceneCamera = ({ start, end, distance, minDepth, children }: SceneCameraProps) => {
  const path = useMemo<SceneCameraPath>(
    () => ({ start, end, distance, minDepth }),
    [start, end, distance, minDepth]
  )
  return <SceneCameraContext.Provider value={path}>{children}</SceneCameraContext.Provider>
}
