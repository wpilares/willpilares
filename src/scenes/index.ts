export { FogVeil } from './FogVeil'
export type { SceneCameraPath } from './progress'
export {
  activeSceneIndex,
  descentOffset,
  fogOpacity,
  parallaxOffset,
  segment,
} from './progress'
export type {
  ChapterMeta,
  ChapterNumeral,
  SceneId,
  SceneMascotSide,
  SceneMeta,
} from './registry'
export { chapters, sceneById, scenes } from './registry'
export type { SceneProgressMode } from './Scene'
export { Scene } from './Scene'
export { SceneCamera, useSceneCamera } from './SceneCamera'
export type { SceneEntry, SceneStage } from './SceneContext'
export { useSceneIsStatic, useSceneProgress, useSceneStage } from './SceneContext'
export { SceneLayer } from './SceneLayer'
export { SceneProvider } from './SceneProvider'
export { SceneReveal } from './SceneReveal'
export { useActiveScene } from './useActiveScene'
export { useStaticScenes } from './useStaticScenes'
