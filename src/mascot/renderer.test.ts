import { describe, expect, it, vi } from 'vitest'
import { createRenderer, RendererUnavailableError } from './renderer'
import type { PixelMatrix } from './sprite'

type FillRectCall = readonly [number, number, number, number]

const createContextStub = () => {
  const fillRect = vi.fn<(x: number, y: number, w: number, h: number) => void>()
  const fillStyleWrites: string[] = []
  const context = {
    fillRect,
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    imageSmoothingEnabled: true,
    set fillStyle(value: string) {
      fillStyleWrites.push(value)
    },
    get fillStyle() {
      return fillStyleWrites[fillStyleWrites.length - 1] ?? ''
    },
  }
  return { context, fillRect, fillStyleWrites }
}

const createCanvasStub = (context: unknown) => {
  const canvas = {
    width: 0,
    height: 0,
    style: { width: '', height: '' },
    getContext: vi.fn(() => context),
  }
  return canvas as unknown as HTMLCanvasElement
}

const matrix: PixelMatrix = {
  width: 2,
  height: 2,
  pixels: [
    ['#111111', null],
    ['#222222', '#111111'],
  ],
}

const rectsOf = (fillRect: ReturnType<typeof createContextStub>['fillRect']): FillRectCall[] =>
  fillRect.mock.calls.map(([x, y, w, h]) => [x, y, w, h] as const)

describe('createRenderer', () => {
  it('throws RendererUnavailableError when the 2d context is missing', () => {
    expect(() => createRenderer(createCanvasStub(null))).toThrow(RendererUnavailableError)
  })

  it('resizes the backing store by dpr and applies the transform', () => {
    const { context } = createContextStub()
    const canvas = createCanvasStub(context)
    const renderer = createRenderer(canvas)
    renderer.resize({ width: 300, height: 150 }, 2)
    expect(canvas.width).toBe(600)
    expect(canvas.height).toBe(300)
    expect(canvas.style.width).toBe('300px')
    expect(canvas.style.height).toBe('150px')
    expect(context.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0)
    expect(context.imageSmoothingEnabled).toBe(false)
  })

  it('clears the whole viewport', () => {
    const { context } = createContextStub()
    const renderer = createRenderer(createCanvasStub(context))
    renderer.resize({ width: 300, height: 150 }, 1)
    renderer.clear()
    expect(context.clearRect).toHaveBeenCalledWith(0, 0, 300, 150)
  })

  it('draws one rect per opaque pixel at scaled integer coordinates', () => {
    const { context, fillRect } = createContextStub()
    const renderer = createRenderer(createCanvasStub(context))
    renderer.draw(matrix, { x: 10, y: 20, scale: 3, flipX: false })
    expect(fillRect).toHaveBeenCalledTimes(3)
    expect(rectsOf(fillRect)).toEqual(
      expect.arrayContaining<FillRectCall>([
        [10, 20, 3, 3],
        [10, 23, 3, 3],
        [13, 23, 3, 3],
      ])
    )
  })

  it('mirrors columns when flipX is set', () => {
    const { context, fillRect } = createContextStub()
    const renderer = createRenderer(createCanvasStub(context))
    renderer.draw(matrix, { x: 0, y: 0, scale: 2, flipX: true })
    expect(rectsOf(fillRect)).toEqual(
      expect.arrayContaining<FillRectCall>([
        [2, 0, 2, 2],
        [2, 2, 2, 2],
        [0, 2, 2, 2],
      ])
    )
    expect(fillRect).toHaveBeenCalledTimes(3)
  })

  it('batches pixels of the same colour into one fillStyle change', () => {
    const { context, fillStyleWrites } = createContextStub()
    const renderer = createRenderer(createCanvasStub(context))
    renderer.draw(matrix, { x: 0, y: 0, scale: 1, flipX: false })
    expect(fillStyleWrites).toHaveLength(2)
    expect(new Set(fillStyleWrites)).toEqual(new Set(['#111111', '#222222']))
  })
})
