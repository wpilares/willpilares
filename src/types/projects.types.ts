export type ProjectStatus = 'complete'

export type ProjectLineKey = 'one' | 'two' | 'three' | 'four' | 'five'

export type ProjectFactKey = 'interval' | 'detection' | 'releases'

export interface ProjectScreenshot {
  readonly src: string
  readonly alt: string
  readonly width: number
  readonly height: number
}

export interface ProjectVideoSources {
  readonly webm: string
  readonly mp4: string
}

export interface ProjectMedia {
  readonly video: ProjectVideoSources
  readonly poster: ProjectScreenshot
}

export interface ProjectFact {
  readonly value: string
  readonly labelKey: ProjectFactKey
  readonly reading: number
  readonly dialMax: number
}

export interface Project {
  readonly key: string
  readonly stack: readonly string[]
  readonly lines: readonly ProjectLineKey[]
  readonly media: ProjectMedia
  readonly facts: readonly ProjectFact[]
  readonly version: string
  readonly status: ProjectStatus
  readonly repoUrl: string
}
