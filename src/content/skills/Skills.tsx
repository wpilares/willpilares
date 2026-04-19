import { SectionTitle } from '@components'
import { techIconUrls } from '@components/TechIcons'
import { useIntersectionObserver } from '@hooks'
import { useState } from 'react'

interface SkillItem {
  name: string
  iconUrl: string
}

interface SkillCategory {
  title: string
  skills: SkillItem[]
}

const categories: SkillCategory[] = [
  {
    title: 'Frontend',
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
    title: 'Backend',
    skills: [
      { name: 'Node.js', iconUrl: techIconUrls['Node.js'] },
      { name: 'NestJS', iconUrl: techIconUrls.NestJS },
      { name: 'Python', iconUrl: techIconUrls.Python },
      { name: 'TypeORM', iconUrl: techIconUrls.TypeORM },
    ],
  },
  {
    title: 'Cloud & DevOps',
    skills: [
      { name: 'AWS', iconUrl: techIconUrls.AWS },
      { name: 'Azure', iconUrl: techIconUrls.Azure },
      { name: 'Docker', iconUrl: techIconUrls.Docker },
      { name: 'Terraform', iconUrl: techIconUrls.Terraform },
      { name: 'CI/CD', iconUrl: techIconUrls['CI/CD'] },
    ],
  },
  {
    title: 'Databases',
    skills: [
      { name: 'PostgreSQL', iconUrl: techIconUrls.PostgreSQL },
      { name: 'MongoDB', iconUrl: techIconUrls.MongoDB },
      { name: 'OracleDB', iconUrl: techIconUrls.OracleDB },
    ],
  },
]

export const Skills = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 })
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section
      id="skills"
      className="bg-light-bg-secondary px-4 py-20 dark:bg-dark-bg-secondary sm:px-6 sm:py-28 lg:px-8"
      ref={ref}
    >
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          title="Technical Skills"
          subtitle="Technologies and tools I use to build high-quality solutions"
        />

        {/* Category Tabs */}
        <div
          className={`mb-8 flex flex-wrap justify-center gap-3 transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {categories.map((cat, index) => (
            <button
              key={cat.title}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                activeTab === index
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25 dark:bg-violet-500'
                  : 'border border-light-border bg-light-bg-card text-light-text-secondary hover:border-violet-500/50 dark:border-dark-border dark:bg-dark-bg-card dark:text-dark-text-secondary dark:hover:border-violet-500/50'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div
          className={`transition-all delay-200 duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories[activeTab].skills.map((skill) => (
              <div
                key={skill.name}
                className="card group flex items-center gap-3 p-4 transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={skill.iconUrl}
                  alt={`${skill.name} icon`}
                  className="h-6 w-6 object-contain"
                  loading="lazy"
                />
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* All categories view (desktop) */}
        <div
          className={`mt-10 hidden gap-6 lg:grid lg:grid-cols-4 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {categories.map((cat) => (
            <div key={cat.title} className="card overflow-hidden">
              <div className="border-b border-light-border bg-gradient-to-r from-violet-500/10 to-purple-600/10 px-5 py-3 dark:border-dark-border">
                <h3 className="text-sm font-bold text-light-text-primary dark:text-dark-text-primary">
                  {cat.title}
                </h3>
              </div>
              <div className="space-y-2 p-4">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-violet-500/10"
                  >
                    <img
                      src={skill.iconUrl}
                      alt={`${skill.name} icon`}
                      className="h-5 w-5 object-contain"
                      loading="lazy"
                    />
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
