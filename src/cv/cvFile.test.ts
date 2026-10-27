import { describe, expect, it } from 'vitest'
import { cvFileName, cvHref, cvLanguages } from './cvFile'

describe('cvFileName', () => {
  it('names one PDF per supported language', () => {
    expect(cvLanguages.map(cvFileName)).toEqual([
      'CV_Willber_Pilares_en.pdf',
      'CV_Willber_Pilares_es.pdf',
    ])
  })
})

describe('cvHref', () => {
  it('points Spanish readers, regional variants included, to the Spanish CV', () => {
    expect(cvHref('es')).toBe('/cv/CV_Willber_Pilares_es.pdf')
    expect(cvHref('es-PE')).toBe('/cv/CV_Willber_Pilares_es.pdf')
  })

  it('falls back to the English CV for any other or missing language', () => {
    expect(cvHref('en')).toBe('/cv/CV_Willber_Pilares_en.pdf')
    expect(cvHref('fr')).toBe('/cv/CV_Willber_Pilares_en.pdf')
    expect(cvHref(undefined)).toBe('/cv/CV_Willber_Pilares_en.pdf')
  })
})
