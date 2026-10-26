import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Backdrop } from './Backdrop'
import type { BackdropUrls } from './useBackdrop'

const readyUrls: BackdropUrls = {
  far: 'data:image/png;base64,far',
  mid: 'data:image/png;base64,mid',
  near: 'data:image/png;base64,near',
}

const backdropState = vi.hoisted(() => ({ urls: null as BackdropUrls | null }))

vi.mock('./useBackdrop', () => ({
  useBackdrop: () => backdropState.urls,
}))

afterEach(() => {
  backdropState.urls = null
})

describe('Backdrop', () => {
  it('renders a solid night placeholder before the layers are ready', () => {
    const { container } = render(<Backdrop id="city" />)
    const stage = container.querySelector('[data-backdrop="city"]')
    expect(stage).not.toBeNull()
    expect(stage).toHaveClass('bg-night')
    expect(stage).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('img')).toHaveLength(0)
  })

  it('keeps the far, mid and near layers in static mode so key art stays visible', () => {
    backdropState.urls = readyUrls
    const { container } = render(<Backdrop id="prologue" />)
    const sources = Array.from(container.querySelectorAll('img')).map((image) =>
      image.getAttribute('src')
    )
    expect(sources).toEqual([readyUrls.far, readyUrls.mid, readyUrls.near])
  })

  it('renders static layers without parallax wrappers', () => {
    backdropState.urls = readyUrls
    const { container } = render(<Backdrop id="street" />)
    const layers = container.querySelectorAll('[data-backdrop-layer]')
    expect(layers).toHaveLength(3)
    for (const layer of layers) expect(layer).not.toHaveAttribute('style')
  })
})
