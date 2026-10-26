import { type RefObject, useEffect, useState } from 'react'

const flushPendingStyles = (element: HTMLElement | null) => {
  element?.getBoundingClientRect()
}

export const useRevealOnMount = (ref: RefObject<HTMLElement>, enabled = true) => {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!enabled) return
    flushPendingStyles(ref.current)
    setRevealed(true)
  }, [ref, enabled])

  return revealed
}
