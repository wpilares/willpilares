import { Jobs } from '@components'
import { useTranslation } from 'react-i18next'
import type { ExperienceData } from '@/types'
import data from '../../../data.json'

const { companies }: ExperienceData = data

const toStringList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

export const Experience = () => {
  const { t } = useTranslation()

  return (
    <section
      id="experience"
      data-mascot="badge"
      data-mascot-gesture="idle"
      className="bg-stone text-ink bg-grid grid-page py-[16svh]"
    >
      <h2 className="display-headline col-span-full">{t('experience.title')}</h2>

      <ol className="col-span-full mt-16 border-b border-ink/10 md:mt-24">
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

          return <Jobs key={company.key} data={translatedCompany} isCurrent={index === 0} />
        })}
      </ol>
    </section>
  )
}
