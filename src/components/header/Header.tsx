import { useThemeStore } from '@store'
import { Code2, Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About Me' },
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ]

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
              WPilares
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
                {link.label}
              </a>
            ))}
          </nav>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
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
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
