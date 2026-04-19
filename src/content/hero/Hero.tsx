import { cvPdf, profilePhoto } from '@assets'
import { useIntersectionObserver } from '@hooks'
import { Download } from 'lucide-react'

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

export const Hero = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })

  return (
    <section
      id="home"
      ref={ref}
      className="flex min-h-screen flex-col items-center justify-center px-4 pb-16 pt-24"
    >
      <div
        className={`flex max-w-3xl flex-col items-center text-center transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* Profile Photo */}
        <div className="relative mb-8">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-violet-500/40 to-purple-700/40 blur-xl" />
          <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-violet-500/40 shadow-2xl shadow-violet-500/20 sm:h-44 sm:w-44">
            <img
              src={profilePhoto}
              alt="Willber Pilares"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        </div>

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
            W Pilares
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="mb-4 text-4xl font-bold leading-tight text-light-text-primary dark:text-dark-text-primary sm:text-5xl lg:text-6xl">
          Building <span className="gradient-text">exceptional digital experiences</span>
        </h1>

        {/* Description */}
        <p className="mb-8 max-w-xl text-lg leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
          Passionate about creating and learning technology, with strong analytical and
          problem-solving capabilities. A responsible, creative, and punctual professional who
          welcomes challenges, works well in teams, and focuses on delivering results.
        </p>

        {/* CTA Button */}
        <a href={cvPdf} download className="btn-primary mb-8 inline-flex items-center gap-2">
          <Download className="h-5 w-5" />
          Download CV
        </a>

        {/* Social Icons */}
        <div className="flex items-center gap-5">
          <a
            href="https://linkedin.com/in/wpilaresc"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-light-border bg-light-bg-tertiary p-2.5 text-light-text-secondary transition-all duration-300 hover:border-violet-500/50 hover:text-violet-600 dark:border-dark-border dark:bg-dark-bg-tertiary dark:text-dark-text-secondary dark:hover:border-violet-500/50 dark:hover:text-violet-400"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/wpilares"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-light-border bg-light-bg-tertiary p-2.5 text-light-text-secondary transition-all duration-300 hover:border-violet-500/50 hover:text-violet-600 dark:border-dark-border dark:bg-dark-bg-tertiary dark:text-dark-text-secondary dark:hover:border-violet-500/50 dark:hover:text-violet-400"
            aria-label="GitHub"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
          <a
            href="mailto:wgpilaresc@gmail.com"
            className="rounded-full border border-light-border bg-light-bg-tertiary p-2.5 text-light-text-secondary transition-all duration-300 hover:border-violet-500/50 hover:text-violet-600 dark:border-dark-border dark:bg-dark-bg-tertiary dark:text-dark-text-secondary dark:hover:border-violet-500/50 dark:hover:text-violet-400"
            aria-label="Email"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
