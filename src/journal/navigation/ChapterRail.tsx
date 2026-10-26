import { mascotBus } from '@mascot'
import { chapters } from '@scenes'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { railState, travelEvent } from './chapterNavigation'
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

export const ChapterRail = () => {
  const { t } = useTranslation()
  const { visible, chapter: activeChapter } = useRailState()

  return (
    <nav
      aria-label={t('journal.nav.label')}
      data-chapter-rail
      data-visible={visible}
      className={`fixed z-30 transition-opacity duration-500 max-md:inset-x-0 max-md:bottom-3 max-md:flex max-md:justify-center md:top-1/2 md:right-[var(--margin)] md:-translate-y-1/2 ${
        visible ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      <ol className="flex gap-1 rounded-full border border-gold/40 bg-night/80 px-2 py-1 backdrop-blur-sm max-md:flex-row md:flex-col md:px-1 md:py-2">
        {chapters.map((chapter) => {
          const isActive = chapter.anchor === activeChapter
          return (
            <li key={chapter.id} className="relative">
              <a
                href={`#${chapter.anchor}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => mascotBus.emit(travelEvent(chapter.anchor))}
                className={`group relative flex h-10 w-10 items-center justify-center font-blackletter text-xl transition-colors duration-300 hover:text-parchment ${
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
