import { describe, expect, it, vi } from 'vitest'
import { createMascotBus, type MascotEvent, mascotBus } from './bus'

describe('createMascotBus', () => {
  it('delivers emitted events to every subscriber', () => {
    const bus = createMascotBus()
    const first = vi.fn()
    const second = vi.fn()
    bus.subscribe(first)
    bus.subscribe(second)
    const event: MascotEvent = { type: 'quip', key: 'hello' }

    bus.emit(event)

    expect(first).toHaveBeenCalledWith(event)
    expect(second).toHaveBeenCalledWith(event)
  })

  it('stops delivering after unsubscribe', () => {
    const bus = createMascotBus()
    const listener = vi.fn()
    const unsubscribe = bus.subscribe(listener)

    unsubscribe()
    bus.emit({ type: 'trick' })

    expect(listener).not.toHaveBeenCalled()
  })

  it('keeps other subscribers when one unsubscribes', () => {
    const bus = createMascotBus()
    const kept = vi.fn()
    const dropped = vi.fn()
    bus.subscribe(kept)
    const unsubscribe = bus.subscribe(dropped)

    unsubscribe()
    bus.emit({ type: 'gesture', name: 'wave' })

    expect(kept).toHaveBeenCalledOnce()
    expect(dropped).not.toHaveBeenCalled()
  })

  it('carries travel events with their anchor', () => {
    const bus = createMascotBus()
    const listener = vi.fn()
    bus.subscribe(listener)

    bus.emit({ type: 'travel', anchor: 'skills' })

    expect(listener).toHaveBeenCalledWith({ type: 'travel', anchor: 'skills' })
  })

  it('carries the purr quip for petting the cat', () => {
    const bus = createMascotBus()
    const listener = vi.fn()
    bus.subscribe(listener)
    const event: MascotEvent = { type: 'quip', key: 'purr' }

    bus.emit(event)

    expect(listener).toHaveBeenCalledWith({ type: 'quip', key: 'purr' })
  })

  it('exposes a shared singleton bus', () => {
    const listener = vi.fn()
    const unsubscribe = mascotBus.subscribe(listener)

    mascotBus.emit({ type: 'quip', key: 'copied' })
    unsubscribe()

    expect(listener).toHaveBeenCalledWith({ type: 'quip', key: 'copied' })
  })
})
