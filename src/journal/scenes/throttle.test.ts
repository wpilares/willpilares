import { describe, expect, it } from 'vitest'
import { createThrottle } from './throttle'

describe('createThrottle', () => {
  it('allows the first call and blocks calls inside the interval', () => {
    let clock = 1000
    const allow = createThrottle(3000, () => clock)
    expect(allow()).toBe(true)
    clock = 2500
    expect(allow()).toBe(false)
    clock = 3999
    expect(allow()).toBe(false)
  })

  it('allows again once the interval has elapsed', () => {
    let clock = 0
    const allow = createThrottle(3000, () => clock)
    expect(allow()).toBe(true)
    clock = 3000
    expect(allow()).toBe(true)
    clock = 4000
    expect(allow()).toBe(false)
  })
})
