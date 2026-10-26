import type { OutfitName } from '@mascot'

export type ProjectStatus = 'inProgress'

export type ChapterTint = 'navy' | 'lilac' | 'lemon' | 'moss'

export type TextTone = 'paper' | 'ink'

export type ChapterSide = 'left' | 'right'

export interface Project {
  key: string
  year: string
  featured: boolean
  tint: ChapterTint
  textTone: TextTone
  outfit: OutfitName
  side: ChapterSide
  stack: readonly string[]
  status?: ProjectStatus
  repoUrl?: string
  liveUrl?: string
}
