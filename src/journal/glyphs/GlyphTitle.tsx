import type { MotionValue } from 'motion/react'
import { type CSSProperties, type RefObject, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { GlyphLanguage, GlyphMeasure, GlyphTitleId, LazyGlyphId } from './glyphIds'
import { glyphMeasures } from './glyphMeasures.generated'
import { nameOutline } from './glyphName.generated'
import { glyphLanguage, outlineContours } from './glyphOutline'
import { useGlyphTitles } from './useGlyphTitles'

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

type GlyphFigureProps = Omit<GlyphTitleProps, 'id'> & {
  readonly measure: GlyphMeasure
  readonly d: string | undefined
}

type LazyGlyphTitleProps = Omit<GlyphTitleProps, 'id'> & {
  readonly id: LazyGlyphId
  readonly language: GlyphLanguage
}

const outlineStyle = (measure: GlyphMeasure, size: string): CSSProperties => ({
  display: 'block',
  width: `calc(${size} * ${measure.width / EM_UNITS})`,
  maxWidth: '100%',
  height: 'auto',
  aspectRatio: `${measure.width} / ${measure.height}`,
  overflow: 'visible',
})

const GlyphFigure = ({
  as: Tag = 'p',
  className,
  size,
  strokeProgress,
  fillProgress,
  measure,
  d,
}: GlyphFigureProps) => (
  <Tag className={className}>
    <span className="sr-only">{measure.text}</span>
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${measure.width} ${measure.height}`}
      preserveAspectRatio="xMinYMid meet"
      style={outlineStyle(measure, size)}
    >
      {d === undefined ? null : strokeProgress ? (
        <InkOutline d={d} strokeProgress={strokeProgress} fillProgress={fillProgress} />
      ) : (
        <path d={d} fill="currentColor" />
      )}
    </svg>
  </Tag>
)

const LazyGlyphTitle = ({ id, language, ...props }: LazyGlyphTitleProps) => {
  const paths = useGlyphTitles(language)
  return <GlyphFigure {...props} measure={glyphMeasures[id][language]} d={paths?.[id]} />
}

export const GlyphTitle = ({ id, ...props }: GlyphTitleProps) => {
  const { i18n } = useTranslation()
  if (id === 'name') return <GlyphFigure {...props} measure={nameOutline} d={nameOutline.d} />
  return <LazyGlyphTitle {...props} id={id} language={glyphLanguage(i18n.language)} />
}
