import {
  type chapterGlyphIds,
  type GlyphLanguage,
  type GlyphTitleId,
  glyphLanguages,
  glyphTitleIds,
} from './glyphIds'

export type GlyphBox = {
  readonly x1: number
  readonly y1: number
  readonly x2: number
  readonly y2: number
}

export type GlyphFrame = {
  readonly offsetX: number
  readonly offsetY: number
  readonly width: number
  readonly height: number
  readonly baseline: number
}

export type GlyphLocale = {
  readonly journal: {
    readonly chapters: Readonly<
      Record<(typeof chapterGlyphIds)[number], { readonly title: string }>
    >
    readonly archive: { readonly title: string }
    readonly epilogue: { readonly end: string }
  }
}

export type GlyphSources = Readonly<Record<GlyphTitleId, Readonly<Record<GlyphLanguage, string>>>>

export const glyphLanguage = (language: string | undefined): GlyphLanguage =>
  language?.startsWith('es') ? 'es' : 'en'

export const outlineContours = (d: string): string[] => d.split(/(?=M)/).filter(Boolean)

export const roundTenth = (value: number): number => Math.round(value * 10) / 10

export const missingCharacters = (
  texts: readonly string[],
  hasChar: (char: string) => boolean
): string[] => {
  const missing = new Set<string>()
  for (const text of texts) {
    for (const char of text) {
      if (!hasChar(char)) missing.add(char)
    }
  }
  return [...missing]
}

export const outlineFrame = (box: GlyphBox, padding: number): GlyphFrame => {
  const offsetY = roundTenth(padding - box.y1)
  return {
    offsetX: roundTenth(padding - box.x1),
    offsetY,
    width: roundTenth(box.x2 - box.x1 + padding * 2),
    height: roundTenth(box.y2 - box.y1 + padding * 2),
    baseline: offsetY,
  }
}

const localeText = (locale: GlyphLocale, id: GlyphTitleId, name: string): string => {
  if (id === 'name') return name
  if (id === 'archive') return locale.journal.archive.title
  if (id === 'epilogue') return locale.journal.epilogue.end
  return locale.journal.chapters[id].title
}

export const glyphSources = (
  locales: Readonly<Record<GlyphLanguage, GlyphLocale>>,
  name: string
): GlyphSources =>
  Object.fromEntries(
    glyphTitleIds.map((id) => [
      id,
      Object.fromEntries(
        glyphLanguages.map((language) => [language, localeText(locales[language], id, name)])
      ),
    ])
  ) as GlyphSources
