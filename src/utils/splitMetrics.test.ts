import { describe, expect, it } from 'vitest'
import { splitMetrics } from './splitMetrics'

const metricsOf = (text: string) =>
  splitMetrics(text)
    .filter((segment) => segment.isMetric)
    .map((segment) => segment.value)

describe('splitMetrics', () => {
  it('returns a single plain segment when the text has no metrics', () => {
    expect(splitMetrics('Built PDF services on AWS S3 in 2021.')).toEqual([
      { value: 'Built PDF services on AWS S3 in 2021.', isMetric: false, offset: 0 },
    ])
  })

  it('splits plus-suffixed numbers into metric segments', () => {
    expect(splitMetrics('used daily by 2,000+ workers.')).toEqual([
      { value: 'used daily by ', isMetric: false, offset: 0 },
      { value: '2,000+', isMetric: true, offset: 14 },
      { value: ' workers.', isMetric: false, offset: 20 },
    ])
  })

  it('detects approximate percentages and counts in english bullets', () => {
    expect(
      metricsOf('adopted by 8+ projects, cutting time by ~40%, across 10+ apps and 10,000+ records')
    ).toEqual(['8+', '~40%', '10+', '10,000+'])
  })

  it('detects durations and team sizes', () => {
    expect(metricsOf('Lead a squad of 5 developers, under 15 minutes')).toEqual([
      '5 developers',
      '15 minutes',
    ])
  })

  it('detects spanish metric phrasing', () => {
    expect(
      metricsOf(
        'Lidero un squad de 5 desarrolladores, usadas por más de 2,000 trabajadores, ~30% y menos de 15 minutos'
      )
    ).toEqual(['5 desarrolladores', 'más de 2,000', '~30%', '15 minutos'])
  })

  it('preserves the original text when segments are joined', () => {
    const text = 'Built 6+ apps and reduced latency by ~30% for 5 developers.'
    expect(
      splitMetrics(text)
        .map((segment) => segment.value)
        .join('')
    ).toBe(text)
  })
})
