import { SectionTitle } from '@components'
import { useIntersectionObserver } from '@hooks'
import { useTranslation } from 'react-i18next'
import { highlightData, highlightIcons } from '@/constants'

export const AboutMe = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })
  const { t } = useTranslation()
  const revealClass = `reveal ${isVisible ? 'reveal-visible' : ''}`

  return (
    <section
      id="about"
      data-mascot="left"
      data-mascot-gesture="think"
      className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      ref={ref}
    >
      <div className="mx-auto max-w-5xl">
        <SectionTitle title={t('about.title')} />

        <div className={`${revealClass} mb-12 text-center`}>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-ink/70">
            {t('about.description')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {highlightData.map((item, index) => {
            const IconComponent = highlightIcons[item.icon as keyof typeof highlightIcons]
            return (
              <div
                key={item.key}
                className={revealClass}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="card group flex h-full flex-col items-center p-5 text-center sm:p-6">
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold text-ink sm:text-base">
                    {t(`about.highlights.${item.key}.title`)}
                  </h3>
                  <p className="text-xs text-ink/70 sm:text-sm">
                    {t(`about.highlights.${item.key}.description`)}
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
