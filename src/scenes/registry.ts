import type { GestureName, OutfitName } from '@mascot'

export type SceneId =
  | 'prologue'
  | 'city'
  | 'hunter'
  | 'arms'
  | 'hunts'
  | 'lab'
  | 'archive'
  | 'raven'
  | 'epilogue'

export type ChapterNumeral = 'I' | 'II' | 'III' | 'IV' | 'V'

export type SceneMascotSide = 'hero' | 'left' | 'right' | 'badge' | 'outro'

export type SceneMeta = {
  id: SceneId
  anchor: string
  chapter?: ChapterNumeral
  titleKey?: string
  lengthVh: number
  mascotSide: SceneMascotSide
  mascotGesture: GestureName
  mascotOutfit: OutfitName
}

export type ChapterMeta = {
  id: SceneId
  chapter: ChapterNumeral
  anchor: string
  titleKey: string
}

const titleKeyFor = (id: SceneId): string => `journal.chapters.${id}.title`

export const scenes: readonly SceneMeta[] = [
  {
    id: 'prologue',
    anchor: 'prologue',
    lengthVh: 100,
    mascotSide: 'hero',
    mascotGesture: 'sit',
    mascotOutfit: 'hunter',
  },
  {
    id: 'city',
    anchor: 'home',
    lengthVh: 200,
    mascotSide: 'hero',
    mascotGesture: 'sit',
    mascotOutfit: 'hunter',
  },
  {
    id: 'hunter',
    anchor: 'about',
    chapter: 'I',
    titleKey: titleKeyFor('hunter'),
    lengthVh: 220,
    mascotSide: 'left',
    mascotGesture: 'lick',
    mascotOutfit: 'hunter',
  },
  {
    id: 'arms',
    anchor: 'skills',
    chapter: 'II',
    titleKey: titleKeyFor('arms'),
    lengthVh: 220,
    mascotSide: 'right',
    mascotGesture: 'stretch',
    mascotOutfit: 'hunter',
  },
  {
    id: 'hunts',
    anchor: 'experience',
    chapter: 'III',
    titleKey: titleKeyFor('hunts'),
    lengthVh: 400,
    mascotSide: 'left',
    mascotGesture: 'idle',
    mascotOutfit: 'hunter',
  },
  {
    id: 'lab',
    anchor: 'projects',
    chapter: 'IV',
    titleKey: titleKeyFor('lab'),
    lengthVh: 260,
    mascotSide: 'right',
    mascotGesture: 'purr',
    mascotOutfit: 'inventor',
  },
  {
    id: 'archive',
    anchor: 'archive',
    lengthVh: 160,
    mascotSide: 'badge',
    mascotGesture: 'sit',
    mascotOutfit: 'scholar',
  },
  {
    id: 'raven',
    anchor: 'contact',
    chapter: 'V',
    titleKey: titleKeyFor('raven'),
    lengthVh: 200,
    mascotSide: 'left',
    mascotGesture: 'wave',
    mascotOutfit: 'hunter',
  },
  {
    id: 'epilogue',
    anchor: 'epilogue',
    lengthVh: 100,
    mascotSide: 'outro',
    mascotGesture: 'sleep',
    mascotOutfit: 'hunter',
  },
]

export const chapters: readonly ChapterMeta[] = scenes.flatMap((scene) =>
  scene.chapter && scene.titleKey
    ? [{ id: scene.id, chapter: scene.chapter, anchor: scene.anchor, titleKey: scene.titleKey }]
    : []
)

export const sceneById = (id: SceneId): SceneMeta | undefined =>
  scenes.find((scene) => scene.id === id)
