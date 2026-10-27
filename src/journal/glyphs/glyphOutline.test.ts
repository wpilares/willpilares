import { describe, expect, it } from 'vitest'
import en from '../../../public/locales/en/translation.json'
import es from '../../../public/locales/es/translation.json'
import { glyphTitleIds } from './glyphIds'
import {
  glyphLanguage,
  glyphSources,
  missingCharacters,
  outlineContours,
  outlineFrame,
  roundTenth,
} from './glyphOutline'

describe('glyphLanguage', () => {
  it('keeps spanish for any es locale', () => {
    expect(glyphLanguage('es')).toBe('es')
    expect(glyphLanguage('es-PE')).toBe('es')
  })

  it('falls back to english for anything else', () => {
    expect(glyphLanguage('en-US')).toBe('en')
    expect(glyphLanguage('fr')).toBe('en')
    expect(glyphLanguage(undefined)).toBe('en')
  })
})

describe('missingCharacters', () => {
  it('lists each unsupported character once in order of appearance', () => {
    const supported = new Set('abc ')
    expect(missingCharacters(['a b', 'cañón', 'ñ!'], (char) => supported.has(char))).toEqual([
      'ñ',
      'ó',
      'n',
      '!',
    ])
  })

  it('returns nothing when every character is covered', () => {
    expect(missingCharacters(['abc'], () => true)).toEqual([])
  })
})

describe('roundTenth', () => {
  it('rounds to one decimal place', () => {
    expect(roundTenth(12.345)).toBe(12.3)
    expect(roundTenth(-0.06)).toBe(-0.1)
  })
})

describe('outlineFrame', () => {
  it('moves the outline to the origin with padding and keeps the baseline', () => {
    expect(outlineFrame({ x1: -5, y1: -853.12, x2: 7652.19, y2: 58.59 }, 20)).toEqual({
      offsetX: 25,
      offsetY: 873.1,
      width: 7697.2,
      height: 951.7,
      baseline: 873.1,
    })
  })
})

describe('outlineContours', () => {
  it('splits path data into one closed contour per move command', () => {
    expect(outlineContours('M0 0L10 0L10 10ZM20 0Q25 5 30 0ZM40 40L41 41Z')).toEqual([
      'M0 0L10 0L10 10Z',
      'M20 0Q25 5 30 0Z',
      'M40 40L41 41Z',
    ])
  })

  it('returns nothing for empty path data', () => {
    expect(outlineContours('')).toEqual([])
  })
})

describe('glyphSources', () => {
  it('reads every title from both locales and keeps the name in both languages', () => {
    const sources = glyphSources({ en, es }, 'Willber Pilares')

    expect(Object.keys(sources)).toEqual([...glyphTitleIds])
    expect(sources.name).toEqual({ en: 'Willber Pilares', es: 'Willber Pilares' })
    expect(sources.hunts).toEqual({
      en: en.journal.chapters.hunts.title,
      es: es.journal.chapters.hunts.title,
    })
    expect(sources.archive.es).toBe(es.journal.archive.title)
    expect(sources.epilogue.en).toBe(en.journal.epilogue.end)
  })
})
