import { useIntersectionObserver } from '@hooks'
import type { LucideIcon } from 'lucide-react'

export interface SectionTitleProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
}

export const SectionTitle = ({ title, subtitle, icon: Icon }: SectionTitleProps) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={`mb-12 text-center transition-all duration-700 sm:mb-16 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      {Icon && (
        <div className="mb-4 flex justify-center">
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3">
            <Icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
          </div>
        </div>
      )}
      <h2 className="mb-4 text-3xl font-bold text-light-text-primary dark:text-dark-text-primary sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto max-w-2xl text-lg text-light-text-secondary dark:text-dark-text-secondary">
          {subtitle}
        </p>
      )}
      <div className="mt-6 flex items-center justify-center gap-2">
        <div className="h-1 w-12 rounded-full bg-violet-600 dark:bg-violet-500" />
        <div className="h-1 w-3 rounded-full bg-violet-600/50 dark:bg-violet-500/50" />
        <div className="h-1 w-3 rounded-full bg-violet-600/50 dark:bg-violet-500/50" />
      </div>
    </div>
  )
}
