import { describe, expect, it, vi } from 'vitest'
import { placeholderFrame } from './fixtures'
import { createGestureMachine, createGestureSet, type GestureName } from './gestures'
import type { SpriteFrame } from './sprite'

const frames = (count: number): readonly SpriteFrame[] =>
  Array.from({ length: count }, (_, index) => placeholderFrame(`${index}`))

const gestures = createGestureSet((name) => {
  if (name === 'wave') return { frames: frames(2), frameDuration: 100, loop: false }
  if (name === 'walk') return { frames: frames(4), frameDuration: 100, loop: true }
  return { frames: frames(2), frameDuration: 300, loop: true }
})

describe('createGestureSet', () => {
  it('builds a definition for every gesture name', () => {
    const names: readonly GestureName[] = [
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
    for (const name of names) expect(gestures[name].frames.length).toBeGreaterThan(0)
  })
})

describe('createGestureMachine', () => {
  it('starts at idle frame 0', () => {
    const machine = createGestureMachine(gestures)
    expect(machine.current()).toEqual({
      name: 'idle',
      frameIndex: 0,
      frame: gestures.idle.frames[0],
    })
  })

  it('advances frames after frameDuration elapses', () => {
    const machine = createGestureMachine(gestures)
    machine.tick(299)
    expect(machine.current().frameIndex).toBe(0)
    machine.tick(1)
    expect(machine.current().frameIndex).toBe(1)
  })

  it('wraps looping gestures', () => {
    const machine = createGestureMachine(gestures)
    machine.play('walk')
    machine.tick(350)
    expect(machine.current().frameIndex).toBe(3)
    machine.tick(100)
    expect(machine.current()).toMatchObject({ name: 'walk', frameIndex: 0 })
  })

  it('completes one-shot gestures, fires listeners once and returns to idle', () => {
    const machine = createGestureMachine(gestures)
    const listener = vi.fn()
    machine.onComplete(listener)
    machine.play('wave')
    machine.tick(100)
    expect(machine.current()).toMatchObject({ name: 'wave', frameIndex: 1 })
    expect(listener).not.toHaveBeenCalled()
    machine.tick(100)
    expect(machine.current()).toMatchObject({ name: 'idle', frameIndex: 0 })
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith('wave')
    machine.tick(1000)
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('ignores play of the currently looping gesture', () => {
    const machine = createGestureMachine(gestures)
    machine.play('walk')
    machine.tick(150)
    machine.play('walk')
    expect(machine.current().frameIndex).toBe(1)
    machine.tick(50)
    expect(machine.current().frameIndex).toBe(2)
  })

  it('resets elapsed time and frame when playing a different gesture', () => {
    const machine = createGestureMachine(gestures)
    machine.play('walk')
    machine.tick(250)
    machine.play('wave')
    expect(machine.current()).toMatchObject({ name: 'wave', frameIndex: 0 })
    machine.tick(99)
    expect(machine.current().frameIndex).toBe(0)
  })

  it('restarts a one-shot gesture when replayed', () => {
    const machine = createGestureMachine(gestures)
    machine.play('wave')
    machine.tick(100)
    machine.play('wave')
    expect(machine.current()).toMatchObject({ name: 'wave', frameIndex: 0 })
  })

  it('stops notifying unsubscribed listeners', () => {
    const machine = createGestureMachine(gestures)
    const listener = vi.fn()
    const unsubscribe = machine.onComplete(listener)
    unsubscribe()
    machine.play('wave')
    machine.tick(200)
    expect(listener).not.toHaveBeenCalled()
  })

  it('clamps a large delta to a single cycle of a looping gesture', () => {
    const machine = createGestureMachine(gestures)
    machine.play('walk')
    machine.tick(10_000)
    expect(machine.current()).toMatchObject({ name: 'walk', frameIndex: 0 })
    machine.tick(100)
    expect(machine.current().frameIndex).toBe(1)
  })

  it('clamps a large delta on a one-shot gesture to one completion', () => {
    const machine = createGestureMachine(gestures)
    const listener = vi.fn()
    machine.onComplete(listener)
    machine.play('wave')
    machine.tick(10_000)
    expect(machine.current()).toMatchObject({ name: 'idle', frameIndex: 0 })
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('accepts an initial gesture', () => {
    const machine = createGestureMachine(gestures, 'sleep')
    expect(machine.current().name).toBe('sleep')
  })
})
