import { MotionProvider } from '@components'
import { act, render, screen } from '@testing-library/react'
import { motionValue } from 'motion/react'
import { describe, expect, it } from 'vitest'
import { SceneStageContext } from './SceneContext'
import { SceneReveal } from './SceneReveal'

const renderReveal = (initial: number, isStatic: boolean) => {
  const progress = motionValue(initial)
  render(
    <MotionProvider>
      <SceneStageContext.Provider value={{ progress, isStatic }}>
        <SceneReveal start={0.2} end={0.4} exitStart={0.8} exitEnd={0.9}>
          <button type="button">Plate</button>
        </SceneReveal>
      </SceneStageContext.Provider>
    </MotionProvider>
  )
  const wrapper = screen.getByText('Plate', { ignore: false }).parentElement
  if (!wrapper) throw new Error('reveal wrapper missing')
  return { progress, wrapper }
}

describe('SceneReveal gating', () => {
  it('makes its content inert and hidden while it is mostly transparent', () => {
    const { wrapper } = renderReveal(0, false)

    expect(wrapper).toHaveAttribute('inert')
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
  })

  it('releases its content once it is mostly visible', () => {
    const { progress, wrapper } = renderReveal(0, false)

    act(() => progress.set(0.5))

    expect(wrapper).not.toHaveAttribute('inert')
    expect(wrapper).not.toHaveAttribute('aria-hidden')
  })

  it('gates its content again when it fades out on exit', () => {
    const { progress, wrapper } = renderReveal(0.5, false)

    act(() => progress.set(0.89))

    expect(wrapper).toHaveAttribute('inert')
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
  })

  it('never gates content in static mode', () => {
    const { wrapper } = renderReveal(0, true)

    expect(wrapper).not.toHaveAttribute('inert')
    expect(wrapper).not.toHaveAttribute('aria-hidden')
  })
})
