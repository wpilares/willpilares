export type CvContactKey = 'email' | 'linkedin' | 'github'

export type CvContactEntry = {
  readonly key: CvContactKey
  readonly value: string
  readonly href: string
}

export type CvSpokenLanguageKey = 'spanish' | 'english'

export type CvProficiencyKey = 'native' | 'intermediate'

export type CvSpokenLanguage = {
  readonly language: CvSpokenLanguageKey
  readonly proficiency: CvProficiencyKey
}

export const cvContacts: readonly CvContactEntry[] = [
  { key: 'email', value: 'wgpilaresc@gmail.com', href: 'mailto:wgpilaresc@gmail.com' },
  {
    key: 'linkedin',
    value: 'linkedin.com/in/wpilaresc',
    href: 'https://linkedin.com/in/wpilaresc',
  },
  { key: 'github', value: 'github.com/wpilares', href: 'https://github.com/wpilares' },
]

export const cvEducationPeriod = '2013 – 2020'

export const cvSpokenLanguages: readonly CvSpokenLanguage[] = [
  { language: 'spanish', proficiency: 'native' },
  { language: 'english', proficiency: 'intermediate' },
]
