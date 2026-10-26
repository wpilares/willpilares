import { cvPdf } from '@assets'
import { useIntersectionObserver, usePrefersReducedMotion } from '@hooks'
import { ArrowDown } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'

const revealDelay = (milliseconds: number): CSSProperties => ({
  transitionDelay: `${milliseconds}ms`,
})

export const Hero = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })
  const prefersReducedMotion = usePrefersReducedMotion()
  const { t } = useTranslation()
  const revealClass = `reveal ${isVisible ? 'reveal-visible' : ''}`

  return (
    <section
      id="home"
      ref={ref}
      data-mascot="hero"
      data-mascot-gesture="wave"
      className="bg-blue text-paper bg-grid grid-page relative min-h-svh grid-rows-[auto_1fr_auto] pt-24 pb-[var(--margin)]"
    >
      <div className={`${revealClass} col-span-full flex items-center justify-between gap-4`}>
        <p className="label-mono text-paper/80">
          {t('hero.name')} · {t('hero.role')}
        </p>
        <span className="inline-flex items-center gap-2 rounded-full border border-paper/40 px-3 py-1 text-sm text-paper/90">
          <span className="relative flex h-2 w-2">
            {!prefersReducedMotion && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-paper opacity-75" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-paper" />
          </span>
          {t('hero.availability')}
        </span>
      </div>

      <div
        className={`${revealClass} col-span-full self-end pt-16 pb-40 md:col-span-10 md:pb-48`}
        style={revealDelay(100)}
      >
        <h1 className="display-headline">
          <span className="block">{t('hero.titleStart')}</span>
          <span className="highlight-box">{t('hero.highlight')}</span>
        </h1>
        <p className="mt-8 max-w-prose text-lg text-paper/85 md:text-xl">{t('hero.description')}</p>
      </div>

      <div
        className={`${revealClass} col-span-full flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between`}
        style={revealDelay(200)}
      >
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            className="btn-primary bg-paper text-ink hover:bg-ink hover:text-paper"
          >
            {t('hero.ctaContact')}
          </a>
          <a
            href={cvPdf}
            download
            className="btn-ghost border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink"
          >
            {t('hero.downloadCV')}
          </a>
        </div>
        <p className="label-mono flex items-center gap-2 text-paper/80">
          {t('hero.scrollHint')}
          <ArrowDown
            className={prefersReducedMotion ? 'h-4 w-4' : 'scroll-arrow h-4 w-4'}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </p>
      </div>
    </section>
  )
}
