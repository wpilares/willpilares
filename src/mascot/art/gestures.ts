import {
  createGestureSet,
  type GestureDefinition,
  type GestureName,
  type GestureSet,
} from '../gestures'
import {
  cheerFrames,
  idleFrames,
  sleepFrames,
  sulkFrames,
  thinkFrames,
  thumbsFrames,
  walkFrames,
  waveFrames,
} from './frames'

const definitions: Readonly<Record<GestureName, GestureDefinition>> = {
  idle: { frames: idleFrames, frameDuration: 600, loop: true },
  wave: { frames: waveFrames, frameDuration: 300, loop: true },
  walk: { frames: walkFrames, frameDuration: 140, loop: true },
  think: { frames: thinkFrames, frameDuration: 800, loop: true },
  thumbs: { frames: thumbsFrames, frameDuration: 800, loop: true },
  cheer: { frames: cheerFrames, frameDuration: 250, loop: true },
  sulk: { frames: sulkFrames, frameDuration: 800, loop: true },
  sleep: { frames: sleepFrames, frameDuration: 700, loop: true },
}

export const createMascotGestures = (): GestureSet => createGestureSet((name) => definitions[name])
