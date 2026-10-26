import { BubbleLine, MaskedText, revealedClass, staggerIndex } from '@components'
import { useCountUp, useIntersectionObserver } from '@hooks'
import { useTranslation } from 'react-i18next'
import { type HeroStat, heroStats } from '@/constants'

interface StatFigureProps {
  stat: HeroStat
  label: string
  index: number
  start: boolean
}

const StatFigure = ({ stat, label, index, start }: StatFigureProps) => {
  const value = useCountUp(stat.value, { start })

  return (
    <div className="stagger-item flex flex-col gap-2" style={staggerIndex(index)}>
      <span className="font-display text-5xl font-semibold tabular-nums tracking-tight md:text-6xl">
        <span className="word-mask">
          <span className="word-mask__inner">
            {value}
            {stat.suffix}
          </span>
        </span>
      </span>
      <span className="label-mono text-ink/60">{label}</span>
    </div>
  )
}

export const AboutMe = () => {
  const [descriptionRef, descriptionVisible] = useIntersectionObserver<HTMLParagraphElement>({
    threshold: 0.2,
  })
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
        <div className="col-span-full grid grid-cols-subgrid gap-y-10">
          <MaskedText
            as="h2"
            className="display-headline col-span-full md:col-span-11"
            text={t('about.statement')}
          />
          <p
            ref={descriptionRef}
            className={`pop ${revealedClass(descriptionVisible)} col-span-full max-w-[60ch] text-lg leading-relaxed text-ink/80 md:col-span-8 md:text-xl`}
          >
            {t('about.description')}
          </p>
        </div>

        <div className="col-span-full flex flex-col md:col-start-3 md:col-span-7">
          <BubbleLine i18nKey="about.lines.one" minHeightClassName="min-h-[28svh]" />
          <BubbleLine i18nKey="about.lines.two" minHeightClassName="min-h-[28svh]" />
        </div>

        <div
          ref={statsRef}
          className={`${revealedClass(statsVisible)} col-span-full grid grid-cols-2 gap-x-[var(--gutter)] gap-y-10 border-t border-ink/10 pt-10 md:grid-cols-4`}
        >
          {heroStats.map((stat, index) => (
            <StatFigure
              key={stat.key}
              stat={stat}
              label={t(`about.stats.${stat.key}`)}
              index={index}
              start={statsVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
