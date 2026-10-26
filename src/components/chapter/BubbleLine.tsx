import { useIntersectionObserver, usePrefersReducedMotion } from '@hooks'
import { Trans } from 'react-i18next'

export interface BubbleLineProps {
  i18nKey: string
  accentClassName?: string
  minHeightClassName?: string
}

const revealClasses = (prefersReducedMotion: boolean, isVisible: boolean) => {
  if (prefersReducedMotion) return ''
  return isVisible ? 'reveal reveal-visible' : 'reveal'
}

export const BubbleLine = ({
  i18nKey,
  accentClassName = 'text-blue',
  minHeightClassName = 'min-h-[36svh]',
}: BubbleLineProps) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [ref, isVisible] = useIntersectionObserver<HTMLParagraphElement>({ threshold: 0.4 })

  return (
    <div className={`flex items-center ${minHeightClassName}`}>
      <p
        ref={ref}
        className={`bubble-line max-w-[26ch] ${revealClasses(prefersReducedMotion, isVisible)}`}
      >
        <Trans i18nKey={i18nKey} components={{ accent: <span className={accentClassName} /> }} />
      </p>
    </div>
  )
}
