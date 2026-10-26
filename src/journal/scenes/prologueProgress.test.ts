import { describe, expect, it } from 'vitest'
import { PROLOGUE_INTRO_END, prologueProgress } from './prologueProgress'

describe('prologueProgress', () => {
  it('follows the intro while the page rests at the top', () => {
    expect(prologueProgress(0, 0)).toBe(0)
    expect(prologueProgress(0.3, 0)).toBe(0.3)
    expect(prologueProgress(PROLOGUE_INTRO_END, 0)).toBe(0.5)
  })

  it('maps the exit scroll onto the second half', () => {
    expect(prologueProgress(PROLOGUE_INTRO_END, 0.5)).toBe(0.75)
    expect(prologueProgress(PROLOGUE_INTRO_END, 1)).toBe(1)
  })

  it('never lets an unfinished intro hold back the scroll', () => {
    expect(prologueProgress(0.1, 0.6)).toBe(0.8)
  })

  it('clamps both inputs', () => {
    expect(prologueProgress(-1, -1)).toBe(0)
    expect(prologueProgress(2, 2)).toBe(1)
  })
})
