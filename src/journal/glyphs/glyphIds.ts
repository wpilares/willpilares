export const chapterGlyphIds = ['hunter', 'arms', 'hunts', 'lab', 'raven'] as const

export const lazyGlyphIds = [...chapterGlyphIds, 'archive', 'epilogue'] as const

export const glyphTitleIds = ['name', ...lazyGlyphIds] as const

export const glyphLanguages = ['en', 'es'] as const

export type ChapterGlyphId = (typeof chapterGlyphIds)[number]

export type LazyGlyphId = (typeof lazyGlyphIds)[number]

export type GlyphTitleId = (typeof glyphTitleIds)[number]

export type GlyphLanguage = (typeof glyphLanguages)[number]

export type GlyphMeasure = {
  readonly text: string
  readonly width: number
  readonly height: number
}

export type GlyphOutline = GlyphMeasure & {
  readonly d: string
}

export type GlyphMeasureRecord = Readonly<
  Record<LazyGlyphId, Readonly<Record<GlyphLanguage, GlyphMeasure>>>
>

export type GlyphPathRecord = Readonly<Record<LazyGlyphId, string>>
