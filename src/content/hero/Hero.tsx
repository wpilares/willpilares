import { cvPdf, profilePhoto } from '@assets'
import { useIntersectionObserver } from '@hooks'
import { Award, Code, Download, Layers, Mail, Sparkles } from 'lucide-react'

export const Hero = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })

  return (
    <section
      id="home"
      ref={ref}
      className="flex min-h-screen items-center justify-center px-4 pb-16 pt-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div
            className={`space-y-6 transition-all duration-700 lg:order-1 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                Available for work
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              <span className="mb-2 block text-2xl font-medium text-light-text-secondary dark:text-dark-text-secondary sm:text-3xl">
                Full Stack Developer
              </span>
              <span className="text-light-text-primary dark:text-dark-text-primary">WILLBER</span>
              <span className="gradient-text block">PILARES</span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
              Passionate about creating and learning about technology, with high capacities in
              analysis and solutions. Responsible, creative, and punctual professional who gladly
              assumes challenges and goals, with ease of teamwork and focus on achieving results.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a href={cvPdf} download className="btn-primary inline-flex items-center gap-2">
                <Download className="h-5 w-5" />
                Download CV
              </a>
              <a href="#contact" className="btn-secondary inline-flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Me
              </a>
            </div>

            {/* Tech Stack Preview */}
            <div className="border-t border-light-border pt-8 dark:border-dark-border">
              <p className="mb-4 flex items-center gap-2 text-sm text-light-text-muted dark:text-dark-text-muted">
                <Layers className="h-4 w-4" />
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-3">
                {['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'].map((tech) => (
                  <span key={tech} className="badge">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div
            className={`flex justify-center transition-all delay-200 duration-700 lg:order-2 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-700/20 blur-3xl" />
              <div className="absolute -top-10 right-10 h-40 w-40 rounded-full bg-violet-500/10 blur-2xl" />
              <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-purple-700/10 blur-2xl" />

              {/* Image container */}
              <div className="relative animate-float h-64 w-64 overflow-hidden rounded-full border-4 border-violet-500/30 shadow-2xl shadow-violet-500/20 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
                <img
                  src={profilePhoto}
                  alt="Willber Pilares"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -bottom-4 -left-4 animate-bounce-soft rounded-xl border border-light-border bg-light-bg-card px-4 py-2 shadow-xl dark:border-dark-border dark:bg-dark-bg-card">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400">
                  <Award className="h-4 w-4" />
                  5+ Years Exp.
                </span>
              </div>

              <div className="absolute -right-4 top-10 rounded-lg border border-light-border bg-light-bg-card px-3 py-1.5 shadow-lg dark:border-dark-border dark:bg-dark-bg-card">
                <span className="flex items-center gap-1.5 text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
                  <Code className="h-3.5 w-3.5" />
                  Full Stack
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
