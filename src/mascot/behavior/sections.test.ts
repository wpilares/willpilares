import { describe, expect, it } from 'vitest'
import { pickActiveSection, readSectionTarget } from './sections'

const createSection = (attributes: Record<string, string>): Element => {
  const element = document.createElement('section')
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value)
  return element
}

describe('readSectionTarget', () => {
  it('reads side, gesture and outfit from the data attributes', () => {
    const element = createSection({
      'data-mascot': 'right',
      'data-mascot-gesture': 'thumbs',
      'data-mascot-outfit': 'netpulse',
    })

    expect(readSectionTarget(element)).toEqual({
      side: 'right',
      gesture: 'thumbs',
      outfit: 'netpulse',
      element,
    })
  })

  it('falls back to idle and default when gesture and outfit are missing', () => {
    const element = createSection({ 'data-mascot': 'badge' })

    expect(readSectionTarget(element)).toMatchObject({
      side: 'badge',
      gesture: 'idle',
      outfit: 'default',
    })
  })

  it('falls back when gesture, outfit or side are unknown', () => {
    const element = createSection({
      'data-mascot': 'sideways',
      'data-mascot-gesture': 'moonwalk',
      'data-mascot-outfit': 'tuxedo',
    })

    expect(readSectionTarget(element)).toMatchObject({
      side: 'left',
      gesture: 'idle',
      outfit: 'default',
    })
  })
})

describe('pickActiveSection', () => {
  const hero = createSection({ 'data-mascot': 'hero' })
  const about = createSection({ 'data-mascot': 'left' })
  const projects = createSection({ 'data-mascot': 'right' })

  it('picks the intersecting entry with the highest ratio', () => {
    const picked = pickActiveSection(
      [
        { target: hero, intersectionRatio: 0.25, isIntersecting: true },
        { target: about, intersectionRatio: 0.75, isIntersecting: true },
        { target: projects, intersectionRatio: 1, isIntersecting: false },
      ],
      hero
    )

    expect(picked).toBe(about)
  })

  it('keeps the previous section when nothing intersects', () => {
    const picked = pickActiveSection(
      [
        { target: hero, intersectionRatio: 0, isIntersecting: false },
        { target: about, intersectionRatio: 0, isIntersecting: false },
      ],
      about
    )

    expect(picked).toBe(about)
  })

  it('returns null when nothing intersects and there is no previous section', () => {
    expect(
      pickActiveSection([{ target: hero, intersectionRatio: 0, isIntersecting: false }], null)
    ).toBeNull()
  })

  it('keeps the previous section on a ratio tie', () => {
    const picked = pickActiveSection(
      [
        { target: hero, intersectionRatio: 0.5, isIntersecting: true },
        { target: about, intersectionRatio: 0.5, isIntersecting: true },
      ],
      about
    )

    expect(picked).toBe(about)
  })

  it('picks the first best entry on a tie when the previous one is not among them', () => {
    const picked = pickActiveSection(
      [
        { target: hero, intersectionRatio: 0.5, isIntersecting: true },
        { target: about, intersectionRatio: 0.5, isIntersecting: true },
      ],
      projects
    )

    expect(picked).toBe(hero)
  })
})
