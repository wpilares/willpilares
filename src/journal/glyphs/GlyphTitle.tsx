import type { MotionValue } from 'motion/react'
import { type CSSProperties, type RefObject, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { GlyphOutline, GlyphTitleId } from './glyphIds'
import { glyphLanguage, outlineContours } from './glyphOutline'
import { glyphTitles } from './glyphTitles.generated'

const EM_UNITS = 1000
const INK_STROKE_WIDTH = 10

type GlyphTag = 'h1' | 'h2' | 'h3' | 'p' | 'span'

type GlyphTitleProps = {
  readonly id: GlyphTitleId
  readonly as?: GlyphTag
  readonly className?: string
  readonly size: string
  readonly strokeProgress?: MotionValue<number>
  readonly fillProgress?: MotionValue<number>
}

type InkOutlineProps = {
  readonly d: string
  readonly strokeProgress: MotionValue<number>
  readonly fillProgress?: MotionValue<number>
}

const remainingInk = (progress: number): string => String(1 - progress)

const inkOpacity = (progress: number): string => String(progress)

const useInkStyle = (
  ref: RefObject<SVGGElement | null>,
  progress: MotionValue<number> | undefined,
  property: string,
  toStyle: (progress: number) => string
) => {
  useEffect(
    () =>
      progress?.on('change', (value) => ref.current?.style.setProperty(property, toStyle(value))),
    [ref, progress, property, toStyle]
  )
}

const InkOutline = ({ d, strokeProgress, fillProgress }: InkOutlineProps) => {
  const ref = useRef<SVGGElement>(null)
  useInkStyle(ref, strokeProgress, 'stroke-dashoffset', remainingInk)
  useInkStyle(ref, fillProgress, 'fill-opacity', inkOpacity)

  return (
    <g
      ref={ref}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={INK_STROKE_WIDTH}
      strokeLinejoin="round"
      strokeDasharray={1}
      style={{
        strokeDashoffset: remainingInk(strokeProgress.get()),
        fillOpacity: fillProgress ? inkOpacity(fillProgress.get()) : 1,
      }}
    >
      {outlineContours(d).map((contour) => (
        <path key={contour} d={contour} pathLength={1} />
      ))}
    </g>
  )
}

const outlineStyle = (outline: GlyphOutline, size: string): CSSProperties => ({
  display: 'block',
  width: `calc(${size} * ${outline.width / EM_UNITS})`,
  maxWidth: '100%',
  height: 'auto',
  aspectRatio: `${outline.width} / ${outline.height}`,
  overflow: 'visible',
})

export const GlyphTitle = ({
  id,
  as: Tag = 'p',
  className,
  size,
  strokeProgress,
  fillProgress,
}: GlyphTitleProps) => {
  const { i18n } = useTranslation()
  const outline = glyphTitles[id][glyphLanguage(i18n.language)]

  return (
    <Tag className={className}>
      <span className="sr-only">{outline.text}</span>
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${outline.width} ${outline.height}`}
        preserveAspectRatio="xMinYMid meet"
        style={outlineStyle(outline, size)}
      >
        {strokeProgress ? (
          <InkOutline d={outline.d} strokeProgress={strokeProgress} fillProgress={fillProgress} />
        ) : (
          <path d={outline.d} fill="currentColor" />
        )}
      </svg>
    </Tag>
  )
}
