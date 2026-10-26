const techIconUrls: Record<string, string> = {
  React: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  Angular: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg',
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  TypeScript:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  HTML: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  CSS: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',

  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  NestJS: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg',
  Python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  TypeORM: 'https://cdn.simpleicons.org/typeorm',
  '.NET': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg',
  Keycloak: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oauth/oauth-original.svg',

  AWS: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  Azure: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
  Docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  Terraform: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg',
  'CI/CD':
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg',

  PostgreSQL:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  MongoDB: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  OracleDB: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg',
  Claude: 'https://cdn.simpleicons.org/claude',
  OpenCode: 'https://cdn.simpleicons.org/opencode/9ca3af',
  MCP: 'https://cdn.simpleicons.org/modelcontextprotocol/9ca3af',
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

const plate = (name: string): SkillPlate => ({ name, iconUrl: techIconUrls[name] ?? '' })

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
