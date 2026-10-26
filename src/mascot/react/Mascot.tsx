import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { lanternPoint } from '../lantern'
import { SPRITE_HEIGHT, SPRITE_WIDTH } from '../sprite'
import { LanternGlow } from './LanternGlow'
import { QuipBubble } from './QuipBubble'
import { useMascot } from './useMascot'

type MascotMetrics = {
  readonly scale: number
  readonly margin: number
}

const SCALE_BREAKPOINTS = [
  { query: '(min-width: 1920px)', scale: 5 },
  { query: '(min-width: 1024px)', scale: 4 },
  { query: '(min-width: 480px)', scale: 3 },
] as const
const PHONE_SCALE = 2
const DESKTOP_SCALE = 4
const WIDE_MARGIN_QUERY = '(min-width: 768px)'
const WIDE_MARGIN = 24
const NARROW_MARGIN = 16

const readMetrics = (): MascotMetrics | null => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null
  const scale =
    SCALE_BREAKPOINTS.find(({ query }) => window.matchMedia(query).matches)?.scale ?? PHONE_SCALE
  const margin = window.matchMedia(WIDE_MARGIN_QUERY).matches ? WIDE_MARGIN : NARROW_MARGIN
  return { scale, margin }
}

const sameMetrics = (left: MascotMetrics, right: MascotMetrics) =>
  left.scale === right.scale && left.margin === right.margin

const useMascotMetrics = (): MascotMetrics | null => {
  const [metrics, setMetrics] = useState(readMetrics)
  const available = metrics !== null

  useEffect(() => {
    if (!available) return
    const handleResize = () =>
      setMetrics((previous) => {
        const next = readMetrics()
        if (previous === null || next === null) return next
        return sameMetrics(previous, next) ? previous : next
      })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [available])

  return metrics
}

export const Mascot = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const metrics = useMascotMetrics()
  const scale = metrics?.scale ?? DESKTOP_SCALE
  const { position, facing, held, lit, quipKey } = useMascot({
    canvasRef,
    reducedMotion,
    scale,
    margin: metrics?.margin ?? WIDE_MARGIN,
  })

  if (metrics === null) return null

  const width = SPRITE_WIDTH * scale
  const height = SPRITE_HEIGHT * scale
  const cursor = reducedMotion ? 'default' : held ? 'grabbing' : 'grab'
  const lantern = lanternPoint(position, facing, scale)

  return (
    <div
      data-mascot-layer
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 40, position: 'fixed', inset: 0 }}
    >
      {lit && <LanternGlow x={lantern.x} y={lantern.y} />}
      <QuipBubble quipKey={quipKey} x={position.x} y={position.y} width={width} />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        tabIndex={-1}
        width={width}
        height={height}
        className="absolute left-0 top-0"
        style={{
          width,
          height,
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          pointerEvents: reducedMotion ? 'none' : 'auto',
          touchAction: 'none',
          cursor,
          imageRendering: 'pixelated',
        }}
      />
    </div>
  )
}
