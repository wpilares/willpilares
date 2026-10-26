import { createRng } from './prng'

export const FLAME_HOLD_MIN_MS = 70
export const FLAME_HOLD_MAX_MS = 140

const FLAME_TIMING_SEED = 0xf1a3e7
const HOLD_COUNT = 24

export const flameHolds: readonly number[] = (() => {
  const rng = createRng(FLAME_TIMING_SEED)
  return Array.from({ length: HOLD_COUNT }, () => rng.int(FLAME_HOLD_MIN_MS, FLAME_HOLD_MAX_MS))
})()

export const flameHoldAt = (step: number): number =>
  flameHolds[step % flameHolds.length] ?? FLAME_HOLD_MAX_MS
