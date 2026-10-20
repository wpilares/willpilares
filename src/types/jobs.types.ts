export interface JobData {
  company: string
  position: string
  period: string
  image: string
  descriptions: string[]
  stack: string[]
}

export interface JobsProps {
  data: JobData
  isCurrent?: boolean
}
