import type { GestureName } from '../gestures'
import type { QuipKey } from './bus'

export type ScrollDirection = 'up' | 'down'

export type ScrollQuipInput = {
  readonly direction: ScrollDirection
  readonly isMobile: boolean
  readonly shownKeys: ReadonlySet<QuipKey>
}

export const TRICK_GESTURES: readonly GestureName[] = ['wave', 'cheer', 'lick', 'stretch', 'purr']

export const pickScrollQuip = ({
  direction,
  isMobile,
  shownKeys,
}: ScrollQuipInput): QuipKey | null => {
  if (isMobile && !shownKeys.has('mobile')) return 'mobile'
  if (direction === 'up' && !shownKeys.has('scrollBack')) return 'scrollBack'
  return null
}

export const randomTrickGesture = (random: () => number): GestureName => {
  const lastIndex = TRICK_GESTURES.length - 1
  const index = Math.min(lastIndex, Math.max(0, Math.floor(random() * TRICK_GESTURES.length)))
  return TRICK_GESTURES[index] ?? 'wave'
}
