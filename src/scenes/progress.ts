const clampUnit = (value: number): number => Math.min(1, Math.max(0, value))

export const segment = (progress: number, start: number, end: number): number => {
  if (end <= start) return progress >= end ? 1 : 0
  return clampUnit((progress - start) / (end - start))
}

export const fogOpacity = (progress: number, edge = 0.15): number => {
  const clamped = clampUnit(progress)
  if (edge <= 0) return clamped === 0 || clamped === 1 ? 1 : 0
  const entering = 1 - clamped / edge
  const leaving = 1 - (1 - clamped) / edge
  return clampUnit(Math.max(entering, leaving))
}

export const parallaxOffset = (progress: number, depth: number, travel: number): number => {
  const offset = Math.round(-(progress - 0.5) * travel * depth * 100) / 100
  return offset === 0 ? 0 : offset
}

export const activeSceneIndex = (progresses: readonly number[]): number => {
  let active = -1
  let lastCompleted = -1
  progresses.forEach((progress, index) => {
    if (progress > 0 && progress < 1) {
      if (active === -1 || progress > (progresses[active] ?? 0)) active = index
    } else if (progress >= 1) {
      lastCompleted = index
    }
  })
  if (active !== -1) return active
  return lastCompleted !== -1 ? lastCompleted : 0
}
