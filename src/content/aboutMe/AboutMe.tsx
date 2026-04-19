import { SectionTitle } from '@components'
import { useIntersectionObserver } from '@hooks'
import { Cloud, Code2, Database, Laptop } from 'lucide-react'

const highlights = [
  {
    icon: Laptop,
    title: '5+ Years',
    description: 'Professional software development experience',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Code2,
    title: 'Full Stack',
    description: 'End-to-end frontend and backend development',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps',
    description: 'AWS, Azure, Docker, CI/CD pipelines',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Database,
    title: 'Databases',
    description: 'PostgreSQL, MongoDB, OracleDB',
    gradient: 'from-orange-500 to-amber-600',
  },
]

export const AboutMe = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })

  return (
    <section id="about" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8" ref={ref}>
      <div className="mx-auto max-w-5xl">
        <SectionTitle title="About Me" />

        <div
          className={`mb-12 text-center transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
            Passionate about creating and learning technology, with strong analytical and
            problem-solving capabilities. A responsible, creative, and punctual professional who
            welcomes challenges, works well in teams, and focuses on delivering results.
          </p>
        </div>

        {/* Highlight Cards */}
        <div
          className={`grid grid-cols-2 gap-4 transition-all delay-200 duration-700 sm:gap-6 lg:grid-cols-4 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className="card group flex flex-col items-center p-5 text-center sm:p-6"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <item.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-1 text-sm font-bold text-light-text-primary dark:text-dark-text-primary sm:text-base">
                {item.title}
              </h3>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary sm:text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
