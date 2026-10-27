import { describe, expect, it } from 'vitest'
import { cvFileName, cvLanguages } from './cvFile'

describe('cvFileName', () => {
  it('names one PDF per supported language', () => {
    expect(cvLanguages.map(cvFileName)).toEqual([
      'CV_Willber_Pilares_en.pdf',
      'CV_Willber_Pilares_es.pdf',
    ])
  })
})
