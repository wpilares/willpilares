import type { CSSProperties } from 'react'

export type MotionVars = CSSProperties & {
  '--i'?: number
  '--base'?: string
  '--stagger'?: string
}

export const staggerIndex = (index: number): MotionVars => ({ '--i': index })

export const baseDelay = (milliseconds: number): MotionVars => ({ '--base': `${milliseconds}ms` })

export const revealedClass = (revealed: boolean) => (revealed ? 'is-revealed' : '')
