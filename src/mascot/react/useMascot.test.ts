import { act, renderHook } from '@testing-library/react'
import type { RefObject } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { resolveAnchor } from '../anchor'
import { mascotBus } from '../behavior/bus'
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

describe('useMascot travel', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('heads for the side of the chapter it is asked to travel to', () => {
    const scale = 4
    const margin = 24
    const section = document.createElement('section')
    section.id = 'skills'
    section.setAttribute('data-mascot', 'right')
    document.body.append(section)
    const canvasRef: RefObject<HTMLCanvasElement> = { current: document.createElement('canvas') }

    const { result } = renderHook(() =>
      useMascot({ canvasRef, reducedMotion: true, scale, margin })
    )
    act(() => mascotBus.emit({ type: 'travel', anchor: 'skills' }))

    const expected = resolveAnchor({
      side: 'right',
      viewport: { width: window.innerWidth, height: window.innerHeight },
      spriteWidth: SPRITE_WIDTH * scale,
      spriteHeight: SPRITE_HEIGHT * scale,
      margin,
      inlineInset: Math.max(margin, (window.innerWidth - 1600) / 2 + margin),
    })
    expect(result.current.position).toEqual({ x: expected.x, y: expected.y })
    expect(result.current.facing).toBe('left')
  })

  it('ignores travel to an anchor that is not on the page', () => {
    const scale = 4
    const margin = 24
    const canvasRef: RefObject<HTMLCanvasElement> = { current: document.createElement('canvas') }
    const { result } = renderHook(() =>
      useMascot({ canvasRef, reducedMotion: true, scale, margin })
    )
    const before = result.current.position

    act(() => mascotBus.emit({ type: 'travel', anchor: 'missing' }))

    expect(result.current.position).toEqual(before)
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
