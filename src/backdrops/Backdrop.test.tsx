import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Backdrop } from './Backdrop'

describe('Backdrop', () => {
  it('renders a solid night placeholder before the layers are ready', () => {
    const { container } = render(<Backdrop id="city" />)
    const stage = container.querySelector('[data-backdrop="city"]')
    expect(stage).not.toBeNull()
    expect(stage).toHaveClass('bg-night')
    expect(stage).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('img')).toHaveLength(0)
  })
})
