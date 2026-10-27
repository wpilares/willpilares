import { MotionProvider } from '@components'
import { SceneProvider } from '@scenes'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Hunts } from './Hunts'

const bullets = ['Led a squad of 5 developers', 'Cut costs by 30%', 'Shipped 6+ apps']

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) =>
      options?.returnObjects === true && key.endsWith('.descriptions') ? bullets : key,
    i18n: { language: 'en' },
  }),
}))

class StubIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

const originalMatchMedia = window.matchMedia

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')

const restore = (name: 'showModal' | 'close', descriptor: PropertyDescriptor | undefined) => {
  if (descriptor === undefined) Reflect.deleteProperty(HTMLDialogElement.prototype, name)
  else Object.defineProperty(HTMLDialogElement.prototype, name, descriptor)
}

const showModal = vi.fn(function (this: HTMLDialogElement) {
  this.setAttribute('open', '')
})

const closeDialog = vi.fn(function (this: HTMLDialogElement) {
  this.removeAttribute('open')
  this.dispatchEvent(new Event('close'))
})

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
  vi.stubGlobal('IntersectionObserver', StubIntersectionObserver)
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: showModal,
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: closeDialog,
  })
})

afterEach(() => {
  window.matchMedia = originalMatchMedia
  vi.unstubAllGlobals()
  showModal.mockClear()
  closeDialog.mockClear()
  restore('showModal', originalShowModal)
  restore('close', originalClose)
})

const renderHunts = () =>
  render(
    <MotionProvider>
      <SceneProvider>
        <Hunts />
      </SceneProvider>
    </MotionProvider>
  )

const openFirstRecord = () => {
  const [trigger] = screen.getAllByRole('button', { name: 'journal.hunts.readMore' })
  if (!trigger) throw new Error('record trigger missing')
  trigger.focus()
  fireEvent.click(trigger)
  const dialog = screen.getByRole('dialog')
  return { trigger, dialog }
}

describe('full hunt record', () => {
  it('replaces the inline details with a button', () => {
    const { container } = renderHunts()

    expect(container.querySelector('details')).toBeNull()
    expect(screen.getAllByRole('button', { name: 'journal.hunts.readMore' })).toHaveLength(4)
  })

  it('opens a modal record with the company, period, role and every bullet', () => {
    renderHunts()
    const { dialog } = openFirstRecord()

    expect(showModal).toHaveBeenCalledTimes(1)
    expect(within(dialog).getByRole('heading', { name: 'Whitelion Technology' })).toBeVisible()
    expect(dialog).toHaveTextContent('experience.companies.whitelion.period')
    expect(dialog).toHaveTextContent('experience.companies.whitelion.position')
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(bullets.length)
    expect(dialog.querySelectorAll('strong.text-ember').length).toBeGreaterThan(0)
  })

  it('closes the record and returns focus to its trigger', () => {
    renderHunts()
    const { trigger, dialog } = openFirstRecord()

    fireEvent.click(within(dialog).getByRole('button', { name: 'journal.hunts.closeRecord' }))

    expect(dialog).not.toHaveAttribute('open')
    expect(document.activeElement).toBe(trigger)
  })

  it('returns focus to its trigger when the record is dismissed with Escape', () => {
    renderHunts()
    const { trigger, dialog } = openFirstRecord()
    within(dialog).getByRole('button', { name: 'journal.hunts.closeRecord' }).focus()

    dialog.removeAttribute('open')
    fireEvent(dialog, new Event('close'))

    expect(document.activeElement).toBe(trigger)
  })
})
