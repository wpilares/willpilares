import { Jobs, SectionTitle } from '@components'
import { useIntersectionObserver } from '@hooks'
import { Briefcase } from 'lucide-react'
import data from '../../../data.json'

export const Experience = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 })

  const companies = [data.company_0, data.company_1, data.company_2]

  return (
    <section
      id="experience"
      className="bg-light-bg-secondary px-4 py-20 dark:bg-dark-bg-secondary sm:px-6 sm:py-28 lg:px-8"
      ref={ref}
    >
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          title="Experience"
          subtitle="A track record of delivering impactful solutions across diverse industries"
          icon={Briefcase}
        />

        <div className="relative">
          {/* Timeline line */}
          <div
            className={`absolute bottom-0 left-8 top-0 w-0.5 origin-top bg-gradient-to-b from-violet-500 via-violet-500/50 to-transparent transition-all delay-300 duration-1000 sm:left-12 ${
              isVisible ? 'scale-y-100' : 'scale-y-0'
            }`}
          />

          {/* Job cards */}
          <div className="space-y-8">
            {companies.map((company, index) => (
              <div key={company.company} className="relative pl-16 sm:pl-24">
                {/* Timeline dot */}
                <div
                  className={`absolute left-6 top-8 h-4 w-4 rounded-full border-4 border-light-bg-secondary bg-violet-500 shadow-lg shadow-violet-500/30 transition-all duration-500 dark:border-dark-bg-secondary sm:left-10 ${
                    isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                />
                <Jobs data={company} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
