import { renderHook } from '@testing-library/react'
import type { RefObject } from 'react'
import { describe, expect, it } from 'vitest'
import { SPRITE_HEIGHT, SPRITE_WIDTH } from '../sprite'
import { useMascot, walkSpeed } from './useMascot'

const detachedCanvas: RefObject<HTMLCanvasElement> = { current: null }

describe('useMascot', () => {
  it('starts at the hero anchor instead of the origin before any section observer fires', () => {
    const scale = 4
    const margin = 24

    const { result } = renderHook(() =>
      useMascot({ canvasRef: detachedCanvas, reducedMotion: false, scale, margin })
    )

    expect(result.current.position).toEqual({
      x: Math.round((window.innerWidth - SPRITE_WIDTH * scale) / 2),
      y: window.innerHeight - margin - SPRITE_HEIGHT * scale,
    })
    expect(result.current.position).not.toEqual({ x: 0, y: 0 })
  })
})

describe('walkSpeed', () => {
  it('keeps short trips gentle', () => {
    expect(walkSpeed(0)).toBe(4)
    expect(walkSpeed(50)).toBe(4)
  })

  it('scales with the remaining distance', () => {
    expect(walkSpeed(240)).toBe(10)
  })

  it('caps long trips so they still take about a second', () => {
    expect(walkSpeed(750)).toBe(14)
    expect(walkSpeed(5000)).toBe(14)
  })
})
