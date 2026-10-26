import type { SpriteFrame } from './sprite'

export type GestureName =
  | 'idle'
  | 'walk'
  | 'sit'
  | 'lick'
  | 'stretch'
  | 'cheer'
  | 'sulk'
  | 'sleep'
  | 'wave'
  | 'purr'

export const GESTURE_NAMES: readonly GestureName[] = [
  'idle',
  'walk',
  'sit',
  'lick',
  'stretch',
  'cheer',
  'sulk',
  'sleep',
  'wave',
  'purr',
]

export type GestureDefinition = {
  readonly frames: readonly SpriteFrame[]
  readonly frameDuration: number
  readonly loop: boolean
}

export type GestureSet = Readonly<Record<GestureName, GestureDefinition>>

export type GestureState = {
  readonly name: GestureName
  readonly frameIndex: number
  readonly frame: SpriteFrame
}

export type GestureCompleteListener = (name: GestureName) => void

export type GestureMachine = {
  play(name: GestureName): void
  tick(deltaMs: number): void
  current(): GestureState
  onComplete(listener: GestureCompleteListener): () => void
}

const IDLE: GestureName = 'idle'

export const createGestureSet = (builder: (name: GestureName) => GestureDefinition): GestureSet =>
  GESTURE_NAMES.reduce<Partial<Record<GestureName, GestureDefinition>>>((set, name) => {
    set[name] = builder(name)
    return set
  }, {}) as GestureSet

export const createGestureMachine = (
  gestures: GestureSet,
  initial: GestureName = IDLE
): GestureMachine => {
  let name = initial
  let frameIndex = 0
  let elapsed = 0
  const listeners = new Set<GestureCompleteListener>()

  const reset = (next: GestureName) => {
    name = next
    frameIndex = 0
    elapsed = 0
  }

  const complete = () => {
    const finished = name
    reset(IDLE)
    for (const listener of listeners) listener(finished)
  }

  const play = (next: GestureName) => {
    if (next === name && gestures[name].loop) return
    reset(next)
  }

  const tick = (deltaMs: number) => {
    const { frames, frameDuration, loop } = gestures[name]
    if (frames.length === 0 || frameDuration <= 0 || deltaMs <= 0) return
    const cycleMs = frames.length * frameDuration
    elapsed += Math.min(deltaMs, cycleMs)
    while (elapsed >= frameDuration) {
      elapsed -= frameDuration
      frameIndex += 1
      if (frameIndex < frames.length) continue
      if (loop) {
        frameIndex = 0
        continue
      }
      complete()
      return
    }
  }

  const current = (): GestureState => {
    const { frames } = gestures[name]
    const frame = frames[frameIndex] ?? frames[0] ?? []
    return { name, frameIndex, frame }
  }

  const onComplete = (listener: GestureCompleteListener) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  return { play, tick, current, onComplete }
}
