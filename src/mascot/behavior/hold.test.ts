import { describe, expect, it } from 'vitest'
import { createHoldDetector } from './hold'

describe('createHoldDetector', () => {
  it('starts idle', () => {
    const detector = createHoldDetector()

    expect(detector.current()).toEqual({ kind: 'idle' })
  })

  it('becomes pending on pointer down', () => {
    const detector = createHoldDetector()

    expect(detector.down(10, 10, 0)).toEqual({ kind: 'pending' })
  })

  it('reports a tap when released before the hold threshold', () => {
    const detector = createHoldDetector({ holdMs: 250 })
    detector.down(10, 10, 0)

    expect(detector.up(100)).toEqual({ kind: 'tap' })
    expect(detector.current()).toEqual({ kind: 'idle' })
  })

  it('becomes held when the pointer stays down past the threshold without moving', () => {
    const detector = createHoldDetector({ holdMs: 250 })
    detector.down(10, 10, 0)

    expect(detector.check(249)).toEqual({ kind: 'pending' })
    expect(detector.check(250)).toEqual({ kind: 'held' })
    expect(detector.move(12, 12, 300)).toEqual({ kind: 'held' })
  })

  it('becomes held on a small move past the threshold', () => {
    const detector = createHoldDetector({ holdMs: 250, moveTolerance: 6 })
    detector.down(10, 10, 0)

    expect(detector.move(13, 10, 100)).toEqual({ kind: 'pending' })
    expect(detector.move(14, 10, 260)).toEqual({ kind: 'held' })
  })

  it('cancels when the pointer moves beyond tolerance before the threshold', () => {
    const detector = createHoldDetector({ holdMs: 250, moveTolerance: 6 })
    detector.down(10, 10, 0)

    expect(detector.move(20, 10, 100)).toEqual({ kind: 'cancelled' })
    expect(detector.current()).toEqual({ kind: 'idle' })
    expect(detector.up(150)).toEqual({ kind: 'idle' })
  })

  it('keeps following moves beyond tolerance once held', () => {
    const detector = createHoldDetector({ holdMs: 250, moveTolerance: 6 })
    detector.down(10, 10, 0)
    detector.check(300)

    expect(detector.move(200, 200, 400)).toEqual({ kind: 'held' })
  })

  it('returns to idle when released after being held', () => {
    const detector = createHoldDetector({ holdMs: 250 })
    detector.down(10, 10, 0)
    detector.check(300)

    expect(detector.up(400)).toEqual({ kind: 'idle' })
    expect(detector.current()).toEqual({ kind: 'idle' })
  })

  it('does not report a tap when released late without any check', () => {
    const detector = createHoldDetector({ holdMs: 250 })
    detector.down(10, 10, 0)

    expect(detector.up(900)).toEqual({ kind: 'idle' })
  })

  it('ignores moves and checks while idle', () => {
    const detector = createHoldDetector()

    expect(detector.move(1, 1, 10)).toEqual({ kind: 'idle' })
    expect(detector.check(10)).toEqual({ kind: 'idle' })
  })

  it('uses the defaults of 250 ms and 6 px', () => {
    const detector = createHoldDetector()
    detector.down(0, 0, 0)

    expect(detector.move(6, 0, 10)).toEqual({ kind: 'pending' })
    expect(detector.check(250)).toEqual({ kind: 'held' })
  })
})
