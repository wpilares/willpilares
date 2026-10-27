import { describe, expect, it } from 'vitest'
import en from '../../public/locales/en/translation.json'
import es from '../../public/locales/es/translation.json'
import { buildCvContent } from './cvContent'

describe('buildCvContent', () => {
  it('opens with the owner name, the current role and the contact links', () => {
    const cv = buildCvContent('en', en)

    expect(cv.language).toBe('en')
    expect(cv.name).toBe('Willber Pilares')
    expect(cv.title).toBe('Senior Software Engineer')
    expect(cv.contacts).toEqual([
      { label: 'Email', value: 'wgpilaresc@gmail.com', href: 'mailto:wgpilaresc@gmail.com' },
      {
        label: 'LinkedIn',
        value: 'linkedin.com/in/wpilaresc',
        href: 'https://linkedin.com/in/wpilaresc',
      },
      { label: 'GitHub', value: 'github.com/wpilares', href: 'https://github.com/wpilares' },
    ])
  })

  it('summarises the profile from the about chapter copy', () => {
    const cv = buildCvContent('en', en)

    expect(cv.summary).toBe(`${en.journal.hunter.statement} ${en.journal.hunter.description}`)
  })

  it('lists the experience newest first with company, role, period and highlights', () => {
    const cv = buildCvContent('en', en)

    expect(cv.experience.map((entry) => entry.company)).toEqual([
      'Whitelion Technology',
      'Softtek',
      'Promitia',
      'América Móvil Perú',
    ])
    expect(cv.experience[0]).toEqual({
      company: 'Whitelion Technology',
      position: 'Software Engineer · Squad Lead',
      period: 'Mar 2025 – Present',
      highlights: en.experience.companies.whitelion.descriptions,
    })
  })

  it('groups the skills under their translated categories', () => {
    const cv = buildCvContent('es', es)

    expect(cv.skills.map((group) => group.category)).toEqual([
      'Frontend',
      'Backend',
      'Cloud & DevOps',
      'Bases de datos',
      'Desarrollo asistido por IA',
    ])
    expect(cv.skills[0]?.skills).toContain('React')
  })

  it('features NetPulse as plain text without markup', () => {
    const cv = buildCvContent('en', en)

    expect(cv.project.name).toBe('NetPulse')
    expect(cv.project.status).toBe('In progress')
    expect(cv.project.url).toBe('https://github.com/wpilares/netpulse')
    expect(cv.project.stack).toContain('OS-Ken')
    expect(cv.project.summary).toHaveLength(5)
    expect(cv.project.summary.join(' ')).not.toMatch(/<\/?accent>/)
    expect(cv.project.summary[0]).toBe(
      "This is NetPulse, a real-time SDN monitoring platform I'm building."
    )
  })

  it('translates the education, languages and headings', () => {
    const cv = buildCvContent('es', es)

    expect(cv.headings.experience).toBe('Experiencia')
    expect(cv.experience[0]?.period).toBe('Mar 2025 – Actualidad')
    expect(cv.education).toEqual({
      degree: 'Bachiller en Ingeniería de Telecomunicaciones',
      institution: 'Universidad Nacional de Ingeniería',
      location: 'Lima, Perú',
      period: '2013 – 2020',
    })
    expect(cv.languages).toEqual([
      { name: 'Español', level: 'Nativo' },
      { name: 'Inglés', level: 'Intermedio' },
    ])
  })
})
