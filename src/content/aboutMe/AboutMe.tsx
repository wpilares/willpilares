import { BubbleLine } from '@components'
import { useCountUp, useIntersectionObserver } from '@hooks'
import { useTranslation } from 'react-i18next'
import { type HeroStat, heroStats } from '@/constants'

interface StatFigureProps {
  stat: HeroStat
  label: string
  start: boolean
}

const StatFigure = ({ stat, label, start }: StatFigureProps) => {
  const value = useCountUp(stat.value, { start })

  return (
    <div className="flex flex-col gap-2">
      <span className="font-display text-5xl font-semibold tabular-nums tracking-tight md:text-6xl">
        {value}
        {stat.suffix}
      </span>
      <span className="label-mono text-ink/60">{label}</span>
    </div>
  )
}

export const AboutMe = () => {
  const [headlineRef, headlineVisible] = useIntersectionObserver({ threshold: 0.2 })
  const [statsRef, statsVisible] = useIntersectionObserver({ threshold: 0.3 })
  const { t } = useTranslation()

  return (
    <section
      id="about"
      data-mascot="left"
      data-mascot-gesture="think"
      className="bg-paper text-ink bg-grid relative"
    >
      <div className="grid-page gap-y-20 py-[18svh] md:gap-y-28">
        <div
          ref={headlineRef}
          className={`reveal col-span-full md:col-span-11 ${headlineVisible ? 'reveal-visible' : ''}`}
        >
          <h2 className="display-headline">{t('about.statement')}</h2>
          <p className="mt-10 text-lg leading-relaxed text-ink/75 md:columns-2 md:gap-[var(--gutter)] md:text-xl">
            {t('about.description')}
          </p>
        </div>

        <div className="col-span-full flex flex-col md:col-start-6 md:col-end-13">
          <BubbleLine i18nKey="about.lines.one" />
          <BubbleLine i18nKey="about.lines.two" />
        </div>

        <div
          ref={statsRef}
          className="col-span-full grid grid-cols-2 gap-x-[var(--gutter)] gap-y-10 border-t border-ink/10 pt-10 md:grid-cols-4"
        >
          {heroStats.map((stat) => (
            <StatFigure
              key={stat.key}
              stat={stat}
              label={t(`about.stats.${stat.key}`)}
              start={statsVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
