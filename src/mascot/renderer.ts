import type { Viewport } from './anchor'
import type { PixelMatrix } from './sprite'

export type DrawOptions = {
  readonly x: number
  readonly y: number
  readonly scale: number
  readonly flipX: boolean
}

export type Renderer = {
  resize(viewport: Viewport, devicePixelRatio: number): void
  clear(): void
  draw(matrix: PixelMatrix, options: DrawOptions): void
}

export class RendererUnavailableError extends Error {
  constructor() {
    super('Canvas 2d context is unavailable')
    this.name = 'RendererUnavailableError'
  }
}

type Rect = readonly [x: number, y: number]

const groupByColour = (
  matrix: PixelMatrix,
  { x, y, flipX }: DrawOptions,
  step: number
): Map<string, Rect[]> => {
  const originX = Math.round(x)
  const originY = Math.round(y)
  const groups = new Map<string, Rect[]>()
  matrix.pixels.forEach((row, rowIndex) => {
    row.forEach((colour, columnIndex) => {
      if (colour === null) return
      const column = flipX ? matrix.width - 1 - columnIndex : columnIndex
      const rect: Rect = [originX + column * step, originY + rowIndex * step]
      const rects = groups.get(colour)
      if (rects === undefined) groups.set(colour, [rect])
      else rects.push(rect)
    })
  })
  return groups
}

export const createRenderer = (canvas: HTMLCanvasElement): Renderer => {
  const context = canvas.getContext('2d')
  if (context === null) throw new RendererUnavailableError()
  let viewport: Viewport = { width: canvas.width, height: canvas.height }

  const resize = (next: Viewport, devicePixelRatio: number) => {
    viewport = next
    canvas.width = Math.round(next.width * devicePixelRatio)
    canvas.height = Math.round(next.height * devicePixelRatio)
    canvas.style.width = `${next.width}px`
    canvas.style.height = `${next.height}px`
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    context.imageSmoothingEnabled = false
  }

  const clear = () => {
    context.clearRect(0, 0, viewport.width, viewport.height)
  }

  const draw = (matrix: PixelMatrix, options: DrawOptions) => {
    const step = Math.max(1, Math.round(options.scale))
    for (const [colour, rects] of groupByColour(matrix, options, step)) {
      context.fillStyle = colour
      for (const [rectX, rectY] of rects) context.fillRect(rectX, rectY, step, step)
    }
  }

  return { resize, clear, draw }
}
