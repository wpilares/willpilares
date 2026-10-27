import { describe, expect, it } from 'vitest'
import en from '../../../public/locales/en/translation.json'
import es from '../../../public/locales/es/translation.json'
import { OWNER_NAME } from '../identity'
import { type GlyphLanguage, glyphLanguages, lazyGlyphIds } from './glyphIds'
import { glyphMeasures } from './glyphMeasures.generated'
import { nameOutline } from './glyphName.generated'
import { glyphSources } from './glyphOutline'
import { glyphPaths as enPaths } from './glyphTitles.en.generated'
import { glyphPaths as esPaths } from './glyphTitles.es.generated'

const sources = glyphSources({ en, es }, OWNER_NAME)
const pathsByLanguage = { en: enPaths, es: esPaths } as const satisfies Record<
  GlyphLanguage,
  typeof enPaths
>

describe('generated glyph titles', () => {
  it('outlines the shared name for both languages', () => {
    expect(nameOutline.text).toBe(sources.name.en)
    expect(nameOutline.text).toBe(sources.name.es)
    expect(nameOutline.d.length).toBeGreaterThan(0)
    expect(nameOutline.width).toBeGreaterThan(0)
    expect(nameOutline.height).toBeGreaterThan(0)
  })

  it('measures and outlines exactly the lazily loaded titles', () => {
    expect(Object.keys(glyphMeasures)).toEqual([...lazyGlyphIds])
    for (const language of glyphLanguages) {
      expect(Object.keys(pathsByLanguage[language])).toEqual([...lazyGlyphIds])
    }
  })

  it.each(
    lazyGlyphIds.flatMap((id) => glyphLanguages.map((language) => [id, language] as const))
  )('keeps %s (%s) in sync with the locale copy', (id, language) => {
    const measure = glyphMeasures[id][language]
    expect(measure.text).toBe(sources[id][language])
    expect(measure.width).toBeGreaterThan(0)
    expect(measure.height).toBeGreaterThan(0)
    expect(pathsByLanguage[language][id].length).toBeGreaterThan(0)
  })
})
