import { MotionProvider } from '@components'
import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FogVeil } from './FogVeil'
import { scenes } from './registry'
import { Scene } from './Scene'
import { SceneProvider } from './SceneProvider'
import { SceneReveal } from './SceneReveal'
import { useActiveScene } from './useActiveScene'

const originalMatchMedia = window.matchMedia

const mockMatchMedia = (matchingQueries: readonly string[]) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: matchingQueries.includes(query),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

const hunter = scenes.find((scene) => scene.id === 'hunter')

if (!hunter) throw new Error('hunter scene missing from the registry')

const ActiveSceneProbe = () => <output>{useActiveScene()}</output>

const renderScene = () =>
  render(
    <MotionProvider>
      <SceneProvider>
        <Scene meta={hunter}>
          <SceneReveal start={0.1} end={0.3} exitStart={0.8} exitEnd={0.95}>
            <p>The hunter's tale</p>
          </SceneReveal>
          <FogVeil />
        </Scene>
        <ActiveSceneProbe />
      </SceneProvider>
    </MotionProvider>
  )

const stageOf = (section: HTMLElement): HTMLElement | null =>
  section.querySelector('[data-scene-stage]')

afterEach(() => {
  window.matchMedia = originalMatchMedia
})

describe('Scene', () => {
  it('maps the meta onto the section', () => {
    mockMatchMedia([])
    const { container } = renderScene()
    const section = container.querySelector('section')

    expect(section).toHaveAttribute('id', 'about')
    expect(section).toHaveAttribute('data-scene', 'hunter')
    expect(section).toHaveAttribute('data-mascot', hunter.mascotSide)
    expect(section).toHaveAttribute('data-mascot-gesture', hunter.mascotGesture)
    expect(section).toHaveAttribute('data-mascot-outfit', hunter.mascotOutfit)
  })

  it('pins a tall stage when motion is allowed', () => {
    mockMatchMedia([])
    const { container } = renderScene()
    const section = container.querySelector('section')

    if (!section) throw new Error('section not rendered')
    expect(section.style.height).toBe('220svh')
    expect(stageOf(section)).toHaveClass('sticky')
    expect(container.querySelector('[data-fog-veil]')).not.toBeNull()
  })

  it('renders a static stage under reduced motion', () => {
    mockMatchMedia(['(prefers-reduced-motion: reduce)'])
    const { container } = renderScene()
    const section = container.querySelector('section')

    if (!section) throw new Error('section not rendered')
    expect(section.style.height).toBe('')
    expect(stageOf(section)).not.toHaveClass('sticky')
    expect(stageOf(section)).toHaveClass('min-h-svh')
    expect(container.querySelector('[data-fog-veil]')).toBeNull()
  })

  it('renders a static stage on narrow viewports', () => {
    mockMatchMedia(['(max-width: 767px)'])
    const { container } = renderScene()
    const section = container.querySelector('section')

    if (!section) throw new Error('section not rendered')
    expect(section.style.height).toBe('')
    expect(stageOf(section)).not.toHaveClass('sticky')
  })

  it('reports a completed static scene as active', async () => {
    mockMatchMedia(['(prefers-reduced-motion: reduce)'])
    renderScene()
    await act(async () => {})

    expect(screen.getByRole('status')).toHaveTextContent('hunter')
  })
})

describe('SceneReveal', () => {
  it('renders its children', () => {
    mockMatchMedia([])
    renderScene()

    expect(screen.getByText("The hunter's tale")).toBeInTheDocument()
  })
})
