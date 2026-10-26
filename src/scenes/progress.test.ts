import { describe, expect, it } from 'vitest'
import { activeSceneIndex, fogOpacity, parallaxOffset, segment } from './progress'

describe('segment', () => {
  it('maps progress inside the window to 0..1', () => {
    expect(segment(0.5, 0.25, 0.75)).toBe(0.5)
    expect(segment(0.25, 0.25, 0.75)).toBe(0)
    expect(segment(0.75, 0.25, 0.75)).toBe(1)
  })

  it('clamps progress outside the window', () => {
    expect(segment(0.1, 0.25, 0.75)).toBe(0)
    expect(segment(0.9, 0.25, 0.75)).toBe(1)
  })

  it('treats an empty window as a step', () => {
    expect(segment(0.4, 0.5, 0.5)).toBe(0)
    expect(segment(0.5, 0.5, 0.5)).toBe(1)
  })
})

describe('fogOpacity', () => {
  it('is fully opaque at both ends', () => {
    expect(fogOpacity(0)).toBe(1)
    expect(fogOpacity(1)).toBe(1)
  })

  it('is clear in the middle', () => {
    expect(fogOpacity(0.5)).toBe(0)
    expect(fogOpacity(0.15)).toBe(0)
    expect(fogOpacity(0.85)).toBe(0)
  })

  it('ramps linearly across the edge', () => {
    expect(fogOpacity(0.075)).toBeCloseTo(0.5)
    expect(fogOpacity(0.925)).toBeCloseTo(0.5)
    expect(fogOpacity(0.1, 0.2)).toBeCloseTo(0.5)
  })

  it('clamps progress outside 0..1', () => {
    expect(fogOpacity(-0.5)).toBe(1)
    expect(fogOpacity(1.5)).toBe(1)
  })
})

describe('parallaxOffset', () => {
  it('is zero at the midpoint and for static layers', () => {
    expect(parallaxOffset(0.5, 1, 120)).toBe(0)
    expect(parallaxOffset(0, 0, 120)).toBe(0)
  })

  it('moves against the scroll direction scaled by depth', () => {
    expect(parallaxOffset(0, 1, 120)).toBe(60)
    expect(parallaxOffset(1, 1, 120)).toBe(-60)
    expect(parallaxOffset(1, 0.5, 120)).toBe(-30)
  })

  it('rounds to two decimals', () => {
    expect(parallaxOffset(0.123, 0.37, 100)).toBe(13.95)
  })
})

describe('activeSceneIndex', () => {
  it('returns 0 for an empty list or nothing reached', () => {
    expect(activeSceneIndex([])).toBe(0)
    expect(activeSceneIndex([0, 0, 0])).toBe(0)
  })

  it('picks the in-progress scene', () => {
    expect(activeSceneIndex([1, 0.4, 0])).toBe(1)
  })

  it('picks the scene with the largest coverage when several are in progress', () => {
    expect(activeSceneIndex([1, 0.9, 0.2, 0])).toBe(1)
    expect(activeSceneIndex([1, 0.3, 0.6, 0])).toBe(2)
  })

  it('falls back to the last completed scene', () => {
    expect(activeSceneIndex([1, 1, 0])).toBe(1)
    expect(activeSceneIndex([1, 1, 1])).toBe(2)
  })
})
