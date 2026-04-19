import { SectionTitle } from '@components'
import { useIntersectionObserver } from '@hooks'
import { BarChart3, Bot, ExternalLink, Globe, ShoppingCart } from 'lucide-react'

interface Project {
  title: string
  description: string
  tags: string[]
  icon: typeof Globe
  gradient: string
  link?: string
}

const projects: Project[] = [
  {
    title: 'E-Commerce Platform',
    description:
      'Complete e-commerce platform with shopping cart, payment gateway, and admin panel.',
    tags: ['React', 'NestJS', 'PostgreSQL', 'AWS'],
    icon: ShoppingCart,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Web Scraping Tool',
    description:
      'Automated web scraping tool for data collection and analysis with scheduled reports.',
    tags: ['Python', 'Node.js', 'MongoDB', 'Docker'],
    icon: Globe,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'AI Chatbot App',
    description:
      'AI-powered chatbot application for customer service with natural language processing.',
    tags: ['TypeScript', 'React', 'AWS Lambda', 'NestJS'],
    icon: Bot,
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    title: 'Analytics Dashboard',
    description:
      'Real-time analytics dashboard with interactive visualizations and custom reports.',
    tags: ['React', 'TypeScript', 'PostgreSQL', 'Docker'],
    icon: BarChart3,
    gradient: 'from-orange-500 to-red-600',
  },
]

export const Projects = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 })

  return (
    <section id="projects" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8" ref={ref}>
      <div className="mx-auto max-w-5xl">
        <SectionTitle title="Featured Projects" />

        <div
          className={`grid gap-6 sm:grid-cols-2 transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Gradient header */}
              <div
                className={`flex h-40 items-center justify-center bg-gradient-to-br ${project.gradient} p-6`}
              >
                <project.icon className="h-16 w-16 text-white/80 transition-transform duration-300 group-hover:scale-110" />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
                    {project.title}
                  </h3>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-light-text-muted transition-colors hover:text-violet-600 dark:text-dark-text-muted dark:hover:text-violet-400"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
