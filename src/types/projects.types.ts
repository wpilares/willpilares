import type { projectIcons } from '@/constants/projects'

export type ProjectIconName = keyof typeof projectIcons

export interface Project {
  key: string
  icon: ProjectIconName
  gradient: string
}
