import {
  createGestureSet,
  type GestureDefinition,
  type GestureName,
  type GestureSet,
} from '../gestures'
import { framesFor } from './frames'

const timings: Readonly<Record<GestureName, number>> = {
  idle: 650,
  walk: 130,
  sit: 900,
  lick: 220,
  stretch: 300,
  cheer: 240,
  sulk: 800,
  sleep: 800,
  wave: 280,
  purr: 400,
}

const define = (name: GestureName): GestureDefinition => ({
  frames: framesFor(name),
  frameDuration: timings[name],
  loop: true,
})

export const createMascotGestures = (): GestureSet => createGestureSet(define)
