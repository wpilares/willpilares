import { useEffect, useState } from 'react'
import type { GlyphLanguage, GlyphPathRecord } from './glyphIds'

const loaders: Readonly<Record<GlyphLanguage, () => Promise<GlyphPathRecord>>> = {
  en: () => import('./glyphTitles.en.generated').then((module) => module.glyphPaths),
  es: () => import('./glyphTitles.es.generated').then((module) => module.glyphPaths),
}

const loaded = new Map<GlyphLanguage, GlyphPathRecord>()
const requests = new Map<GlyphLanguage, Promise<GlyphPathRecord | undefined>>()

export const loadGlyphTitles = (language: GlyphLanguage): Promise<GlyphPathRecord | undefined> => {
  const existing = requests.get(language)
  if (existing) return existing
  const request = loaders[language]().then(
    (paths) => {
      loaded.set(language, paths)
      return paths
    },
    () => {
      requests.delete(language)
      return undefined
    }
  )
  requests.set(language, request)
  return request
}

export const useGlyphTitles = (language: GlyphLanguage): GlyphPathRecord | undefined => {
  const [, setLoadedCount] = useState(loaded.size)

  useEffect(() => {
    if (loaded.has(language)) return
    let active = true
    loadGlyphTitles(language).then(() => {
      if (active) setLoadedCount(loaded.size)
    })
    return () => {
      active = false
    }
  }, [language])

  return loaded.get(language)
}
