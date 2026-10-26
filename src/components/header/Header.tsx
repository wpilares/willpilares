import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
] as const

type LanguageCode = (typeof languages)[number]['code']

const resolveLanguage = (language: string): LanguageCode =>
  language.startsWith('es') ? 'es' : 'en'

export const Header = () => {
  const { t, i18n } = useTranslation()
  const activeLanguage = resolveLanguage(i18n.language)

  return (
    <header className="absolute left-0 right-0 top-0 z-50 py-5 text-paper">
      <div className="flex items-center justify-between gap-2 px-[var(--margin)] md:gap-3">
        <a
          href="#home"
          className="whitespace-nowrap font-display text-base font-semibold tracking-[-0.02em] md:text-lg"
        >
          Willber Pilares
        </a>

        <nav aria-label="Site actions" className="flex items-center gap-2 md:gap-3">
          <fieldset className="flex items-center rounded-full border border-paper/40 p-1 text-sm font-medium">
            <legend className="sr-only">Language</legend>
            {languages.map((language) => {
              const isActive = language.code === activeLanguage
              return (
                <button
                  key={language.code}
                  type="button"
                  lang={language.code}
                  aria-pressed={isActive}
                  onClick={() => i18n.changeLanguage(language.code)}
                  className={`rounded-full px-3 py-1.5 transition-colors duration-300 ${
                    isActive ? 'bg-paper text-ink' : 'text-paper/80 hover:text-paper'
                  }`}
                >
                  {language.label}
                </button>
              )
            })}
          </fieldset>

          <a
            href="#contact"
            className="inline-flex items-center whitespace-nowrap rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors duration-300 hover:bg-ink hover:text-paper active:scale-95 md:px-5 md:py-3 md:text-base"
          >
            {t('header.getInTouch')}
          </a>
        </nav>
      </div>
    </header>
  )
}
