import { type CSSProperties, type PointerEvent, useState } from 'react'
import type { SkillCategoryKey, SkillPlate } from '@/constants'
import {
  LEAN_DEGREES,
  leanAllowance,
  medallionSize,
  type SpineLean,
  type SpineShape,
} from './bookGeometry'

const categoryLeather: Readonly<Record<SkillCategoryKey, readonly [string, string]>> = {
  frontend: ['#8b1e1e', '#701818'],
  backend: ['#9a5b34', '#7e4829'],
  cloud: ['#3b2a22', '#4b362b'],
  databases: ['#2c2833', '#38323f'],
  ai: ['#1f2a24', '#28362e'],
}

const leatherGrain =
  'linear-gradient(90deg, rgba(0, 0, 0, 0.5) 0%, rgba(255, 255, 255, 0.1) 22%, transparent 45%, transparent 74%, rgba(0, 0, 0, 0.55) 100%)'

const leanOrigin: Readonly<Record<SpineLean, string>> = {
  [-1]: 'bottom left',
  0: 'bottom center',
  1: 'bottom right',
}

type SkillBookProps = {
  readonly skill: SkillPlate
  readonly category: SkillCategoryKey
  readonly shape: SpineShape
  readonly onLight: () => void
}

export const bookMargins = (shape: SpineShape): CSSProperties => {
  const allowance = leanAllowance(shape)
  if (shape.lean === -1) return { marginLeft: allowance }
  if (shape.lean === 1) return { marginRight: allowance }
  return {}
}

export const SkillBook = ({ skill, category, shape, onLight }: SkillBookProps) => {
  const [lit, setLit] = useState(false)
  const leather = categoryLeather[category][shape.shade] ?? categoryLeather[category][0]
  const medallion = medallionSize(shape.width)

  const toggleForTouch = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') return
    setLit((current) => !current)
    onLight()
  }

  const style: CSSProperties & Record<'--lean', string> = {
    width: shape.width,
    height: shape.height,
    backgroundColor: leather,
    backgroundImage: leatherGrain,
    transformOrigin: leanOrigin[shape.lean],
    '--lean': `${shape.lean * LEAN_DEGREES}deg`,
  }

  return (
    <button
      type="button"
      aria-label={skill.name}
      data-skill-book={skill.name}
      data-lit={lit}
      className="skill-book"
      style={style}
      onPointerEnter={onLight}
      onFocus={onLight}
      onPointerDown={toggleForTouch}
      onBlur={() => setLit(false)}
    >
      <span aria-hidden="true" className="skill-book-band" />
      <span
        aria-hidden="true"
        className="skill-book-medallion"
        style={{ width: medallion, height: medallion }}
      >
        {skill.iconUrl !== '' && (
          <img
            src={skill.iconUrl}
            alt=""
            width={Math.round(medallion * 0.62)}
            height={Math.round(medallion * 0.62)}
            loading="lazy"
            draggable={false}
          />
        )}
      </span>
      <span aria-hidden="true" className="skill-book-title">
        <span style={{ fontSize: shape.fontSize }}>{skill.name}</span>
      </span>
      <span aria-hidden="true" className="skill-book-band" />
    </button>
  )
}
