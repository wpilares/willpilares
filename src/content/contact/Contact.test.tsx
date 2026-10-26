import { mascotBus } from '@mascot'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Contact } from './Contact'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const email = 'wgpilaresc@gmail.com'
const originalLocation = window.location

const stubClipboard = (writeText: (() => Promise<void>) | undefined) => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: writeText === undefined ? undefined : { writeText },
  })
}

const stubLocationAssign = () => {
  const assign = vi.fn()
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { ...originalLocation, assign },
  })
  return assign
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  stubClipboard(undefined)
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: originalLocation,
  })
})

describe('Contact', () => {
  it('copies the email, shows the copied label and emits the copied quip', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard(writeText)
    const emit = vi.spyOn(mascotBus, 'emit')
    render(<Contact />)

    fireEvent.click(screen.getByRole('button', { name: email }))

    await vi.waitFor(() => {
      expect(screen.getByRole('button', { name: 'contact.copied' })).toBeInTheDocument()
    })
    expect(writeText).toHaveBeenCalledWith(email)
    expect(emit).toHaveBeenCalledWith({ type: 'quip', key: 'copied' })
    expect(screen.getByRole('status')).toHaveTextContent('contact.copied')
  })

  it('restores the email label after the feedback delay', async () => {
    stubClipboard(vi.fn().mockResolvedValue(undefined))
    render(<Contact />)

    fireEvent.click(screen.getByRole('button', { name: email }))
    await vi.waitFor(() => {
      expect(screen.getByRole('button', { name: 'contact.copied' })).toBeInTheDocument()
    })

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByRole('button', { name: email })).toBeInTheDocument()
  })

  it('falls back to a mailto navigation when the clipboard is unavailable', () => {
    stubClipboard(undefined)
    const assign = stubLocationAssign()
    const emit = vi.spyOn(mascotBus, 'emit')
    render(<Contact />)

    fireEvent.click(screen.getByRole('button', { name: email }))

    expect(assign).toHaveBeenCalledWith(`mailto:${email}`)
    expect(emit).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: email })).toBeInTheDocument()
  })

  it('falls back to a mailto navigation when writing to the clipboard fails', async () => {
    stubClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    const assign = stubLocationAssign()
    render(<Contact />)

    fireEvent.click(screen.getByRole('button', { name: email }))

    await vi.waitFor(() => expect(assign).toHaveBeenCalledWith(`mailto:${email}`))
    expect(screen.getByRole('button', { name: email })).toBeInTheDocument()
  })
})
