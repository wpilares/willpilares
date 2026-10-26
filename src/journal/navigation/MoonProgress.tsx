import { useMotionValueEvent, useScroll } from 'motion/react'
import { useId, useState } from 'react'
import { moonPhase, moonTerminator } from './moonPhase'

const SIZE = 40
const CENTRE = SIZE / 2
const RADIUS = 16

const roundPhase = (value: number): number => Math.round(value * 100) / 100

export const MoonProgress = () => {
  const { scrollYProgress } = useScroll()
  const [phase, setPhase] = useState(() => roundPhase(moonPhase(scrollYProgress.get())))
  const maskId = `moon-${useId().replace(/:/g, '')}`

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = roundPhase(moonPhase(value))
    setPhase((current) => (current === next ? current : next))
  })

  const { rx, lit } = moonTerminator(phase, RADIUS)

  return (
    <svg
      aria-hidden="true"
      data-moon-progress
      data-phase={phase}
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="pointer-events-none fixed top-24 right-[var(--margin)] z-30 drop-shadow-[0_0_10px_rgba(201,214,227,0.35)]"
    >
      <defs>
        <mask id={maskId}>
          <rect x={CENTRE} y={0} width={CENTRE} height={SIZE} fill="white" />
          <ellipse cx={CENTRE} cy={CENTRE} rx={rx} ry={RADIUS} fill={lit ? 'white' : 'black'} />
        </mask>
      </defs>
      <circle
        cx={CENTRE}
        cy={CENTRE}
        r={RADIUS}
        className="fill-ash stroke-gold/50"
        strokeWidth={1}
      />
      <circle cx={CENTRE} cy={CENTRE} r={RADIUS} className="fill-moon" mask={`url(#${maskId})`} />
    </svg>
  )
}
