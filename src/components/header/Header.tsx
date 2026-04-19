import { useThemeStore } from '@store'
import { ChevronDown, Code2, Globe, Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { navLinks } from '@/constants'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, toggleTheme } = useThemeStore()
  const { t, i18n } = useTranslation()
  const langDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setIsLangDropdownOpen(false)
  }

  const currentLang = i18n.language === 'es' ? 'ES' : 'EN'

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-lg shadow-violet-500/25 transition-shadow duration-300 group-hover:shadow-violet-500/40">
              <Code2 className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="hidden text-xl font-semibold text-light-text-primary dark:text-dark-text-primary sm:block">
              Willber
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-light-text-secondary transition-colors duration-300 hover:text-violet-600 dark:text-dark-text-secondary dark:hover:text-violet-400"
              >
                {t(`nav.${link.key}`)}
              </a>
            ))}
          </nav>

          {/* Theme Toggle, Language & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-light-border bg-light-bg-tertiary px-3 py-2 text-sm font-medium text-light-text-secondary transition-all duration-300 hover:border-violet-500/50 dark:border-dark-border dark:bg-dark-bg-tertiary dark:text-dark-text-secondary"
                aria-label="Change language"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{currentLang}</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-300 ${isLangDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Language Dropdown */}
              {isLangDropdownOpen && (
                <div className="glass absolute right-0 mt-2 w-36 overflow-hidden rounded-xl border border-light-border/50 shadow-lg">
                  <button
                    type="button"
                    onClick={() => changeLanguage('en')}
                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-violet-500/10 ${
                      i18n.language === 'en'
                        ? 'text-violet-600 dark:text-violet-400'
                        : 'text-light-text-secondary dark:text-dark-text-secondary'
                    }`}
                  >
                    <span className="text-base">🇺🇸</span>
                    <span>English</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => changeLanguage('es')}
                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-violet-500/10 ${
                      i18n.language === 'es'
                        ? 'text-violet-600 dark:text-violet-400'
                        : 'text-light-text-secondary dark:text-dark-text-secondary'
                    }`}
                  >
                    <span className="text-base">🇪🇸</span>
                    <span>Español</span>
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border border-light-border bg-light-bg-tertiary p-2.5 transition-all duration-300 hover:border-violet-500/50 hover:bg-light-bg-secondary dark:border-dark-border dark:bg-dark-bg-tertiary dark:hover:border-violet-500/50 dark:hover:bg-dark-bg-secondary"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="rounded-xl border border-light-border bg-light-bg-tertiary p-2.5 transition-all duration-300 hover:border-violet-500/50 dark:border-dark-border dark:bg-dark-bg-tertiary dark:hover:border-violet-500/50 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary" />
              ) : (
                <Menu className="h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            isMenuOpen ? 'mt-4 max-h-80' : 'max-h-0'
          }`}
        >
          <nav className="glass flex flex-col gap-1 rounded-xl border border-light-border/50 p-2 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-light-text-secondary transition-all duration-300 hover:bg-light-bg-tertiary hover:text-violet-600 dark:text-dark-text-secondary dark:hover:bg-dark-bg-tertiary dark:hover:text-violet-400"
              >
                {t(`nav.${link.key}`)}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
