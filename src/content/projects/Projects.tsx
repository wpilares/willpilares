import { SectionTitle } from '@components'
import { useIntersectionObserver } from '@hooks'

import { useTranslation } from 'react-i18next'
import { projectData, projectIcons } from '@/constants'

export const Projects = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 })
  const { t } = useTranslation()

  return (
    <section id="projects" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8" ref={ref}>
      <div className="mx-auto max-w-5xl">
        <SectionTitle title={t('projects.title')} />

        <div
          className={`grid gap-6 sm:grid-cols-2 transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {projectData.map((project, index) => {
            const IconComponent = projectIcons[project.icon as keyof typeof projectIcons]
            return (
              <div
                key={project.key}
                className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Gradient header */}
                <div
                  className={`flex h-40 items-center justify-center bg-gradient-to-br ${project.gradient} p-6`}
                >
                  <IconComponent className="h-16 w-16 text-white/80 transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
                      {t(`projects.items.${project.key}.title`)}
                    </h3>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
                    {t(`projects.items.${project.key}.description`)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
