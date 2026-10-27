import { describe, expect, it } from 'vitest'
import en from '../../../public/locales/en/translation.json'
import es from '../../../public/locales/es/translation.json'
import { OWNER_NAME } from '../identity'
import { glyphLanguages, glyphTitleIds } from './glyphIds'
import { glyphSources } from './glyphOutline'
import { glyphTitles } from './glyphTitles.generated'

const sources = glyphSources({ en, es }, OWNER_NAME)

describe('generated glyph titles', () => {
  it('outlines exactly the declared titles', () => {
    expect(Object.keys(glyphTitles).sort()).toEqual([...glyphTitleIds].sort())
  })

  it.each(
    glyphTitleIds.flatMap((id) => glyphLanguages.map((language) => [id, language] as const))
  )('keeps %s (%s) in sync with the locale copy', (id, language) => {
    const outline = glyphTitles[id][language]
    expect(outline.text).toBe(sources[id][language])
    expect(outline.d.length).toBeGreaterThan(0)
    expect(outline.width).toBeGreaterThan(0)
    expect(outline.height).toBeGreaterThan(0)
  })
})
