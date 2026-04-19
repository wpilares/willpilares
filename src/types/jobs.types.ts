export interface JobData {
  company: string
  image: string
  descriptions: string[]
  stack: string[]
}

export interface JobsProps {
  data: JobData
  index?: number
}
