export type HoldKind = 'idle' | 'pending' | 'held' | 'tap' | 'cancelled'

export type HoldResult = { readonly kind: HoldKind }

export type HoldDetectorOptions = {
  readonly holdMs?: number
  readonly moveTolerance?: number
}

export type HoldDetector = {
  down(x: number, y: number, now: number): HoldResult
  move(x: number, y: number, now: number): HoldResult
  up(now: number): HoldResult
  check(now: number): HoldResult
  current(): HoldResult
}

type Phase = 'idle' | 'pending' | 'held'

const result = (kind: HoldKind): HoldResult => ({ kind })

export const createHoldDetector = ({
  holdMs = 250,
  moveTolerance = 6,
}: HoldDetectorOptions = {}): HoldDetector => {
  let phase: Phase = 'idle'
  let originX = 0
  let originY = 0
  let downAt = 0

  const elapsedSince = (now: number) => now - downAt

  const promoteWhenDue = (now: number): HoldResult => {
    if (phase === 'pending' && elapsedSince(now) >= holdMs) phase = 'held'
    return result(phase)
  }

  const down = (x: number, y: number, now: number): HoldResult => {
    phase = 'pending'
    originX = x
    originY = y
    downAt = now
    return result(phase)
  }

  const move = (x: number, y: number, now: number): HoldResult => {
    if (phase === 'idle') return result('idle')
    if (phase === 'held') return result('held')
    const drifted = Math.hypot(x - originX, y - originY) > moveTolerance
    if (drifted && elapsedSince(now) < holdMs) {
      phase = 'idle'
      return result('cancelled')
    }
    return promoteWhenDue(now)
  }

  const up = (now: number): HoldResult => {
    if (phase === 'idle') return result('idle')
    const tapped = phase === 'pending' && elapsedSince(now) < holdMs
    phase = 'idle'
    return result(tapped ? 'tap' : 'idle')
  }

  const check = (now: number): HoldResult => {
    if (phase === 'idle') return result('idle')
    return promoteWhenDue(now)
  }

  const current = (): HoldResult => result(phase)

  return { down, move, up, check, current }
}
