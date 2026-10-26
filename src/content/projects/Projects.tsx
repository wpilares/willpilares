import { SectionTitle } from '@components'
import { useIntersectionObserver } from '@hooks'
import { ExternalLink, GitBranch } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { projectData, projectIcons } from '@/constants'

export const Projects = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 })
  const { t } = useTranslation()

  return (
    <section
      id="projects"
      data-mascot="right"
      data-mascot-gesture="thumbs"
      data-mascot-outfit="netpulse"
      className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      ref={ref}
    >
      <div className="mx-auto max-w-5xl">
        <SectionTitle title={t('projects.title')} />

        <div
          className={`grid gap-6 sm:grid-cols-2 transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {projectData.map((project, index) => {
            const IconComponent = projectIcons[project.icon]
            return (
              <div
                key={project.key}
                className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`flex h-40 items-center justify-center bg-gradient-to-br ${project.gradient} p-6`}
                >
                  <IconComponent className="h-16 w-16 text-white/80 transition-transform duration-300 group-hover:scale-110" />
                </div>

                <div className="p-5 sm:p-6">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-ink">
                      {t(`projects.items.${project.key}.title`)}
                    </h3>
                    {project.status && (
                      <span className="flex-shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                        {t(`projects.status.${project.status}`)}
                      </span>
                    )}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-ink/70">
                    {t(`projects.items.${project.key}.description`)}
                  </p>
                  {project.stack && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-ink/10 px-3 py-1 text-xs font-medium text-ink/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-blue transition-colors hover:text-blue/80"
                    >
                      <GitBranch className="h-4 w-4" />
                      {t('projects.viewCode')}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
