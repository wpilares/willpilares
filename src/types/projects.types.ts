import type { OutfitName } from '@mascot'

export type ProjectStatus = 'inProgress'

export type ChapterTint = 'navy' | 'lilac' | 'lemon' | 'moss'

export type TextTone = 'paper' | 'ink'

export type ChapterSide = 'left' | 'right'

export interface ProjectScreenshot {
  readonly src: string
  readonly alt: string
  readonly width: number
  readonly height: number
}

export interface ProjectFact {
  readonly value: string
  readonly labelKey: string
}

export interface Project {
  key: string
  year: string
  featured: boolean
  tint: ChapterTint
  textTone: TextTone
  outfit: OutfitName
  side: ChapterSide
  stack: readonly string[]
  lines: readonly string[]
  screenshot?: ProjectScreenshot
  facts?: ReadonlyArray<ProjectFact>
  version?: string
  status?: ProjectStatus
  repoUrl?: string
  liveUrl?: string
}
