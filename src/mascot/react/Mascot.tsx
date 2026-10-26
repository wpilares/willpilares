import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { SPRITE_HEIGHT, SPRITE_WIDTH } from '../sprite'
import { QuipBubble } from './QuipBubble'
import { useMascot } from './useMascot'

const DESKTOP_QUERY = '(min-width: 768px)'
const DESKTOP_SCALE = 4
const MOBILE_SCALE = 3

const readScale = (): number | null => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null
  return window.matchMedia(DESKTOP_QUERY).matches ? DESKTOP_SCALE : MOBILE_SCALE
}

const useMascotScale = (): number | null => {
  const [scale, setScale] = useState(readScale)

  useEffect(() => {
    if (scale === null) return
    const handleResize = () => setScale(readScale())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [scale])

  return scale
}

export const Mascot = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const scale = useMascotScale()
  const { position, held, quipKey } = useMascot({
    canvasRef,
    reducedMotion,
    scale: scale ?? DESKTOP_SCALE,
  })

  if (scale === null) return null

  const width = SPRITE_WIDTH * scale
  const height = SPRITE_HEIGHT * scale
  const cursor = reducedMotion ? 'default' : held ? 'grabbing' : 'grab'

  return (
    <div
      data-mascot-layer
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 40, position: 'fixed', inset: 0 }}
    >
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
