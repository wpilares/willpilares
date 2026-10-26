import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LanternGlow } from './LanternGlow'

describe('LanternGlow', () => {
  it('centres a screen-blended radial light on the given point', () => {
    const { container } = render(<LanternGlow x={120} y={340} />)
    const glow = container.querySelector<HTMLElement>('[data-lantern-glow]')

    expect(glow).not.toBeNull()
    expect(glow).toHaveAttribute('aria-hidden', 'true')
    expect(glow?.style.getPropertyValue('--lx')).toBe('120px')
    expect(glow?.style.getPropertyValue('--ly')).toBe('340px')
    expect(glow?.style.mixBlendMode).toBe('screen')
    expect(glow?.style.pointerEvents).toBe('none')
  })
})
