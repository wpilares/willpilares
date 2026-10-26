import type { PixelBuffer } from './painter'

export class BackdropRenderError extends Error {
  constructor() {
    super('Canvas 2d context is unavailable for backdrops')
    this.name = 'BackdropRenderError'
  }
}

const toImageData = (buffer: PixelBuffer): ImageData =>
  new ImageData(new Uint8ClampedArray(buffer.toRgba()), buffer.width, buffer.height)

const renderOffscreen = async (buffer: PixelBuffer): Promise<string | null> => {
  if (typeof OffscreenCanvas === 'undefined') return null
  const canvas = new OffscreenCanvas(buffer.width, buffer.height)
  const context = canvas.getContext('2d')
  if (context === null) return null
  context.putImageData(toImageData(buffer), 0, 0)
  const blob = await canvas.convertToBlob({ type: 'image/png' })
  return URL.createObjectURL(blob)
}

const renderDocument = (buffer: PixelBuffer): string => {
  const canvas = document.createElement('canvas')
  canvas.width = buffer.width
  canvas.height = buffer.height
  const context = canvas.getContext('2d')
  if (context === null) throw new BackdropRenderError()
  context.putImageData(toImageData(buffer), 0, 0)
  return canvas.toDataURL('image/png')
}

export const renderBackdrop = async (buffer: PixelBuffer): Promise<string> =>
  (await renderOffscreen(buffer)) ?? renderDocument(buffer)
