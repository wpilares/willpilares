import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface UseCountUpOptions {
  start: boolean
  duration?: number
}

const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3

export const useCountUp = (target: number, { start, duration = 1600 }: UseCountUpOptions) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion || !start) return

    let frameId = 0
    let startTime: number | null = null

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setValue(Math.round(easeOutCubic(progress) * target))
      if (progress < 1) frameId = requestAnimationFrame(step)
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [prefersReducedMotion, start, target, duration])

  return prefersReducedMotion ? target : value
}
