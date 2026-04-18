import { useIntersectionObserver } from '@hooks'
import { Briefcase, Wrench } from 'lucide-react'

export interface JobData {
  company: string
  image: string
  descriptions: string[]
  stack: string[]
}

export interface JobsProps {
  data: JobData
}

export const Jobs = ({ data }: JobsProps) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })

  const getCompanyColor = (company: string) => {
    switch (company.toLowerCase()) {
      case 'softtek':
        return 'from-blue-500 to-blue-700'
      case 'promitia':
        return 'from-purple-500 to-purple-700'
      case 'américa móvil perú':
      case 'america movil peru':
        return 'from-red-500 to-red-700'
      default:
        return 'from-violet-500 to-purple-700'
    }
  }

  return (
    <div
      ref={ref}
      className={`card p-6 transition-all duration-700 sm:p-8 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${getCompanyColor(
              data.company
            )} p-4 shadow-lg sm:h-24 sm:w-24`}
          >
            <img
              src={data.image}
              alt={data.company}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="mb-1 text-xl font-bold text-light-text-primary dark:text-dark-text-primary sm:text-2xl">
              {data.company}
            </h3>
            <p className="flex items-center gap-1.5 text-sm text-light-text-muted dark:text-dark-text-muted">
              <Briefcase className="h-3.5 w-3.5" />
              Full Stack Developer
            </p>
          </div>

          {/* Descriptions */}
          <div className="space-y-3">
            {data.descriptions.map((desc) => (
              <p
                key={desc.slice(0, 20)}
                className="leading-relaxed text-light-text-secondary dark:text-dark-text-secondary"
              >
                {desc}
              </p>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="border-t border-light-border pt-4 dark:border-dark-border">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-light-text-muted dark:text-dark-text-muted">
              <Wrench className="h-3.5 w-3.5" />
              Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {data.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-violet-600/20 bg-violet-600/10 px-3 py-1 text-xs font-medium text-violet-600 transition-colors duration-300 hover:bg-violet-600/20 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
