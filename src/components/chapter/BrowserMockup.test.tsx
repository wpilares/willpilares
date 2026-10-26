import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BrowserMockup } from './BrowserMockup'

const screenshot = {
  src: '/projects/netpulse-dashboard.jpg',
  alt: 'NetPulse dashboard with network summary and open alerts',
  width: 1200,
  height: 900,
}

describe('BrowserMockup', () => {
  it('renders the screenshot with its alt text and intrinsic size', () => {
    render(<BrowserMockup screenshot={screenshot} title="NetPulse" />)

    const image = screen.getByRole('img', { name: screenshot.alt })
    expect(image).toHaveAttribute('src', screenshot.src)
    expect(image).toHaveAttribute('width', '1200')
    expect(image).toHaveAttribute('height', '900')
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('decoding', 'async')
  })

  it('shows the local URL pill and the version label', () => {
    render(<BrowserMockup screenshot={screenshot} title="NetPulse" version="v0.4" />)

    expect(screen.getByText('localhost:3000')).toBeInTheDocument()
    expect(screen.getByText('v0.4')).toBeInTheDocument()
  })

  it('omits the version label when no version is given', () => {
    render(<BrowserMockup screenshot={screenshot} title="NetPulse" />)

    expect(screen.queryByText(/^v\d/)).toBeNull()
  })

  it('keeps the image hidden until the frame intersects', () => {
    const { container } = render(<BrowserMockup screenshot={screenshot} title="NetPulse" />)

    const image = container.querySelector('img')
    expect(image).toHaveClass('pop')
    expect(image).not.toHaveClass('is-revealed')
  })
})
