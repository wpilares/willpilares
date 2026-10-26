export type Rng = {
  next(): number
  int(min: number, max: number): number
  pick<T>(items: readonly T[]): T
}

export class EmptyPickError extends Error {
  constructor() {
    super('Cannot pick from an empty list')
    this.name = 'EmptyPickError'
  }
}

export const createRng = (seed: number): Rng => {
  let state = seed >>> 0

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0
    let mixed = state
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1)
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }

  const int = (min: number, max: number): number => min + Math.floor(next() * (max - min + 1))

  const pick = <T>(items: readonly T[]): T => {
    const item = items[int(0, items.length - 1)]
    if (item === undefined) throw new EmptyPickError()
    return item
  }

  return { next, int, pick }
}
