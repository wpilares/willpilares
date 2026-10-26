import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

export const REVEAL_VISIBLE_OPACITY = 0.5

export type RevealGate = {
  readonly ref: RefObject<HTMLDivElement>
  readonly hidden: boolean
  readonly update: (opacity: number) => void
}

const isGated = (opacity: number, isStatic: boolean): boolean =>
  !isStatic && opacity < REVEAL_VISIBLE_OPACITY

export const useRevealGate = (initialOpacity: number, isStatic: boolean): RevealGate => {
  const ref = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(() => isGated(initialOpacity, isStatic))

  const update = useCallback((opacity: number) => setHidden(isGated(opacity, isStatic)), [isStatic])

  useEffect(() => {
    setHidden(isGated(initialOpacity, isStatic))
  }, [initialOpacity, isStatic])

  useEffect(() => {
    const element = ref.current
    if (element === null) return
    if (hidden) element.setAttribute('inert', '')
    else element.removeAttribute('inert')
  }, [hidden])

  return { ref, hidden, update }
}
