import { type MotionValue, useMotionValue } from 'motion/react'
import { useEffect } from 'react'

const easeInOut = (value: number): number =>
  value < 0.5 ? 2 * value * value : 1 - (-2 * value + 2) ** 2 / 2

export const useIntroProgress = (
  target: number,
  durationMs: number,
  enabled: boolean
): MotionValue<number> => {
  const intro = useMotionValue(enabled ? 0 : target)

  useEffect(() => {
    if (!enabled || typeof window.requestAnimationFrame !== 'function') {
      intro.set(target)
      return
    }
    intro.set(0)
    const startedAt = performance.now()
    let handle = 0
    const step = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / durationMs)
      intro.set(target * easeInOut(elapsed))
      if (elapsed < 1) handle = window.requestAnimationFrame(step)
    }
    handle = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(handle)
  }, [intro, target, durationMs, enabled])

  return intro
}
