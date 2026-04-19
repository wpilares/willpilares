import type { LucideIcon } from 'lucide-react'

export interface Project {
  title: string
  description: string
  tags: string[]
  icon: LucideIcon
  gradient: string
  link?: string
}
