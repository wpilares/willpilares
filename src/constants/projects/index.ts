import { Bot, Globe, RadioTower, ShoppingCart } from 'lucide-react'
import type { Project } from '@/types'

export const projectIcons = {
  ShoppingCart,
  Globe,
  Bot,
  RadioTower,
}

export const projectData: Project[] = [
  {
    key: 'netpulse',
    icon: 'RadioTower',
    gradient: 'from-violet-600 to-indigo-700',
    status: 'inProgress',
    stack: ['Python', 'FastAPI', 'OS-Ken', 'Mininet', 'TimescaleDB', 'React', 'Docker'],
    repoUrl: 'https://github.com/wpilares/netpulse',
  },
  {
    key: 'ecommerce',
    icon: 'ShoppingCart',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    key: 'scraping',
    icon: 'Globe',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    key: 'chatbot',
    icon: 'Bot',
    gradient: 'from-purple-500 to-pink-600',
  },
]
