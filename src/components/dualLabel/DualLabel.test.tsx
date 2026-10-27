import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DualLabel } from './DualLabel'

describe('DualLabel', () => {
  it('renders the themed and the plain text inside one control', () => {
    render(
      <a href="#contact">
        <DualLabel themed="Send a raven" plain="Message me" />
      </a>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveTextContent('Send a raven')
    expect(link).toHaveTextContent('Message me')
  })

  it('gives the control an accessible name that contains both labels', () => {
    render(
      <a href="#contact">
        <DualLabel themed="Send a raven" plain="Message me" />
      </a>
    )

    expect(screen.getByRole('link', { name: /^Send a raven,\s*Message me$/ })).toBeInTheDocument()
  })

  it('can keep the themed text on touch screens when it carries the information', () => {
    const { container } = render(
      <DualLabel themed="wgpilaresc@gmail.com" plain="Copy my email" onTouch="themed" />
    )

    expect(container.querySelector('.dual-label')).toHaveClass('dual-label--touch-themed')
  })

  it('shows the plain text on touch screens by default', () => {
    const { container } = render(<DualLabel themed="Send a raven" plain="Message me" />)

    expect(container.querySelector('.dual-label')).not.toHaveClass('dual-label--touch-themed')
  })

  it('marks which text is themed and which is plain for the swap styles', () => {
    const { container } = render(<DualLabel themed="Send a raven" plain="Message me" />)

    expect(container.querySelector('.dual-label__themed')).toHaveTextContent('Send a raven')
    expect(container.querySelector('.dual-label__plain')).toHaveTextContent('Message me')
  })
})
