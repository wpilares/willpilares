import type { Project } from '@/types'

export const netpulseProject: Project = {
  key: 'netpulse',
  stack: [
    'Python 3.13',
    'OS-Ken',
    'Mininet',
    'FastAPI',
    'TimescaleDB',
    'React 19',
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
    { value: '≤ 5 s', labelKey: 'detection', reading: 5, dialMax: 60 },
    { value: '4', labelKey: 'releases', reading: 4, dialMax: 5 },
  ],
  version: 'v0.4',
  status: 'inProgress',
  repoUrl: 'https://github.com/wpilares/netpulse',
}
