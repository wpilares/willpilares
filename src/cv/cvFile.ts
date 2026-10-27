import { OWNER_FIRST_NAME, OWNER_LAST_NAME } from '../journal/identity'
import type { CvLanguage } from './cvContent'

export const cvLanguages: readonly CvLanguage[] = ['en', 'es']

export const cvFileName = (language: CvLanguage): string =>
  `CV_${OWNER_FIRST_NAME}_${OWNER_LAST_NAME}_${language}.pdf`
