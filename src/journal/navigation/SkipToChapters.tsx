import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

export const CHAPTERS_ID = 'chapters'
export const SKIP_TO_CHAPTERS_EVENT = 'journal:skip-to-chapters'

const skipToChapters = (event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault()
  window.dispatchEvent(new Event(SKIP_TO_CHAPTERS_EVENT))
}

export const SkipToChapters = () => {
  const { t } = useTranslation()
  return (
    <a
      href={`#${CHAPTERS_ID}`}
      onClick={skipToChapters}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-sm focus:bg-parchment focus:px-4 focus:py-2 focus:font-fell focus:text-night"
    >
      {t('journal.nav.skip')}
    </a>
  )
}
