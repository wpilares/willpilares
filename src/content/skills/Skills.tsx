import { SectionTitle } from '@components'
import { useIntersectionObserver } from '@hooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { techIconUrls } from '@/constants/skills'

const categories = [
  {
    key: 'frontend',
    skills: [
      { name: 'React', iconUrl: techIconUrls.React },
      { name: 'Angular', iconUrl: techIconUrls.Angular },
      { name: 'Next.js', iconUrl: techIconUrls['Next.js'] },
      { name: 'TypeScript', iconUrl: techIconUrls.TypeScript },
      { name: 'HTML', iconUrl: techIconUrls.HTML },
      { name: 'CSS', iconUrl: techIconUrls.CSS },
    ],
  },
  {
    key: 'backend',
    skills: [
      { name: 'Node.js', iconUrl: techIconUrls['Node.js'] },
      { name: 'NestJS', iconUrl: techIconUrls.NestJS },
      { name: 'Python', iconUrl: techIconUrls.Python },
      { name: '.NET', iconUrl: techIconUrls['.NET'] },
      { name: 'Keycloak', iconUrl: techIconUrls.Keycloak },
      { name: 'TypeORM', iconUrl: techIconUrls.TypeORM },
    ],
  },
  {
    key: 'cloud',
    skills: [
      { name: 'AWS', iconUrl: techIconUrls.AWS },
      { name: 'Azure', iconUrl: techIconUrls.Azure },
      { name: 'Docker', iconUrl: techIconUrls.Docker },
      { name: 'Terraform', iconUrl: techIconUrls.Terraform },
      { name: 'CI/CD', iconUrl: techIconUrls['CI/CD'] },
    ],
  },
  {
    key: 'databases',
    skills: [
      { name: 'PostgreSQL', iconUrl: techIconUrls.PostgreSQL },
      { name: 'MongoDB', iconUrl: techIconUrls.MongoDB },
      { name: 'OracleDB', iconUrl: techIconUrls.OracleDB },
    ],
  },
  {
    key: 'ai',
    skills: [
      { name: 'Claude', iconUrl: techIconUrls.Claude },
      { name: 'OpenCode', iconUrl: techIconUrls.OpenCode },
      { name: 'MCP', iconUrl: techIconUrls.MCP },
    ],
  },
]

export const Skills = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 })
  const [activeTab, setActiveTab] = useState(0)
  const { t } = useTranslation()
  const revealClass = `reveal ${isVisible ? 'reveal-visible' : ''}`
  const activeCategory = categories[activeTab]

  return (
    <section
      id="skills"
      className="bg-light-bg-secondary px-4 py-20 dark:bg-dark-bg-secondary sm:px-6 sm:py-28 lg:px-8"
      ref={ref}
    >
      <div className="mx-auto max-w-5xl">
        <SectionTitle title={t('skills.title')} subtitle={t('skills.subtitle')} />

        <fieldset className={`${revealClass} mb-8 flex flex-wrap justify-center gap-2 sm:gap-3`}>
          <legend className="sr-only">{t('skills.title')}</legend>
          {categories.map((cat, index) => (
            <button
              key={cat.key}
              type="button"
              aria-pressed={activeTab === index}
              onClick={() => setActiveTab(index)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-5 ${
                activeTab === index
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25 dark:bg-violet-500'
                  : 'border border-light-border bg-light-bg-card text-light-text-secondary hover:border-violet-500/50 hover:text-violet-600 dark:border-dark-border dark:bg-dark-bg-card dark:text-dark-text-secondary dark:hover:border-violet-500/50 dark:hover:text-violet-400'
              }`}
            >
              {t(`skills.categories.${cat.key}`)}
            </button>
          ))}
        </fieldset>

        <div className={revealClass} style={{ transitionDelay: '150ms' }}>
          <div
            key={activeCategory.key}
            className="grid animate-fade-up grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
          >
            {activeCategory.skills.map((skill) => (
              <div key={skill.name} className="card flex items-center gap-3 p-4">
                <img
                  src={skill.iconUrl}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 flex-shrink-0 object-contain"
                  loading="lazy"
                />
                <span className="truncate text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
