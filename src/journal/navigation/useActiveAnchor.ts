import { scenes } from '@scenes'
import { useEffect, useState } from 'react'
import { type AnchorBand, activeAnchorAt } from './chapterNavigation'

const READING_LINE = 0.5

const storyAnchors: readonly string[] = scenes.map((scene) => scene.anchor)

const readBands = (): AnchorBand[] =>
  storyAnchors.flatMap((anchor) => {
    const element = document.getElementById(anchor)
    if (element === null) return []
    const rect = element.getBoundingClientRect()
    return [{ anchor, top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY }]
  })

export const useActiveAnchor = (): string | null => {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      const line = window.scrollY + window.innerHeight * READING_LINE
      setActive(activeAnchorAt(readBands(), line))
    }
    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return active
}
