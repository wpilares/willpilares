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
    <header className="fixed left-0 right-0 top-0 z-50 py-5">
      <div className="flex items-center justify-between px-[var(--margin)]">
        <a href="#home" className="font-display text-lg font-semibold tracking-[-0.02em]">
          Willber Pilares
        </a>

        <nav aria-label="Site actions" className="flex items-center gap-3">
          <fieldset className="flex items-center rounded-full border border-ink/20 p-1 text-sm font-medium">
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
                    isActive ? 'bg-ink text-paper' : 'text-ink/70 hover:text-ink'
                  }`}
                >
                  {language.label}
                </button>
              )
            })}
          </fieldset>

          <a href="#contact" className="btn-primary">
            {t('header.getInTouch')}
          </a>
        </nav>
      </div>
    </header>
  )
}
