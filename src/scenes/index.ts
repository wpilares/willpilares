export { FogVeil } from './FogVeil'
export { activeSceneIndex, fogOpacity, parallaxOffset, segment } from './progress'
export type {
  ChapterMeta,
  ChapterNumeral,
  SceneId,
  SceneMascotSide,
  SceneMeta,
} from './registry'
export { chapters, sceneById, scenes } from './registry'
export { Scene } from './Scene'
export type { SceneEntry, SceneStage } from './SceneContext'
export { useSceneIsStatic, useSceneProgress } from './SceneContext'
export { SceneLayer } from './SceneLayer'
export { SceneProvider } from './SceneProvider'
export { SceneReveal } from './SceneReveal'
export { useActiveScene } from './useActiveScene'
export { useStaticScenes } from './useStaticScenes'
