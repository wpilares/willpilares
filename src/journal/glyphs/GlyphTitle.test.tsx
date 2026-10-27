import { render, screen, waitFor } from '@testing-library/react'
import { motionValue } from 'motion/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GlyphTitle } from './GlyphTitle'
import { glyphMeasures } from './glyphMeasures.generated'
import { nameOutline } from './glyphName.generated'
import { glyphPaths as enPaths } from './glyphTitles.en.generated'
import { glyphPaths as esPaths } from './glyphTitles.es.generated'

const i18nState = { language: 'en' }

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: i18nState }),
}))

afterEach(() => {
  i18nState.language = 'en'
})

describe('GlyphTitle', () => {
  it('names the heading and reserves the outline box before the outline loads', async () => {
    const { container } = render(<GlyphTitle id="hunts" as="h2" size="3rem" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Career' })).toBeInTheDocument()
    const svg = container.querySelector('svg')
    const { width, height } = glyphMeasures.hunts.en
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('viewBox', `0 0 ${width} ${height}`)
    expect(svg?.style.aspectRatio).toBe(`${width} / ${height}`)
    expect(svg?.style.width).toBe(`calc(${3 * (width / 1000)}rem)`)

    await waitFor(() => expect(container.querySelector('path')).toHaveAttribute('d', enPaths.hunts))
    expect(container.querySelector('path')).toHaveAttribute('fill', 'currentColor')
  })

  it('switches to the spanish outline for regional spanish locales', async () => {
    i18nState.language = 'es-PE'
    const { container } = render(<GlyphTitle id="hunts" as="h2" size="3rem" />)

    expect(screen.getByRole('heading', { name: 'Trayectoria' })).toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveAttribute(
      'viewBox',
      `0 0 ${glyphMeasures.hunts.es.width} ${glyphMeasures.hunts.es.height}`
    )
    await waitFor(() => expect(container.querySelector('path')).toHaveAttribute('d', esPaths.hunts))
  })

  it('renders the name synchronously as a paragraph by default in both languages', () => {
    i18nState.language = 'es'
    const { container } = render(<GlyphTitle id="name" size="4rem" className="text-parchment" />)

    const element = container.firstElementChild
    expect(element?.tagName).toBe('P')
    expect(element).toHaveClass('text-parchment')
    expect(element).toHaveTextContent('Willber Pilares')
    expect(container.querySelector('path')).toHaveAttribute('d', nameOutline.d)
  })

  it('inks the outline stroke and fill from the progress values', () => {
    const { container } = render(
      <GlyphTitle
        id="name"
        as="h1"
        size="4rem"
        strokeProgress={motionValue(0.25)}
        fillProgress={motionValue(0.5)}
      />
    )

    const ink = container.querySelector('g')
    expect(ink).toHaveAttribute('stroke', 'currentColor')
    expect(ink).toHaveAttribute('fill', 'currentColor')
    expect(ink).toHaveAttribute('stroke-dasharray', '1')
    expect(ink?.style.strokeDashoffset).toBe('0.75')
    expect(ink?.style.fillOpacity).toBe('0.5')

    const contours = [...container.querySelectorAll('path')]
    expect(contours.length).toBeGreaterThan(1)
    expect(contours.map((contour) => contour.getAttribute('d')).join('')).toBe(nameOutline.d)
    for (const contour of contours) expect(contour).toHaveAttribute('pathLength', '1')
  })

  it('leaves the stroke off when no progress is given', async () => {
    const { container } = render(<GlyphTitle id="archive" size="3rem" />)

    await waitFor(() =>
      expect(container.querySelector('path')).toHaveAttribute('d', enPaths.archive)
    )
    expect(container.querySelector('path')).not.toHaveAttribute('stroke')
    expect(container.querySelector('path')).not.toHaveAttribute('pathLength')
  })
})
