import { Jobs, SectionTitle } from '@components'
import { useIntersectionObserver } from '@hooks'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { ExperienceData } from '@/types'
import data from '../../../data.json'

const { companies }: ExperienceData = data

const toStringList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const TimelineItem = ({ children, index }: { children: ReactNode; index: number }) => {
  const [ref, isVisible] = useIntersectionObserver<HTMLLIElement>({ threshold: 0.1 })
  const isCurrent = index === 0

  return (
    <li ref={ref} className={`reveal relative pl-8 sm:pl-14 ${isVisible ? 'reveal-visible' : ''}`}>
      <span
        className={`absolute left-0.5 top-8 z-10 h-5 w-5 rounded-full border-4 border-light-bg-secondary bg-violet-500 dark:border-dark-bg-secondary sm:left-1.5 ${
          isCurrent ? 'shadow-[0_0_0_4px_rgba(139,92,246,0.25)]' : 'shadow-md shadow-violet-500/30'
        }`}
      />
      {children}
    </li>
  )
}

export const Experience = () => {
  const { t } = useTranslation()

  return (
    <section
      id="experience"
      className="bg-light-bg-secondary px-4 py-20 dark:bg-dark-bg-secondary sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <SectionTitle title={t('experience.title')} subtitle={t('experience.subtitle')} />

        <div className="relative">
          <div className="absolute bottom-0 left-3 top-2 w-px bg-gradient-to-b from-violet-500 via-violet-500/40 to-transparent sm:left-4" />

          <ol className="space-y-8 sm:space-y-10">
            {companies.map((company, index) => {
              const translationPrefix = `experience.companies.${company.key}`
              const translatedCompany = {
                ...company,
                position: t(`${translationPrefix}.position`),
                period: t(`${translationPrefix}.period`),
                descriptions: toStringList(
                  t(`${translationPrefix}.descriptions`, { returnObjects: true })
                ),
              }

              return (
                <TimelineItem key={company.company} index={index}>
                  <Jobs data={translatedCompany} isCurrent={index === 0} />
                </TimelineItem>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
