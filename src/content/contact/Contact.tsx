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
      <div className="col-span-full pb-40 md:pb-48">
        <h2 className="display-headline">{t('contact.headline')}</h2>
        <p className="bubble-line mt-6 text-paper/80">{t('contact.availability')}</p>

        <div className="mt-16 md:mt-24">
          <p className="label-mono text-paper/60">{t('contact.links.email')}</p>
          <button
            type="button"
            onClick={copyEmail}
            className="mt-4 break-all text-left font-display text-2xl font-semibold tracking-tight underline decoration-2 underline-offset-8 transition-colors duration-300 hover:decoration-blue focus-visible:ring-offset-ink md:text-4xl"
          >
            {copied ? t('contact.copied') : email}
          </button>
          <p role="status" aria-live="polite" className="sr-only">
            {copied ? t('contact.copied') : ''}
          </p>
        </div>

        <ul className="mt-10 flex flex-wrap gap-3">
          {socialLinks.map((link) => (
            <li key={link.href}>
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
