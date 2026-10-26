export const MOON_MIN_PHASE = 0.1
export const MOON_MAX_PHASE = 1

export type MoonTerminator = {
  readonly rx: number
  readonly lit: boolean
}

const clampUnit = (value: number): number =>
  Number.isNaN(value) ? 0 : Math.min(1, Math.max(0, value))

export const moonPhase = (progress: number): number =>
  MOON_MIN_PHASE + (MOON_MAX_PHASE - MOON_MIN_PHASE) * clampUnit(progress)

export const moonTerminator = (phase: number, radius: number): MoonTerminator => {
  const fraction = clampUnit(phase)
  const rx = Math.round(Math.abs(1 - 2 * fraction) * radius * 100) / 100
  return { rx, lit: fraction >= 0.5 }
}
