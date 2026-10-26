import { LazyMotion } from 'motion/react'
import type { ReactNode } from 'react'

type MotionProviderProps = {
  children: ReactNode
}

const loadMotionFeatures = () => import('./motionFeatures').then((module) => module.default)

export const MotionProvider = ({ children }: MotionProviderProps) => (
  <LazyMotion features={loadMotionFeatures} strict>
    {children}
  </LazyMotion>
)
