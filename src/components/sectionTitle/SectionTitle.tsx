import { useIntersectionObserver } from '@hooks'

export interface SectionTitleProps {
  title: string
  subtitle?: string
}

export const SectionTitle = ({ title, subtitle }: SectionTitleProps) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={`mb-12 text-center transition-all duration-700 sm:mb-16 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      {/* Title with decorative lines */}
      <div className="mb-4 flex items-center justify-center gap-4">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-violet-500 sm:w-20" />
        <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary sm:text-4xl">
          {title}
        </h2>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-violet-500 sm:w-20" />
      </div>
      {subtitle && (
        <p className="mx-auto max-w-2xl text-light-text-secondary dark:text-dark-text-secondary">
          {subtitle}
        </p>
      )}
    </div>
  )
}
