import { useEffect, useState } from 'react'
import { activeSceneIndex } from './progress'
import { type SceneId, scenes } from './registry'
import { useSceneRegistry } from './SceneContext'

const fallbackScene: SceneId = scenes[0]?.id ?? 'prologue'

export const useActiveScene = (): SceneId => {
  const { entries } = useSceneRegistry()
  const [active, setActive] = useState<SceneId>(fallbackScene)

  useEffect(() => {
    const read = () => {
      const index = activeSceneIndex(entries.map((entry) => entry.progress.get()))
      setActive(entries[index]?.id ?? fallbackScene)
    }
    read()
    const unsubscribers = entries.map((entry) => entry.progress.on('change', read))
    return () => {
      for (const unsubscribe of unsubscribers) unsubscribe()
    }
  }, [entries])

  return active
}
