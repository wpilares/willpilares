import { useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { QuipKey } from '../behavior/bus'

export type QuipBubbleProps = {
  readonly quipKey: QuipKey | null
  readonly x: number
  readonly y: number
  readonly width: number
}

const BUBBLE_GAP = 12
const VIEWPORT_MARGIN = 16
const MAX_BUBBLE_WIDTH = 288
const TAIL_INSET = 14

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const viewportWidth = () => (typeof window === 'undefined' ? MAX_BUBBLE_WIDTH : window.innerWidth)

export const QuipBubble = ({ quipKey, x, y, width }: QuipBubbleProps) => {
  const { t } = useTranslation()
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [bubbleWidth, setBubbleWidth] = useState(0)
  const text = quipKey === null ? '' : t(`mascot.quips.${quipKey}`)

  useLayoutEffect(() => {
    setBubbleWidth(bubbleRef.current?.offsetWidth ?? 0)
  })

  const anchorX = x + width / 2
  const containerWidth = Math.min(MAX_BUBBLE_WIDTH, viewportWidth() - 2 * VIEWPORT_MARGIN)
  const bubbleLeft = clamp(
    anchorX - bubbleWidth / 2,
    VIEWPORT_MARGIN,
    Math.max(VIEWPORT_MARGIN, viewportWidth() - VIEWPORT_MARGIN - bubbleWidth)
  )
  const tailLeft = clamp(
    anchorX - bubbleLeft,
    TAIL_INSET,
    Math.max(TAIL_INSET, bubbleWidth - TAIL_INSET)
  )

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute top-0"
      style={{
        left: `${bubbleLeft}px`,
        transform: `translate3d(0, ${y - BUBBLE_GAP}px, 0) translateY(-100%)`,
        maxWidth: `${containerWidth}px`,
      }}
    >
      {quipKey !== null && (
        <div
          ref={bubbleRef}
          className="relative w-max max-w-full rounded-xl border border-night bg-parchment px-3 py-2 text-night shadow-[0_6px_16px_rgba(0,0,0,0.45)]"
        >
          <p className="font-fell text-base leading-snug italic">{text}</p>
          <span
            aria-hidden="true"
            className="absolute top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-night bg-parchment"
            style={{ left: `${tailLeft}px` }}
          />
        </div>
      )}
    </div>
  )
}
