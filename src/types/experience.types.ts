export interface CompanyData {
  company: string
  image: string
  descriptions: string[]
  stack: string[]
}

export interface ExperienceData {
  company_0: CompanyData
  company_1: CompanyData
  company_2: CompanyData
}
