import { useIntersectionObserver, usePrefersReducedMotion } from '@hooks'
import { useTranslation } from 'react-i18next'
import type { ChapterSide, ChapterTint, Project, TextTone } from '@/types'
import { revealedClass, staggerIndex } from '../motion'
import { BrowserMockup } from './BrowserMockup'
import { BubbleLine } from './BubbleLine'
import { DeviceMockup } from './DeviceMockup'

export interface ChapterProps {
  project: Project
}

type MockupKind = 'phone' | 'browser'

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

const footerSideClass: Record<ChapterSide, string> = {
  right: 'justify-start md:pr-48',
  left: 'md:pl-48',
}

const linkPositionClass: Record<ChapterSide, string> = {
  right: 'ml-2',
  left: 'ml-auto',
}

const mockupColumns: Record<MockupKind, Record<ChapterSide, string>> = {
  phone: {
    right: 'md:col-start-1 md:col-end-7',
    left: 'md:col-start-7 md:col-end-13',
  },
  browser: {
    right: 'md:col-start-1 md:col-end-8',
    left: 'md:col-start-6 md:col-end-13',
  },
}

const linesColumns: Record<MockupKind, Record<ChapterSide, string>> = {
  phone: {
    right: 'md:col-start-8 md:col-end-13',
    left: 'md:col-start-1 md:col-end-6',
  },
  browser: {
    right: 'md:col-start-8 md:col-end-13',
    left: 'md:col-start-1 md:col-end-6',
  },
}

export const Chapter = ({ project }: ChapterProps) => {
  const { t } = useTranslation()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [factsRef, factsVisible] = useIntersectionObserver<HTMLDListElement>({ threshold: 0.3 })
  const [footerRef, footerVisible] = useIntersectionObserver({ threshold: 0.3 })
  const title = t(`projects.items.${project.key}.title`)
  const linkUrl = project.repoUrl ?? project.liveUrl
  const linkLabel = project.repoUrl ? t('projects.viewCode') : t('projects.viewProject')
  const factsRevealed = revealedClass(factsVisible)
  const footerRevealed = revealedClass(footerVisible)
  const floatClass = prefersReducedMotion ? '' : 'float-soft'
  const mockupKind: MockupKind = project.screenshot ? 'browser' : 'phone'

  return (
    <section
      data-mascot={project.side}
      data-mascot-gesture="purr"
      data-mascot-outfit={project.outfit}
      className={`bg-grid relative min-h-[120svh] ${tintClass[project.tint]} ${toneClass[project.textTone]}`}
    >
      <div className="grid-page gap-y-16 py-[14svh]">
        <div className={`col-span-full md:row-start-1 ${mockupColumns[mockupKind][project.side]}`}>
          <div className={`${floatClass} md:sticky md:top-[12svh]`}>
            {project.screenshot ? (
              <BrowserMockup
                screenshot={project.screenshot}
                title={title}
                version={project.version}
              />
            ) : (
              <DeviceMockup title={title} accentLabel={project.stack[0] ?? title} />
            )}
          </div>
        </div>

        <div
          className={`col-span-full flex flex-col md:row-start-1 ${linesColumns[mockupKind][project.side]}`}
        >
          {project.lines.map((line) => (
            <BubbleLine
              key={line}
              i18nKey={`projects.items.${project.key}.lines.${line}`}
              accentClassName={accentClass[project.textTone]}
            />
          ))}

          {project.facts && (
            <dl
              ref={factsRef}
              className={`${factsRevealed} grid grid-cols-3 gap-x-6 gap-y-2 py-[10svh]`}
            >
              {project.facts.map((fact, index) => (
                <div key={fact.labelKey} className="stagger-item" style={staggerIndex(index)}>
                  <dd className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                    {fact.value}
                  </dd>
                  <dt className="label-mono mt-2 opacity-80">
                    {t(`projects.items.${project.key}.facts.${fact.labelKey}`)}
                  </dt>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div
          ref={footerRef}
          className={`${footerRevealed} ${footerSideClass[project.side]} col-span-full flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-current/20 pt-8`}
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
              className={`stagger-item ${linkClass[project.textTone]} ${linkPositionClass[project.side]}`}
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
