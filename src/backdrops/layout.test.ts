import { describe, expect, it } from 'vitest'
import { isPanoramaLayer, layerWidth, panoramaOverflow } from './layout'

describe('backdrop layout', () => {
  it('marks only the gallery mid and near layers as panoramas', () => {
    expect(isPanoramaLayer('gallery', 'mid')).toBe(true)
    expect(isPanoramaLayer('gallery', 'near')).toBe(true)
    expect(isPanoramaLayer('gallery', 'far')).toBe(false)
    expect(isPanoramaLayer('city', 'mid')).toBe(false)
    expect(layerWidth('gallery', 'near')).toBe(960)
    expect(layerWidth('lab', 'near')).toBe(320)
  })

  it('measures how far a panorama overflows its container', () => {
    expect(panoramaOverflow(1280, 720)).toBe(2560)
    expect(panoramaOverflow(4000, 180)).toBe(0)
  })
})
