import type { LucideIcon } from 'lucide-react'

export interface ContactLink {
  icon: LucideIcon | React.FC<{ className?: string }>
  title: string
  value: string
  href: string
  gradient: string
}
