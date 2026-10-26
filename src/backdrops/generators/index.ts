import type { BackdropId } from '../layout'
import { createRng } from '../prng'
import { generateArchive } from './archive'
import { generateArmory } from './armory'
import { generateBelfry } from './belfry'
import { generateCity } from './city'
import { generateGallery } from './gallery'
import { generateLab } from './lab'
import { generatePrologue } from './prologue'
import { generateStreet } from './street'
import type { BackdropGenerator, BackdropLayers } from './types'

export type { BackdropId } from '../layout'
export { GALLERY_FRAME_CENTRES, GALLERY_WIDTH } from './gallery'
export { LAB_MIRROR } from './lab'
export type { BackdropGenerator, BackdropLayers } from './types'

type BackdropSpec = { readonly seed: number; readonly generate: BackdropGenerator }

export const backdropSpecs: Readonly<Record<BackdropId, BackdropSpec>> = {
  prologue: { seed: 0x5eed00, generate: generatePrologue },
  city: { seed: 0x5eed01, generate: generateCity },
  street: { seed: 0x5eed02, generate: generateStreet },
  armory: { seed: 0x5eed03, generate: generateArmory },
  gallery: { seed: 0x5eed04, generate: generateGallery },
  lab: { seed: 0x5eed05, generate: generateLab },
  archive: { seed: 0x5eed06, generate: generateArchive },
  belfry: { seed: 0x5eed07, generate: generateBelfry },
}

export const backdropIds: readonly BackdropId[] = [
  'prologue',
  'city',
  'street',
  'armory',
  'gallery',
  'lab',
  'archive',
  'belfry',
]

export const generateBackdrop = (id: BackdropId): BackdropLayers => {
  const spec = backdropSpecs[id]
  return spec.generate(createRng(spec.seed))
}
