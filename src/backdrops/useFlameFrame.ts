import { type RefObject, useEffect, useRef, useState } from 'react'
import { flameHoldAt } from './flameTiming'

const readTabVisible = (): boolean =>
  typeof document === 'undefined' || document.visibilityState !== 'hidden'

const useTabVisible = (): boolean => {
  const [visible, setVisible] = useState(readTabVisible)
  useEffect(() => {
    const update = () => setVisible(readTabVisible())
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  return visible
}

const useOnScreen = (target: RefObject<HTMLElement>, enabled: boolean): boolean => {
  const [onScreen, setOnScreen] = useState(false)
  useEffect(() => {
    const element = target.current
    if (!enabled || element === null) return
    if (typeof IntersectionObserver === 'undefined') {
      setOnScreen(true)
      return
    }
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1]
      if (entry) setOnScreen(entry.isIntersecting)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [target, enabled])
  return onScreen
}

export const useFlameFrame = (
  count: number,
  target: RefObject<HTMLElement>,
  enabled: boolean
): number => {
  const [frame, setFrame] = useState(0)
  const step = useRef(0)
  const onScreen = useOnScreen(target, enabled)
  const tabVisible = useTabVisible()
  const running = enabled && onScreen && tabVisible && count > 1

  useEffect(() => {
    if (!running) return
    let handle = 0
    let heldSince: number | null = null
    const tick = (time: number) => {
      heldSince ??= time
      if (time - heldSince >= flameHoldAt(step.current)) {
        heldSince = time
        step.current += 1
        setFrame((current) => (current + 1) % count)
      }
      handle = window.requestAnimationFrame(tick)
    }
    handle = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(handle)
  }, [running, count])

  return enabled ? frame % Math.max(1, count) : 0
}
