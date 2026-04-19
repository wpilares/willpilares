import { Jobs, SectionTitle } from '@components'
import { useIntersectionObserver } from '@hooks'
import { useTranslation } from 'react-i18next'
import data from '../../../data.json'

const companyKeys = ['softtek', 'promitia', 'americaMovil'] as const

export const Experience = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 })
  const { t } = useTranslation()

  const companies = [data.company_0, data.company_1, data.company_2]

  return (
    <section
      id="experience"
      className="bg-light-bg-secondary px-4 py-20 dark:bg-dark-bg-secondary sm:px-6 sm:py-28 lg:px-8"
      ref={ref}
    >
      <div className="mx-auto max-w-5xl">
        <SectionTitle title={t('experience.title')} subtitle={t('experience.subtitle')} />

        <div className="relative">
          {/* Timeline center line (desktop only) */}
          <div
            className={`absolute left-8 top-0 bottom-0 w-0.5 origin-top bg-gradient-to-b from-violet-500 via-violet-500/50 to-transparent transition-all delay-300 duration-1000 sm:left-1/2 sm:-translate-x-px ${
              isVisible ? 'scale-y-100' : 'scale-y-0'
            }`}
          />

          {/* Job cards - zigzag layout */}
          <div className="space-y-12">
            {companies.map((company, index) => {
              const companyKey = companyKeys[index]
              // Get translated descriptions
              const descriptions = [
                t(`experience.companies.${companyKey}.descriptions.0`),
                t(`experience.companies.${companyKey}.descriptions.1`),
                ...(company.descriptions.length > 2
                  ? [t(`experience.companies.${companyKey}.descriptions.2`)]
                  : []),
              ]

              const companyWithTranslatedDescs = {
                ...company,
                descriptions,
              }

              return (
                <div
                  key={company.company}
                  className={`relative flex flex-col sm:flex-row sm:items-start ${
                    index % 2 === 0 ? 'sm:justify-start' : 'sm:flex-row-reverse sm:justify-start'
                  }`}
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-6 top-8 z-10 h-5 w-5 rounded-full border-4 border-light-bg-secondary bg-violet-500 shadow-lg shadow-violet-500/30 transition-all duration-500 dark:border-dark-bg-secondary sm:left-1/2 sm:-translate-x-1/2 sm:top-10 ${
                      isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 200 + 300}ms` }}
                  />

                  {/* Card wrapper */}
                  <div
                    className={`w-full pl-16 sm:w-[calc(50%-2rem)] sm:pl-0 ${
                      index % 2 === 0 ? 'sm:pr-8' : 'sm:pl-8'
                    }`}
                  >
                    <Jobs data={companyWithTranslatedDescs} index={index} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
