import { MaskedText, revealedClass, staggerIndex } from '@components'
import { useIntersectionObserver } from '@hooks'
import { mascotBus } from '@mascot'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ContactLink } from '@/types'

const email = 'wgpilaresc@gmail.com'
const copiedFeedbackMs = 2000

const navigateToMailto = () => {
  window.location.assign(`mailto:${email}`)
}

export const Contact = () => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<number | undefined>(undefined)
  const [contentRef, contentVisible] = useIntersectionObserver({ threshold: 0.2 })
  const revealedToken = revealedClass(contentVisible)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  const socialLinks: ContactLink[] = [
    {
      title: t('contact.links.github'),
      value: 'github.com/wpilares',
      href: 'https://github.com/wpilares',
    },
    {
      title: t('contact.links.linkedin'),
      value: 'linkedin.com/in/wpilaresc',
      href: 'https://linkedin.com/in/wpilaresc',
    },
  ]

  const copyEmail = async () => {
    const clipboard = navigator.clipboard
    if (!clipboard || typeof clipboard.writeText !== 'function') {
      navigateToMailto()
      return
    }

    try {
      await clipboard.writeText(email)
    } catch {
      navigateToMailto()
      return
    }

    mascotBus.emit({ type: 'quip', key: 'copied' })
    setCopied(true)
    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setCopied(false), copiedFeedbackMs)
  }

  return (
    <section
      id="contact"
      data-mascot="outro"
      data-mascot-gesture="wave"
      className="bg-ink text-paper bg-grid grid-page relative min-h-svh content-start py-[18svh]"
    >
      <div ref={contentRef} className="col-span-full pb-40 md:pb-48">
        <MaskedText as="h2" className="display-headline" text={t('contact.headline')} />
        <p className={`pop ${revealedToken} bubble-line mt-6 text-paper/80`}>
          {t('contact.availability')}
        </p>

        <div className="mt-16 md:mt-24">
          <p className="label-mono text-paper/60">{t('contact.links.email')}</p>
          <button
            type="button"
            onClick={copyEmail}
            className={`stagger-item ${revealedToken} mt-4 break-all text-left font-display text-2xl font-semibold tracking-tight underline decoration-2 underline-offset-8 hover:decoration-blue focus-visible:ring-offset-ink md:text-4xl`}
            style={staggerIndex(0)}
          >
            {copied ? t('contact.copied') : email}
          </button>
          <p role="status" aria-live="polite" className="sr-only">
            {copied ? t('contact.copied') : ''}
          </p>
        </div>

        <ul className={`${revealedToken} mt-10 flex flex-wrap gap-3`}>
          {socialLinks.map((link, index) => (
            <li key={link.href} className="stagger-item" style={staggerIndex(index + 1)}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
