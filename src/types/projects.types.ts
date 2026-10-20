import type { projectIcons } from '@/constants/projects'

export type ProjectIconName = keyof typeof projectIcons

export type ProjectStatus = 'inProgress'

export interface Project {
  key: string
  icon: ProjectIconName
  gradient: string
  status?: ProjectStatus
  stack?: string[]
  repoUrl?: string
}
