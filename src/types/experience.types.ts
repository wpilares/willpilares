export interface CompanyData {
  key: string
  company: string
  image: string
  stack: string[]
}

export interface ExperienceData {
  companies: CompanyData[]
}
