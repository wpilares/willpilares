import { SectionTitle } from '@components'
import { useIntersectionObserver } from '@hooks'
import { Mail, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

export const Contact = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })
  const { t } = useTranslation()

  const contactLinks = [
    {
      icon: Mail,
      title: t('contact.links.email'),
      value: 'wgpilaresc@gmail.com',
      href: 'mailto:wgpilaresc@gmail.com',
      gradient: 'from-red-500 to-rose-600',
    },
    {
      icon: GithubIcon,
      title: t('contact.links.github'),
      value: 'github.com/wpilares',
      href: 'https://github.com/wpilares',
      gradient: 'from-gray-600 to-gray-800',
    },
    {
      icon: LinkedinIcon,
      title: t('contact.links.linkedin'),
      value: 'linkedin.com/in/wpilaresc',
      href: 'https://linkedin.com/in/wpilaresc',
      gradient: 'from-blue-600 to-blue-800',
    },
  ]

  return (
    <section id="contact" className="px-4 py-20 sm:px-6 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-5xl">
        <SectionTitle title={t('contact.title')} subtitle={t('contact.subtitle')} />

        <div
          className={`grid gap-6 transition-all duration-700 sm:grid-cols-3 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {contactLinks.map((link, index) => {
            const IconComponent = link.icon
            return (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card group flex flex-col items-center p-6 text-center transition-all duration-300 hover:-translate-y-1"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${link.gradient} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-1 text-base font-semibold text-light-text-primary dark:text-dark-text-primary">
                  {link.title}
                </h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {link.value}
                </p>
              </a>
            )
          })}
        </div>

        {/* CTA */}
        <div
          className={`mt-12 text-center transition-all delay-300 duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <p className="mb-5 text-light-text-secondary dark:text-dark-text-secondary">
            {t('contact.directMessage')}
          </p>
          <a
            href="mailto:wgpilaresc@gmail.com"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Send className="h-5 w-5" />
            {t('contact.sendEmail')}
          </a>
        </div>
      </div>
    </section>
  )
}
