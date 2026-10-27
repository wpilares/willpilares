export const chapterGlyphIds = ['hunter', 'arms', 'hunts', 'lab', 'raven'] as const

export const glyphTitleIds = ['name', ...chapterGlyphIds, 'archive', 'epilogue'] as const

export const glyphLanguages = ['en', 'es'] as const

export type ChapterGlyphId = (typeof chapterGlyphIds)[number]

export type GlyphTitleId = (typeof glyphTitleIds)[number]

export type GlyphLanguage = (typeof glyphLanguages)[number]

export type GlyphOutline = {
  readonly text: string
  readonly d: string
  readonly width: number
  readonly height: number
  readonly baseline: number
}

export type GlyphTitleRecord = Readonly<
  Record<GlyphTitleId, Readonly<Record<GlyphLanguage, GlyphOutline>>>
>
