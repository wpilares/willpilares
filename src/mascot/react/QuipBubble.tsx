import { useTranslation } from 'react-i18next'
import type { QuipKey } from '../behavior/bus'

export type QuipBubbleProps = {
  readonly quipKey: QuipKey | null
  readonly x: number
  readonly y: number
  readonly width: number
}

const BUBBLE_GAP = 12

export const QuipBubble = ({ quipKey, x, y, width }: QuipBubbleProps) => {
  const { t } = useTranslation()
  const text = quipKey === null ? '' : t(`mascot.quips.${quipKey}`)

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute left-0 top-0"
      style={{
        transform: `translate3d(${x + width / 2}px, ${y - BUBBLE_GAP}px, 0) translate(-50%, -100%)`,
        maxWidth: 'min(18rem, calc(100vw - 2rem))',
      }}
    >
      {quipKey !== null && (
        <div className="relative rounded-xl border border-ink bg-paper px-3 py-2 text-ink">
          <p className="bubble-line whitespace-nowrap" style={{ fontSize: '0.95rem' }}>
            {text}
          </p>
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-full -ml-1.5 h-3 w-3 -translate-y-1/2 rotate-45 border-b border-r border-ink bg-paper"
          />
        </div>
      )}
    </div>
  )
}
