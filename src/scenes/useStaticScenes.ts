import { usePrefersReducedMotion } from '@hooks'
import { useMediaQuery } from './useMediaQuery'

export const narrowViewportQuery = '(max-width: 767px)'

export const useStaticScenes = (): boolean => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isNarrow = useMediaQuery(narrowViewportQuery)
  return prefersReducedMotion || isNarrow
}
