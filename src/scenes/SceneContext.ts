import { type MotionValue, motionValue } from 'motion/react'
import { createContext, useContext } from 'react'
import type { SceneId } from './registry'

export type SceneEntry = {
  readonly id: SceneId
  readonly progress: MotionValue<number>
}

export type SceneRegistry = {
  readonly entries: readonly SceneEntry[]
  readonly register: (entry: SceneEntry) => () => void
}

export type SceneStage = {
  readonly progress: MotionValue<number>
  readonly isStatic: boolean
}

const noopRegistry: SceneRegistry = {
  entries: [],
  register: () => () => undefined,
}

const finalStage: SceneStage = {
  progress: motionValue(1),
  isStatic: true,
}

export const SceneRegistryContext = createContext<SceneRegistry>(noopRegistry)

export const SceneStageContext = createContext<SceneStage>(finalStage)

export const useSceneRegistry = (): SceneRegistry => useContext(SceneRegistryContext)

export const useSceneStage = (): SceneStage => useContext(SceneStageContext)

export const useSceneProgress = (): MotionValue<number> => useSceneStage().progress

export const useSceneIsStatic = (): boolean => useSceneStage().isStatic
