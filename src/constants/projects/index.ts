import type { Project } from '@/types'

export const netpulseProject: Project = {
  key: 'netpulse',
  stack: [
    'Python 3.14',
    'OS-Ken',
    'Mininet',
    'FastAPI',
    'TimescaleDB 2.30',
    'PostgreSQL 18',
    'React 19',
    'TypeScript',
    'WebSockets',
    'Docker Compose',
  ],
  lines: ['one', 'two', 'three', 'four', 'five'],
  screenshot: {
    src: '/projects/netpulse-dashboard.jpg',
    alt: 'NetPulse dashboard with network summary and open alerts',
    width: 1200,
    height: 900,
  },
  facts: [
    { value: '5 s', labelKey: 'interval', reading: 5, dialMax: 10 },
    { value: '~15 s', labelKey: 'detection', reading: 15, dialMax: 60 },
    { value: '6', labelKey: 'releases', reading: 6, dialMax: 6 },
  ],
  version: 'v1.0',
  status: 'complete',
  repoUrl: 'https://github.com/wpilares/netpulse',
}
