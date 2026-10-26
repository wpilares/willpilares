export const backdropPalette = {
  void: '#07060a',
  night: '#0b0a0f',
  stone: '#1c1a21',
  ash: '#2c2833',
  slate: '#3a3542',
  mist: '#5c5866',
  moon: '#c9d6e3',
  moonGlow: '#8fa1b3',
  parchment: '#e9dfc8',
  gold: '#b08d57',
  ember: '#c2452d',
  blood: '#8b1e1e',
  copper: '#9a5b34',
  wood: '#3b2a22',
  woodLight: '#5a4032',
} as const

export type PaletteKey = keyof typeof backdropPalette

export const paletteKeys: readonly PaletteKey[] = [
  'void',
  'night',
  'stone',
  'ash',
  'slate',
  'mist',
  'moon',
  'moonGlow',
  'parchment',
  'gold',
  'ember',
  'blood',
  'copper',
  'wood',
  'woodLight',
]

const indexByKey = new Map<PaletteKey, number>(paletteKeys.map((key, index) => [key, index + 1]))

export const paletteIndex = (key: PaletteKey): number => indexByKey.get(key) ?? 0

export const paletteKeyAt = (index: number): PaletteKey | null => paletteKeys[index - 1] ?? null
