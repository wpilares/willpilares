import { useIntersectionObserver, usePrefersReducedMotion } from '@hooks'
import { useTranslation } from 'react-i18next'
import type { ChapterSide, ChapterTint, Project, TextTone } from '@/types'
import { revealedClass, staggerIndex } from '../motion'
import { BubbleLine } from './BubbleLine'
import { DeviceMockup } from './DeviceMockup'

export interface ChapterProps {
  project: Project
}

const tintClass: Record<ChapterTint, string> = {
  navy: 'bg-tint-navy',
  lilac: 'bg-tint-lilac',
  lemon: 'bg-tint-lemon',
  moss: 'bg-tint-moss',
}

const toneClass: Record<TextTone, string> = {
  paper: 'text-paper',
  ink: 'text-ink',
}

const accentClass: Record<TextTone, string> = {
  paper: 'text-tint-lemon',
  ink: 'text-blue',
}

const linkClass: Record<TextTone, string> = {
  paper: 'btn-primary bg-paper text-ink hover:bg-blue hover:text-paper',
  ink: 'btn-primary',
}

const mockupColumns: Record<ChapterSide, string> = {
  right: 'md:col-start-1 md:col-end-7',
  left: 'md:col-start-7 md:col-end-13',
}

const linesColumns: Record<ChapterSide, string> = {
  right: 'md:col-start-8 md:col-end-13',
  left: 'md:col-start-1 md:col-end-6',
}

const lineKeys = ['one', 'two', 'three'] as const

export const Chapter = ({ project }: ChapterProps) => {
  const { t } = useTranslation()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [footerRef, footerVisible] = useIntersectionObserver({ threshold: 0.3 })
  const title = t(`projects.items.${project.key}.title`)
  const linkUrl = project.repoUrl ?? project.liveUrl
  const linkLabel = project.repoUrl ? t('projects.viewCode') : t('projects.viewProject')
  const footerRevealed = revealedClass(footerVisible)
  const floatClass = prefersReducedMotion ? '' : 'float-soft'

  return (
    <section
      data-mascot={project.side}
      data-mascot-gesture="thumbs"
      data-mascot-outfit={project.outfit}
      className={`bg-grid relative min-h-[120svh] ${tintClass[project.tint]} ${toneClass[project.textTone]}`}
    >
      <div className="grid-page gap-y-16 py-[14svh]">
        <div className={`col-span-full md:row-start-1 ${mockupColumns[project.side]}`}>
          <div className={`${floatClass} md:sticky md:top-[12svh]`}>
            <DeviceMockup title={title} accentLabel={project.stack[0] ?? title} />
          </div>
        </div>

        <div className={`col-span-full flex flex-col md:row-start-1 ${linesColumns[project.side]}`}>
          {lineKeys.map((line) => (
            <BubbleLine
              key={line}
              i18nKey={`projects.items.${project.key}.lines.${line}`}
              accentClassName={accentClass[project.textTone]}
            />
          ))}
        </div>

        <div
          ref={footerRef}
          className={`${footerRevealed} col-span-full flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-current/20 pt-8`}
        >
          <ul
            className={`${footerRevealed} label-mono flex flex-wrap items-center gap-x-3 gap-y-2 opacity-80`}
          >
            {project.stack.map((tech, index) => (
              <li
                key={tech}
                className="stagger-item flex items-center gap-3 before:content-['·'] first:before:hidden"
                style={staggerIndex(index)}
              >
                {tech}
              </li>
            ))}
          </ul>

          {project.status && (
            <span
              className="stagger-item label-mono rounded-full border border-current px-3 py-1"
              style={staggerIndex(project.stack.length)}
            >
              {t(`projects.status.${project.status}`)}
            </span>
          )}

          {linkUrl && (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`stagger-item ${linkClass[project.textTone]} ml-auto`}
              style={staggerIndex(project.stack.length + 1)}
            >
              {linkLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
