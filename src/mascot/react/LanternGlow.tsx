import type { CSSProperties } from 'react'

export type LanternGlowProps = {
  readonly x: number
  readonly y: number
}

type GlowStyle = CSSProperties & {
  readonly '--lx': string
  readonly '--ly': string
}

const GLOW_GRADIENT =
  'radial-gradient(circle at var(--lx) var(--ly), rgba(242, 196, 107, 0.18), transparent 22%)'

export const LanternGlow = ({ x, y }: LanternGlowProps) => {
  const style: GlowStyle = {
    '--lx': `${x}px`,
    '--ly': `${y}px`,
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage: GLOW_GRADIENT,
    mixBlendMode: 'screen',
  }
  return (
    <div
      data-lantern-glow
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={style}
    />
  )
}
