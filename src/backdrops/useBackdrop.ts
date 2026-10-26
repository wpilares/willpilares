import { useEffect, useState } from 'react'
import type { BackdropId, BackdropLayerName } from './layout'
import { renderBackdrop } from './render'

export type BackdropUrls = Readonly<Record<BackdropLayerName, string>>

const pending = new Map<BackdropId, Promise<BackdropUrls>>()
const ready = new Map<BackdropId, BackdropUrls>()

const scheduleIdle = (task: () => void): (() => void) => {
  if (typeof window.requestIdleCallback === 'function') {
    const handle = window.requestIdleCallback(task, { timeout: 600 })
    return () => window.cancelIdleCallback(handle)
  }
  const handle = window.setTimeout(task, 0)
  return () => window.clearTimeout(handle)
}

export const loadBackdrop = (id: BackdropId): Promise<BackdropUrls> => {
  const existing = pending.get(id)
  if (existing) return existing
  const task = import('./generators').then(async ({ generateBackdrop }) => {
    const layers = generateBackdrop(id)
    const [far, mid, near] = await Promise.all([
      renderBackdrop(layers.far),
      renderBackdrop(layers.mid),
      renderBackdrop(layers.near),
    ])
    const urls: BackdropUrls = { far, mid, near }
    ready.set(id, urls)
    return urls
  })
  pending.set(id, task)
  task.catch(() => pending.delete(id))
  return task
}

export const useBackdrop = (id: BackdropId): BackdropUrls | null => {
  const [urls, setUrls] = useState<BackdropUrls | null>(() => ready.get(id) ?? null)

  useEffect(() => {
    const cached = ready.get(id)
    if (cached) {
      setUrls(cached)
      return
    }
    setUrls(null)
    let active = true
    const cancel = scheduleIdle(() => {
      loadBackdrop(id).then(
        (next) => {
          if (active) setUrls(next)
        },
        () => undefined
      )
    })
    return () => {
      active = false
      cancel()
    }
  }, [id])

  return urls
}
