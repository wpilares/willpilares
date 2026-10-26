export interface HeroStat {
  key: string
  value: number
  suffix: string
}

export const heroStats: HeroStat[] = [
  { key: 'years', value: 7, suffix: '+' },
  { key: 'sso', value: 10, suffix: '+' },
  { key: 'library', value: 8, suffix: '+' },
  { key: 'squad', value: 5, suffix: '' },
]
