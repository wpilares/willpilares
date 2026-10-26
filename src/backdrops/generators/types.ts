import type { PixelBuffer } from '../painter'
import type { Rng } from '../prng'

export type BackdropLayers = {
  readonly far: PixelBuffer
  readonly mid: PixelBuffer
  readonly near: PixelBuffer
}

export type BackdropGenerator = (rng: Rng) => BackdropLayers
