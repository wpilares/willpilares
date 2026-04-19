import { useIntersectionObserver } from '@hooks'
import { Wrench } from 'lucide-react'

export interface JobData {
  company: string
  image: string
  descriptions: string[]
  stack: string[]
}

export interface JobsProps {
  data: JobData
  index?: number
}

export const Jobs = ({ data, index = 0 }: JobsProps) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={`card overflow-hidden transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Company header with logo */}
      <div className="flex items-center gap-4 border-b border-light-border p-5 dark:border-dark-border sm:p-6">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-light-bg-tertiary p-2 dark:bg-dark-bg-tertiary sm:h-14 sm:w-14">
          <img
            src={data.image}
            alt={data.company}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
            {data.company}
          </h3>
          <p className="text-sm text-light-text-muted dark:text-dark-text-muted">
            Full Stack Developer
          </p>
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-3 p-5 sm:p-6">
        {data.descriptions.map((desc) => (
          <p
            key={desc.slice(0, 30)}
            className="text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary"
          >
            {desc}
          </p>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="border-t border-light-border px-5 py-4 dark:border-dark-border sm:px-6">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-light-text-muted dark:text-dark-text-muted">
          <Wrench className="h-3 w-3" />
          Stack
        </p>
        <div className="flex flex-wrap gap-2">
          {data.stack.map((tech) => (
            <span key={tech} className="badge">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
