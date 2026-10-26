import { useIntersectionObserver } from '@hooks'
import type { Project } from '@/types'
import { revealedClass } from '../motion'

export interface BrowserMockupProps {
  screenshot: NonNullable<Project['screenshot']>
  title: string
  version?: string
}

const windowDots = ['close', 'minimize', 'zoom'] as const

export const BrowserMockup = ({ screenshot, title, version }: BrowserMockupProps) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 })

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-[640px] overflow-hidden rounded-2xl border-4 border-ink bg-paper text-ink shadow-[8px_8px_0_0_rgba(11,11,12,0.35)]"
    >
      <div className="flex items-center gap-3 border-b border-ink/10 bg-stone px-4 py-3">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          {windowDots.map((dot) => (
            <span key={dot} className="h-2.5 w-2.5 rounded-full bg-ink/30" />
          ))}
        </span>
        <span
          className="label-mono flex-1 truncate rounded-full bg-paper px-3 py-1 text-center text-[0.65rem] normal-case text-ink/70"
          title={title}
        >
          localhost:3000
        </span>
        {version && <span className="label-mono text-[0.65rem] text-ink/70">{version}</span>}
      </div>

      <img
        src={screenshot.src}
        alt={screenshot.alt}
        width={screenshot.width}
        height={screenshot.height}
        loading="lazy"
        decoding="async"
        className={`pop ${revealedClass(isVisible)} block h-auto w-full`}
      />
    </div>
  )
}
