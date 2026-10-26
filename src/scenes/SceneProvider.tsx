import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { scenes } from './registry'
import { type SceneEntry, type SceneRegistry, SceneRegistryContext } from './SceneContext'

type SceneProviderProps = {
  children: ReactNode
}

const storyOrder = (entry: SceneEntry): number => scenes.findIndex((scene) => scene.id === entry.id)

const byStoryOrder = (left: SceneEntry, right: SceneEntry): number =>
  storyOrder(left) - storyOrder(right)

export const SceneProvider = ({ children }: SceneProviderProps) => {
  const [entries, setEntries] = useState<readonly SceneEntry[]>([])

  const register = useCallback((entry: SceneEntry) => {
    setEntries((current) =>
      [...current.filter((item) => item.id !== entry.id), entry].sort(byStoryOrder)
    )
    return () => {
      setEntries((current) => current.filter((item) => item !== entry))
    }
  }, [])

  const value = useMemo<SceneRegistry>(() => ({ entries, register }), [entries, register])

  return <SceneRegistryContext.Provider value={value}>{children}</SceneRegistryContext.Provider>
}
