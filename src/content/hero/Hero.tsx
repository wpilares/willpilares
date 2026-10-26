import { cvPdf, profilePhoto } from '@assets'
import { useCountUp, useIntersectionObserver } from '@hooks'
import { ArrowRight, Download, Mail } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { type HeroStat, heroStats } from '@/constants'

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const socialLinkClass =
  'rounded-full border border-ink/10 bg-stone p-2.5 text-ink/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:text-ink'

const revealDelay = (milliseconds: number): CSSProperties => ({
  transitionDelay: `${milliseconds}ms`,
})

interface HeroStatCardProps {
  stat: HeroStat
  label: string
  start: boolean
}

const HeroStatCard = ({ stat, label, start }: HeroStatCardProps) => {
  const value = useCountUp(stat.value, { start })

  return (
    <div className="card flex flex-col items-center justify-center px-3 py-5 text-center sm:px-4">
      <span className="text-blue text-3xl font-bold tabular-nums sm:text-4xl">
        {value}
        {stat.suffix}
      </span>
      <span className="mt-1 text-xs font-medium leading-snug text-ink/70 sm:text-sm">{label}</span>
    </div>
  )
}

export const Hero = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })
  const { t } = useTranslation()
  const revealClass = `reveal ${isVisible ? 'reveal-visible' : ''}`

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute -right-32 top-24 h-72 w-72 rounded-full bg-blue/10 blur-3xl sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-tint-lilac/30 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div
              className={`${revealClass} mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-emerald-700">{t('hero.availability')}</span>
            </div>

            <h1
              className={`${revealClass} text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl`}
              style={revealDelay(100)}
            >
              {t('hero.name')}
            </h1>

            <p
              className={`${revealClass} mt-3 text-base font-semibold text-blue sm:text-lg`}
              style={revealDelay(150)}
            >
              {t('hero.role')}
            </p>

            <p
              className={`${revealClass} mt-6 max-w-full break-words text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl`}
              style={revealDelay(200)}
            >
              {t('hero.titleStart')} <span className="text-blue">{t('hero.highlight')}</span>
            </p>

            <p
              className={`${revealClass} mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg`}
              style={revealDelay(250)}
            >
              {t('hero.description')}
            </p>

            <div
              className={`${revealClass} mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start`}
              style={revealDelay(300)}
            >
              <a href="#contact" className="btn-primary">
                {t('hero.ctaContact')}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#experience" className="btn-ghost">
                {t('hero.ctaExperience')}
              </a>
              <a href={cvPdf} download className="btn-ghost">
                <Download className="h-4 w-4" />
                {t('hero.downloadCV')}
              </a>
            </div>

            <div className={`${revealClass} mt-8 flex items-center gap-4`} style={revealDelay(350)}>
              <a
                href="https://linkedin.com/in/wpilaresc"
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClass}
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/wpilares"
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClass}
                aria-label="GitHub"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a href="mailto:wgpilaresc@gmail.com" className={socialLinkClass} aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div
            className={`${revealClass} order-first flex justify-center lg:order-none`}
            style={revealDelay(150)}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-blue/40 to-tint-lilac/40 blur-2xl" />
              <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-blue/40 shadow-2xl shadow-blue/20 sm:h-52 sm:w-52 lg:h-80 lg:w-80">
                <img
                  src={profilePhoto}
                  alt="Willber Pilares"
                  width={320}
                  height={320}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${revealClass} mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-20 lg:grid-cols-4`}
          style={revealDelay(400)}
        >
          {heroStats.map((stat) => (
            <HeroStatCard
              key={stat.key}
              stat={stat}
              label={t(`hero.stats.${stat.key}`)}
              start={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
