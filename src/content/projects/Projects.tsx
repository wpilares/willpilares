import { Chapter } from '@components'
import { useTranslation } from 'react-i18next'
import { projectData } from '@/constants'
import type { Project } from '@/types'

const rowClass = 'grid gap-x-[var(--gutter)] gap-y-2 py-7 md:grid-cols-12 md:items-baseline md:py-9'

interface WorkRowProps {
  project: Project
}

const WorkRow = ({ project }: WorkRowProps) => {
  const { t } = useTranslation()
  const url = project.repoUrl ?? project.liveUrl
  const content = (
    <>
      <h3 className="font-display text-2xl font-semibold tracking-tight md:col-span-4 md:text-4xl">
        {t(`projects.items.${project.key}.title`)}
      </h3>
      <p className="text-ink/70 md:col-span-6 md:truncate">
        {t(`projects.items.${project.key}.description`)}
      </p>
      <span className="label-mono text-ink/60 md:col-span-2 md:text-right">{project.year}</span>
    </>
  )

  return (
    <li className="border-t border-ink/10">
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${rowClass} transition-colors duration-300 hover:text-blue`}
        >
          {content}
        </a>
      ) : (
        <div className={rowClass}>{content}</div>
      )}
    </li>
  )
}

export const Projects = () => {
  const { t } = useTranslation()
  const featured = projectData.filter((project) => project.featured)

  return (
    <section id="projects">
      {featured.map((project) => (
        <Chapter key={project.key} project={project} />
      ))}

      <div
        data-mascot="badge"
        data-mascot-gesture="cheer"
        className="bg-stone text-ink bg-grid grid-page py-[16svh]"
      >
        <h2 className="display-headline col-span-full">{t('projects.allWork')}</h2>
        <ul className="col-span-full mt-16 border-b border-ink/10 md:mt-24">
          {projectData.map((project) => (
            <WorkRow key={project.key} project={project} />
          ))}
        </ul>
      </div>
    </section>
  )
}
