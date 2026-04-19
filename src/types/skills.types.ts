export interface SkillItem {
  name: string
  iconUrl: string
}

export interface SkillCategory {
  title: string
  skills: SkillItem[]
}
