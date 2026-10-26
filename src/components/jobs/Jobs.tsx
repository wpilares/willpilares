import { splitMetrics } from '@utils'
import { CalendarDays, Wrench } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { JobsProps } from '@/types'

const HighlightedText = ({ text }: { text: string }) => (
  <>
    {splitMetrics(text).map((segment) =>
      segment.isMetric ? (
        <strong key={segment.offset} className="font-semibold text-blue">
          {segment.value}
        </strong>
      ) : (
        <span key={segment.offset}>{segment.value}</span>
      )
    )}
  </>
)

export const Jobs = ({ data, isCurrent = false }: JobsProps) => {
  const { t } = useTranslation()

  return (
    <article className="card overflow-hidden">
      <header className="flex flex-col items-start gap-4 border-b border-ink/10 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
        <div className="flex h-14 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink/10 bg-paper px-2.5 py-2 shadow-sm sm:h-16 sm:w-28">
          <img
            src={data.image}
            alt={data.company}
            width={112}
            height={64}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-lg font-bold text-ink sm:text-xl">{data.company}</h3>
            {isCurrent && (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                {t('experience.current')}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm font-medium text-ink/70">{data.position}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/60">
            <CalendarDays className="h-3.5 w-3.5" />
            {data.period}
          </p>
        </div>
      </header>

      <ul className="space-y-3 p-5 sm:p-6">
        {data.descriptions.map((desc) => (
          <li
            key={desc}
            className="flex gap-3 text-sm leading-relaxed text-ink/70 sm:text-[0.938rem]"
          >
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue" />
            <span>
              <HighlightedText text={desc} />
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-ink/10 px-5 py-4 sm:px-6">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-ink/60">
          <Wrench className="h-3 w-3" />
          Stack
        </p>
        <div className="flex flex-wrap gap-2">
          {data.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-ink/10 px-3 py-1 text-xs font-medium text-ink/70"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
