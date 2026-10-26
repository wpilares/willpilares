import { splitMetrics } from '@utils'
import { useTranslation } from 'react-i18next'
import type { JobsProps } from '@/types'

const HighlightedText = ({ text }: { text: string }) => (
  <>
    {splitMetrics(text).map((segment) =>
      segment.isMetric ? (
        <strong key={segment.offset} className="font-medium text-blue">
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
    <li className="border-t border-ink/10">
      <article className="grid gap-x-[var(--gutter)] gap-y-5 py-9 md:grid-cols-12 md:py-12">
        <div className="flex flex-wrap items-center gap-3 md:col-span-3 md:flex-col md:items-start">
          <span className="label-mono text-ink/60">{data.period}</span>
          {isCurrent && (
            <span className="label-mono rounded-full border border-blue px-3 py-1 text-blue">
              {t('experience.current')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 md:col-span-2 md:items-start">
          <img
            src={data.image}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 flex-shrink-0 object-contain"
            loading="lazy"
          />
          <h3 className="font-display text-2xl font-semibold tracking-tight">{data.company}</h3>
        </div>

        <div className="md:col-span-7">
          <p className="font-display text-xl font-semibold tracking-tight">{data.position}</p>

          <ul className="mt-5 space-y-3 text-ink/70">
            {data.descriptions.map((description) => (
              <li key={description} className="leading-relaxed">
                <HighlightedText text={description} />
              </li>
            ))}
          </ul>

          <ul className="label-mono mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-ink/60">
            {data.stack.map((tech) => (
              <li
                key={tech}
                className="flex items-center gap-3 before:content-['·'] first:before:hidden"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </li>
  )
}
