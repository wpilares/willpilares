import { mascotBus } from '@mascot'
import { chapters } from '@scenes'
import { type FocusEvent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { railState, travelEvent } from './chapterNavigation'
import { CHAPTERS_ID, SKIP_TO_CHAPTERS_EVENT } from './SkipToChapters'
import { useActiveAnchor } from './useActiveAnchor'

const useRailState = () => {
  const activeAnchor = useActiveAnchor()
  const previousChapter = useRef<string | null>(null)
  const state = railState(activeAnchor, previousChapter.current)

  useEffect(() => {
    previousChapter.current = state.chapter
  }, [state.chapter])

  return state
}

const useSkipTarget = () => {
  const navRef = useRef<HTMLElement>(null)
  const [forced, setForced] = useState(false)

  useEffect(() => {
    const reveal = () => setForced(true)
    window.addEventListener(SKIP_TO_CHAPTERS_EVENT, reveal)
    return () => window.removeEventListener(SKIP_TO_CHAPTERS_EVENT, reveal)
  }, [])

  useEffect(() => {
    if (forced) navRef.current?.querySelector('a')?.focus()
  }, [forced])

  const release = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget
    if (next instanceof Node && event.currentTarget.contains(next)) return
    setForced(false)
  }

  return { navRef, forced, release }
}

export const ChapterRail = () => {
  const { t } = useTranslation()
  const { visible, chapter: activeChapter } = useRailState()
  const { navRef, forced, release } = useSkipTarget()
  const shown = visible || forced

  return (
    <nav
      ref={navRef}
      id={CHAPTERS_ID}
      aria-label={t('journal.nav.label')}
      data-chapter-rail
      data-visible={shown}
      onBlur={release}
      className={`fixed z-30 transition-opacity duration-500 max-md:inset-x-0 max-md:bottom-0 max-md:flex max-md:h-[var(--dock-height)] max-md:items-start max-md:border-t max-md:border-gold/30 max-md:bg-night/95 max-md:pr-4 max-md:pb-[env(safe-area-inset-bottom)] max-md:pl-[5.75rem] md:top-1/2 md:right-[var(--margin)] md:-translate-y-1/2 ${
        shown ? 'md:visible md:opacity-100' : 'md:invisible md:opacity-0'
      }`}
    >
      <ol
        className={`flex gap-1 transition-opacity duration-500 max-md:h-16 max-md:flex-row max-md:items-center md:flex-col md:rounded-full md:border md:border-gold/40 md:bg-night/80 md:px-1 md:py-2 md:backdrop-blur-sm ${
          shown ? '' : 'max-md:invisible max-md:opacity-0'
        }`}
      >
        {chapters.map((chapter) => {
          const isActive = chapter.anchor === activeChapter
          return (
            <li key={chapter.id} className="relative">
              <a
                href={`#${chapter.anchor}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => mascotBus.emit(travelEvent(chapter.anchor))}
                className={`group relative flex h-10 w-10 items-center justify-center font-fell text-lg tracking-[0.04em] transition-colors duration-300 hover:text-parchment ${
                  isActive ? 'text-gold' : 'text-parchment-dim'
                }`}
              >
                <span aria-hidden="true">{chapter.chapter}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute h-1.5 w-1.5 rotate-45 bg-gold max-md:bottom-0.5 md:left-0"
                  />
                )}
                <span className="pointer-events-none absolute whitespace-nowrap rounded-sm border border-gold/40 bg-night/95 px-3 py-1 font-fell text-sm tracking-[0.1em] text-parchment opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:bottom-full max-md:mb-2 md:right-full md:mr-3">
                  <span className="sr-only">{chapter.chapter}. </span>
                  {t(chapter.titleKey)}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
