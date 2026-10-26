import { describe, expect, it } from 'vitest'
import { activeAnchorAt, railState, travelEvent } from './chapterNavigation'

const bands = [
  { anchor: 'prologue', top: 0, bottom: 900 },
  { anchor: 'home', top: 900, bottom: 2700 },
  { anchor: 'about', top: 2700, bottom: 4000 },
  { anchor: 'archive', top: 4000, bottom: 4500 },
  { anchor: 'contact', top: 4500, bottom: 5200 },
]

describe('activeAnchorAt', () => {
  it('returns the band that contains the reading line', () => {
    expect(activeAnchorAt(bands, 450)).toBe('prologue')
    expect(activeAnchorAt(bands, 2700)).toBe('about')
    expect(activeAnchorAt(bands, 4999)).toBe('contact')
  })

  it('falls back to the last band above the line between bands', () => {
    expect(
      activeAnchorAt(
        [bands[0], bands[2]].flatMap((band) => band ?? []),
        1000
      )
    ).toBe('prologue')
  })

  it('returns null before the first band or without bands', () => {
    expect(activeAnchorAt([], 100)).toBeNull()
    expect(activeAnchorAt(bands.slice(2), 10)).toBeNull()
  })
})

describe('railState', () => {
  it('hides the rail over the prologue and the city', () => {
    expect(railState('prologue', null)).toEqual({ visible: false, chapter: null })
    expect(railState('home', null)).toEqual({ visible: false, chapter: null })
    expect(railState(null, null)).toEqual({ visible: false, chapter: null })
  })

  it('marks the chapter whose anchor is active', () => {
    expect(railState('about', null)).toEqual({ visible: true, chapter: 'about' })
    expect(railState('contact', 'about')).toEqual({ visible: true, chapter: 'contact' })
  })

  it('keeps the previous chapter while reading an unchaptered scene', () => {
    expect(railState('archive', 'projects')).toEqual({ visible: true, chapter: 'projects' })
  })
})

describe('travelEvent', () => {
  it('builds the mascot travel event for a chapter anchor', () => {
    expect(travelEvent('skills')).toEqual({ type: 'travel', anchor: 'skills' })
  })
})
