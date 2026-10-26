import { useIntersectionObserver, usePrefersReducedMotion } from '@hooks'
import { createElement, Fragment } from 'react'
import { type MotionVars, revealedClass, staggerIndex } from './motionVars'
import { useRevealOnMount } from './useRevealOnMount'

export interface MaskedTextProps {
  text: string
  as?: 'h1' | 'h2' | 'p' | 'span'
  className?: string
  immediate?: boolean
  delayMs?: number
  staggerMs?: number
}

const splitWords = (text: string) => text.split(/\s+/).filter((word) => word.length > 0)

export const MaskedText = ({
  text,
  as = 'span',
  className = '',
  immediate = false,
  delayMs = 0,
  staggerMs = 45,
}: MaskedTextProps) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [ref, isIntersecting] = useIntersectionObserver<HTMLElement>({ threshold: 0.2 })
  const revealedOnMount = useRevealOnMount(ref, immediate)
  const revealed = prefersReducedMotion || revealedOnMount || isIntersecting
  const style: MotionVars = { '--base': `${delayMs}ms`, '--stagger': `${staggerMs}ms` }

  const words = splitWords(text).map((word, index) => (
    <Fragment key={`${index}-${word}`}>
      {index > 0 ? ' ' : null}
      <span className="word-mask" aria-hidden="true">
        <span className="word-mask__inner" style={staggerIndex(index)}>
          {word}
        </span>
      </span>
    </Fragment>
  ))

  return createElement(
    as,
    {
      ref,
      className: `${className} ${revealedClass(revealed)}`.trim(),
      style,
      'aria-label': text,
    },
    words
  )
}
