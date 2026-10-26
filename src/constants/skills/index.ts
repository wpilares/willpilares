const techIconSlugs: Record<string, string> = {
  React: 'react',
  Angular: 'angular',
  'Next.js': 'nextjs',
  TypeScript: 'typescript',
  HTML: 'html5',
  CSS: 'css3',
  'Node.js': 'nodejs',
  NestJS: 'nestjs',
  Python: 'python',
  TypeORM: 'typeorm',
  '.NET': 'dotnetcore',
  Keycloak: 'oauth',
  AWS: 'amazonwebservices',
  Azure: 'azure',
  Docker: 'docker',
  Terraform: 'terraform',
  'CI/CD': 'githubactions',
  PostgreSQL: 'postgresql',
  MongoDB: 'mongodb',
  OracleDB: 'oracle',
  Claude: 'claude',
  OpenCode: 'opencode',
  MCP: 'modelcontextprotocol',
}

export type SkillCategoryKey = 'frontend' | 'backend' | 'cloud' | 'databases' | 'ai'

export type SkillPlate = {
  readonly name: string
  readonly iconUrl: string
}

export type SkillShelf = {
  readonly key: SkillCategoryKey
  readonly skills: readonly SkillPlate[]
}

const iconPath = (slug: string | undefined): string =>
  slug === undefined ? '' : `/icons/${slug}.svg`

const plate = (name: string): SkillPlate => ({ name, iconUrl: iconPath(techIconSlugs[name]) })

export const skillShelves: readonly SkillShelf[] = [
  {
    key: 'frontend',
    skills: ['React', 'Angular', 'Next.js', 'TypeScript', 'HTML', 'CSS'].map(plate),
  },
  {
    key: 'backend',
    skills: ['Node.js', 'NestJS', 'Python', '.NET', 'Keycloak', 'TypeORM'].map(plate),
  },
  {
    key: 'cloud',
    skills: ['AWS', 'Azure', 'Docker', 'Terraform', 'CI/CD'].map(plate),
  },
  {
    key: 'databases',
    skills: ['PostgreSQL', 'MongoDB', 'OracleDB'].map(plate),
  },
  {
    key: 'ai',
    skills: ['Claude', 'OpenCode', 'MCP'].map(plate),
  },
]
