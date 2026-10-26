const SWEEP_START = -120
const SWEEP = 240

export const needleAngle = (fraction: number): number => {
  const clamped = Number.isNaN(fraction) ? 0 : Math.min(1, Math.max(0, fraction))
  return SWEEP_START + SWEEP * clamped
}

export const gaugeTicks = (count: number): number[] =>
  Array.from({ length: count }, (_, step) => needleAngle(count > 1 ? step / (count - 1) : 0))
