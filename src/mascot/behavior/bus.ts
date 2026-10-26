import type { GestureName } from '../gestures'

export type QuipKey =
  | 'hello'
  | 'grabHint'
  | 'held'
  | 'released'
  | 'mobile'
  | 'scrollBack'
  | 'copied'
  | 'trick'
  | 'sleepy'

export type MascotEvent =
  | { type: 'quip'; key: QuipKey }
  | { type: 'trick' }
  | { type: 'gesture'; name: GestureName }
  | { type: 'travel'; anchor: string }

export type MascotListener = (event: MascotEvent) => void

export type MascotBus = {
  emit(event: MascotEvent): void
  subscribe(listener: MascotListener): () => void
}

export const createMascotBus = (): MascotBus => {
  const listeners = new Set<MascotListener>()

  const emit = (event: MascotEvent) => {
    for (const listener of listeners) listener(event)
  }

  const subscribe = (listener: MascotListener) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  return { emit, subscribe }
}

export const mascotBus = createMascotBus()
