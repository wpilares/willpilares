import { useEffect, useState } from 'react'
import type { PixelBuffer } from './painter'
import { createRng } from './prng'
import { renderBackdrop } from './render'

export type CandleFlameFrame = { readonly src: string; readonly glow: number }

export const CANDLE_FLAME_SEED = 0xf1a3e

const MIN_BODY = 9
const MAX_BODY = 13
const MIN_GLOW = 0.75

const glowForHeight = (height: number): number => {
  const share = Math.min(1, Math.max(0, (height - MIN_BODY) / (MAX_BODY - MIN_BODY)))
  return MIN_GLOW + (1 - MIN_GLOW) * share
}

const decoded = async (src: string): Promise<string> => {
  if (typeof Image === 'undefined') return src
  const image = new Image()
  image.src = src
  if (typeof image.decode === 'function') await image.decode().catch(() => undefined)
  return src
}

const renderFrame = async (buffer: PixelBuffer): Promise<string> =>
  decoded(await renderBackdrop(buffer))

const cache: {
  pending?: Promise<readonly CandleFlameFrame[]>
  ready?: readonly CandleFlameFrame[]
} = {}

export const loadCandleFlame = (): Promise<readonly CandleFlameFrame[]> => {
  if (cache.pending) return cache.pending
  const task = import('./generators/candleFlame').then(
    async ({ flameBodyHeight, generateCandleFlameFrames }) => {
      const buffers = generateCandleFlameFrames(createRng(CANDLE_FLAME_SEED))
      const frames = await Promise.all(
        buffers.map(async (buffer) => ({
          src: await renderFrame(buffer),
          glow: glowForHeight(flameBodyHeight(buffer)),
        }))
      )
      cache.ready = frames
      return frames
    }
  )
  cache.pending = task
  task.catch(() => {
    cache.pending = undefined
  })
  return task
}

export const useCandleFlame = (): readonly CandleFlameFrame[] | null => {
  const [frames, setFrames] = useState<readonly CandleFlameFrame[] | null>(
    () => cache.ready ?? null
  )

  useEffect(() => {
    if (cache.ready) {
      setFrames(cache.ready)
      return
    }
    let active = true
    loadCandleFlame().then(
      (next) => {
        if (active) setFrames(next)
      },
      () => undefined
    )
    return () => {
      active = false
    }
  }, [])

  return frames
}
