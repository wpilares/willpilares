export const createThrottle = (
  intervalMs: number,
  now: () => number = Date.now
): (() => boolean) => {
  let last: number | null = null
  return () => {
    const current = now()
    if (last !== null && current - last < intervalMs) return false
    last = current
    return true
  }
}
