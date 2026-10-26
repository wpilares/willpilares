import { cvPdf } from '@assets'
import { baseDelay, MaskedText, revealedClass, staggerIndex, useRevealOnMount } from '@components'
import { usePrefersReducedMotion } from '@hooks'
import { ArrowDown } from 'lucide-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const revealed = useRevealOnMount(sectionRef)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { t } = useTranslation()
  const revealedToken = revealedClass(revealed)

  return (
    <section
      id="home"
      ref={sectionRef}
      data-mascot="hero"
      data-mascot-gesture="wave"
      className="bg-blue text-paper bg-grid grid-page relative min-h-svh grid-rows-[auto_1fr_auto] pt-24 pb-[var(--margin)]"
    >
      <div
        className={`stagger-item ${revealedToken} col-span-full flex items-center justify-between gap-4`}
        style={staggerIndex(0)}
      >
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

      <div className="col-span-full self-end pt-10 pb-28 md:col-span-10 md:pb-36">
        <h1 className="display-headline">
          <MaskedText immediate as="span" className="block" text={t('hero.titleStart')} />
          <span className={`highlight-box draw-box ${revealedToken}`}>
            <MaskedText immediate delayMs={250} text={t('hero.highlight')} />
          </span>
        </h1>
        <p
          className={`pop ${revealedToken} mt-8 max-w-prose text-lg text-paper/85 md:text-xl`}
          style={baseDelay(500)}
        >
          {t('hero.description')}
        </p>
      </div>

      <div className="col-span-full flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <div
          className={`stagger-item ${revealedToken} flex flex-wrap items-center gap-3`}
          style={staggerIndex(1)}
        >
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
        <p
          className={`stagger-item ${revealedToken} label-mono flex items-center gap-2 text-paper/80`}
          style={staggerIndex(2)}
        >
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
