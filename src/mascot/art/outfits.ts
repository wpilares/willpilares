import { createGestureSet, type GestureSet } from '../gestures'
import { composeFrame, type Palette, type SpriteFrame } from '../sprite'
import { chatbotOverlay, ecommerceOverlay, netpulseOverlay, scrapingOverlay } from './overlays'
import { basePalette } from './palettes'

export type OutfitName = 'default' | 'netpulse' | 'ecommerce' | 'scraping' | 'chatbot'

export type Outfit = {
  readonly name: OutfitName
  readonly palette: Palette
  readonly overlay?: SpriteFrame
}

export const OUTFIT_NAMES: readonly OutfitName[] = [
  'default',
  'netpulse',
  'ecommerce',
  'scraping',
  'chatbot',
]

export const outfits: Readonly<Record<OutfitName, Outfit>> = {
  default: { name: 'default', palette: basePalette },
  netpulse: {
    name: 'netpulse',
    palette: { ...basePalette, c: '#0a3149', d: '#061d2c', l: '#1f5a7d', k: '#c2a7f4' },
    overlay: netpulseOverlay,
  },
  ecommerce: {
    name: 'ecommerce',
    palette: { ...basePalette, c: '#d9772b', d: '#a3521a', l: '#f2a65a', a: '#fbfbf8' },
    overlay: ecommerceOverlay,
  },
  scraping: {
    name: 'scraping',
    palette: { ...basePalette, c: '#7a6a4f', d: '#55492f', l: '#a08e6c' },
    overlay: scrapingOverlay,
  },
  chatbot: {
    name: 'chatbot',
    palette: { ...basePalette, c: '#8f6fe0', d: '#5c3fb0', l: '#c2a7f4' },
    overlay: chatbotOverlay,
  },
}

export const applyOutfit = (gestures: GestureSet, outfit: Outfit): GestureSet => {
  const overlay = outfit.overlay
  if (overlay === undefined) return gestures
  return createGestureSet((name) => {
    const definition = gestures[name]
    return { ...definition, frames: definition.frames.map((frame) => composeFrame(frame, overlay)) }
  })
}
