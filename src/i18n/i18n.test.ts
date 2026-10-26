import { describe, expect, it } from 'vitest'
import i18n, { documentLanguage } from './index'

describe('i18n configuration', () => {
  it('does not force a language, so the detector can run', () => {
    expect(i18n.options.lng).toBeUndefined()
  })

  it('resolves regional variants to the base language', () => {
    expect(i18n.options.load).toBe('languageOnly')
  })

  it('supports exactly the languages that have translation files', () => {
    expect(i18n.options.supportedLngs).toContain('en')
    expect(i18n.options.supportedLngs).toContain('es')
  })

  it('falls back to English for unsupported languages', () => {
    expect(i18n.options.fallbackLng).toEqual(['en'])
  })

  it('checks the browser language before the html tag', () => {
    const detection = i18n.options.detection as { order: string[] }
    expect(detection.order).toEqual(['localStorage', 'navigator', 'htmlTag'])
  })

  it('mirrors every language change on the html element', () => {
    i18n.emit('languageChanged', 'es-PE')
    expect(document.documentElement.lang).toBe('es')

    i18n.emit('languageChanged', 'en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('starts the html element on the detected language', () => {
    expect(document.documentElement.lang).toBe(
      documentLanguage(i18n.resolvedLanguage ?? i18n.language)
    )
  })
})
