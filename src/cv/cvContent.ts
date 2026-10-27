import {
  cvContacts,
  cvEducationPeriod,
  cvSpokenLanguages,
  netpulseProject,
  skillShelves,
} from '@/constants'
import type { ExperienceData } from '@/types'
import data from '../../data.json'
import type en from '../../public/locales/en/translation.json'
import { OWNER_NAME } from '../journal/identity'

export type CvTranslation = typeof en

export type CvLanguage = 'en' | 'es'

export type CvSectionKey = keyof CvTranslation['cv']['headings']

export type CvContact = {
  readonly label: string
  readonly value: string
  readonly href: string
}

export type CvExperience = {
  readonly company: string
  readonly position: string
  readonly period: string
  readonly highlights: readonly string[]
}

export type CvSkillGroup = {
  readonly category: string
  readonly skills: readonly string[]
}

export type CvProject = {
  readonly name: string
  readonly status: string
  readonly summary: readonly string[]
  readonly stack: readonly string[]
  readonly url: string
  readonly urlLabel: string
  readonly stackLabel: string
}

export type CvEducation = {
  readonly degree: string
  readonly institution: string
  readonly location: string
  readonly period: string
}

export type CvSpokenLanguageEntry = {
  readonly name: string
  readonly level: string
}

export type CvContent = {
  readonly language: CvLanguage
  readonly name: string
  readonly title: string
  readonly contacts: readonly CvContact[]
  readonly headings: Readonly<Record<CvSectionKey, string>>
  readonly summary: string
  readonly experience: readonly CvExperience[]
  readonly skills: readonly CvSkillGroup[]
  readonly project: CvProject
  readonly education: CvEducation
  readonly languages: readonly CvSpokenLanguageEntry[]
}

type CompanyCopies = CvTranslation['experience']['companies']

type CompanyCopy = CompanyCopies[keyof CompanyCopies]

const { companies }: ExperienceData = data

const stripMarkup = (text: string): string => text.replace(/<\/?[a-z]+>/g, '')

const buildExperience = (copies: CompanyCopies): CvExperience[] => {
  const copyByKey: Readonly<Record<string, CompanyCopy | undefined>> = copies
  return companies.flatMap((company) => {
    const copy = copyByKey[company.key]
    if (copy === undefined) return []
    return [
      {
        company: company.company,
        position: copy.position,
        period: copy.period,
        highlights: copy.descriptions,
      },
    ]
  })
}

export const buildCvContent = (language: CvLanguage, translation: CvTranslation): CvContent => {
  const { journal, cv } = translation
  return {
    language,
    name: OWNER_NAME,
    title: journal.city.role,
    contacts: cvContacts.map((contact) => ({
      label: journal.raven.links[contact.key],
      value: contact.value,
      href: contact.href,
    })),
    headings: cv.headings,
    summary: `${journal.hunter.statement} ${journal.hunter.description}`,
    experience: buildExperience(translation.experience.companies),
    skills: skillShelves.map((shelf) => ({
      category: journal.arms.categories[shelf.key],
      skills: shelf.skills.map((skill) => skill.name),
    })),
    project: {
      name: journal.lab.name,
      status: journal.lab.status[netpulseProject.status],
      summary: netpulseProject.lines.map((line) => stripMarkup(journal.lab.lines[line])),
      stack: netpulseProject.stack,
      url: netpulseProject.repoUrl,
      urlLabel: cv.project.repository,
      stackLabel: cv.project.stack,
    },
    education: {
      degree: cv.education.degree,
      institution: cv.education.institution,
      location: cv.education.location,
      period: cvEducationPeriod,
    },
    languages: cvSpokenLanguages.map((entry) => ({
      name: cv.languages.names[entry.language],
      level: cv.languages.levels[entry.proficiency],
    })),
  }
}
