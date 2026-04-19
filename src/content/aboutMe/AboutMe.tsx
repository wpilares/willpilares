import { SectionTitle } from '@components'
import { useIntersectionObserver } from '@hooks'
import { useTranslation } from 'react-i18next'
import { highlightData, highlightIcons } from '@/constants'

export const AboutMe = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })
  const { t } = useTranslation()

  return (
    <section id="about" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8" ref={ref}>
      <div className="mx-auto max-w-5xl">
        <SectionTitle title={t('about.title')} />

        <div
          className={`mb-12 text-center transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
            {t('about.description')}
          </p>
        </div>

        {/* Highlight Cards */}
        <div
          className={`grid grid-cols-2 gap-4 transition-all delay-200 duration-700 sm:gap-6 lg:grid-cols-4 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {highlightData.map((item, index) => {
            const IconComponent = highlightIcons[item.icon as keyof typeof highlightIcons]
            return (
              <div
                key={item.key}
                className="card group flex flex-col items-center p-5 text-center sm:p-6"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <IconComponent className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-1 text-sm font-bold text-light-text-primary dark:text-dark-text-primary sm:text-base">
                  {t(`about.highlights.${item.key}.title`)}
                </h3>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary sm:text-sm">
                  {t(`about.highlights.${item.key}.description`)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
