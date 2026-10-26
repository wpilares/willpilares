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
  const { t } = useTranslation()

  return (
    <section
      id="skills"
      data-mascot="left"
      data-mascot-gesture="cheer"
      className="bg-paper text-ink bg-grid grid-page py-[16svh]"
    >
      <h2 className="display-headline col-span-full">{t('skills.title')}</h2>

      <ul className="col-span-full mt-16 border-b border-ink/10 md:mt-24">
        {categories.map((category) => (
          <li
            key={category.key}
            className="grid gap-x-[var(--gutter)] gap-y-4 border-t border-ink/10 py-7 md:grid-cols-12 md:py-9"
          >
            <h3 className="font-display text-xl font-semibold tracking-tight md:col-span-3 md:text-2xl">
              {t(`skills.categories.${category.key}`)}
            </h3>

            <ul className="flex flex-wrap gap-x-8 gap-y-4 md:col-span-9">
              {category.skills.map((skill) => (
                <li key={skill.name} className="flex items-center gap-3 text-base">
                  <img
                    src={skill.iconUrl}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 flex-shrink-0 object-contain"
                    loading="lazy"
                  />
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
