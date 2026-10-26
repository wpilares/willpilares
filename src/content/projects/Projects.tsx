import { Chapter, MaskedText, revealedClass, staggerIndex } from '@components'
import { useIntersectionObserver } from '@hooks'
import { useTranslation } from 'react-i18next'
import { projectData } from '@/constants'
import type { Project } from '@/types'

const rowClass = 'grid gap-x-[var(--gutter)] gap-y-2 py-7 md:grid-cols-12 md:items-baseline md:py-9'

interface WorkRowProps {
  project: Project
  index: number
}

const WorkRow = ({ project, index }: WorkRowProps) => {
  const { t } = useTranslation()
  const url = project.repoUrl ?? project.liveUrl
  const content = (
    <>
      <h3 className="font-display text-2xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:col-span-4 md:text-4xl">
        {t(`projects.items.${project.key}.title`)}
      </h3>
      <p className="text-ink/70 md:col-span-6 md:truncate">
        {t(`projects.items.${project.key}.description`)}
      </p>
      <span className="label-mono text-ink/60 md:col-span-2 md:text-right">{project.year}</span>
    </>
  )

  return (
    <li
      className="stagger-item group border-t border-ink/10 hover:border-blue hover:bg-ink/5"
      style={staggerIndex(index)}
    >
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
  const [listRef, listVisible] = useIntersectionObserver<HTMLUListElement>({ threshold: 0.1 })
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
        <MaskedText
          as="h2"
          className="display-headline col-span-full"
          text={t('projects.allWork')}
        />
        <ul
          ref={listRef}
          className={`${revealedClass(listVisible)} col-span-full mt-16 border-b border-ink/10 md:mt-24`}
        >
          {projectData.map((project, index) => (
            <WorkRow key={project.key} project={project} index={index} />
          ))}
        </ul>
      </div>
    </section>
  )
}
