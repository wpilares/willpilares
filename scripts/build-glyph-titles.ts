import { parse } from 'opentype.js'
import en from '../public/locales/en/translation.json'
import es from '../public/locales/es/translation.json'
import {
  type GlyphLanguage,
  type GlyphOutline,
  glyphLanguages,
  glyphTitleIds,
  lazyGlyphIds,
} from '../src/journal/glyphs/glyphIds'
import { glyphSources, missingCharacters, outlineFrame } from '../src/journal/glyphs/glyphOutline'
import { compactPathData } from '../src/journal/glyphs/pathData'
import { OWNER_NAME } from '../src/journal/identity'

declare const Bun: {
  readonly env: Readonly<Record<string, string | undefined>>
  readonly stdout: unknown
  file(path: string | URL): { exists(): Promise<boolean>; arrayBuffer(): Promise<ArrayBuffer> }
  write(destination: URL | unknown, data: string): Promise<number>
  spawnSync(command: readonly string[]): { readonly exitCode: number }
}

const EM = 1000
const PADDING = 24
const GLYPHS_DIR = new URL('../src/journal/glyphs/', import.meta.url)

const fontPath = Bun.env.JOURNAL_DISPLAY_FONT
if (!fontPath) {
  throw new Error('JOURNAL_DISPLAY_FONT is not set. Point it at the display font TTF or OTF file.')
}
const fontFile = Bun.file(fontPath)
if (!(await fontFile.exists())) {
  throw new Error(`JOURNAL_DISPLAY_FONT points to a missing file: ${fontPath}`)
}

const font = parse(await fontFile.arrayBuffer())
const sources = glyphSources({ en, es }, OWNER_NAME)
const texts = glyphTitleIds.flatMap((id) => glyphLanguages.map((language) => sources[id][language]))
const missing = missingCharacters(texts, (char) => font.hasChar(char))
if (missing.length > 0) {
  throw new Error(
    `The display font has no glyph for: ${missing.map((char) => `"${char}"`).join(', ')}`
  )
}
if (sources.name.en !== sources.name.es) {
  throw new Error('The name outline is shared by both languages, so its text must match.')
}

const outline = (text: string): GlyphOutline => {
  const frame = outlineFrame(
    font.getPath(text, 0, 0, EM, { kerning: true }).getBoundingBox(),
    PADDING
  )
  const path = font.getPath(text, frame.offsetX, frame.offsetY, EM, { kerning: true })
  return { text, width: frame.width, height: frame.height, d: compactPathData(path.commands) }
}

const outlines = Object.fromEntries(
  lazyGlyphIds.map((id) => [
    id,
    Object.fromEntries(
      glyphLanguages.map((language) => [language, outline(sources[id][language])])
    ),
  ])
)

const json = (value: unknown): string => JSON.stringify(value, null, 2)

const modules: readonly (readonly [string, string])[] = [
  [
    'glyphName.generated.ts',
    `import type { GlyphOutline } from './glyphIds'

export const nameOutline: GlyphOutline = ${json(outline(sources.name.en))}
`,
  ],
  [
    'glyphMeasures.generated.ts',
    `import type { GlyphMeasureRecord } from './glyphIds'

export const glyphMeasures: GlyphMeasureRecord = ${json(
      Object.fromEntries(
        lazyGlyphIds.map((id) => [
          id,
          Object.fromEntries(
            glyphLanguages.map((language) => {
              const { text, width, height } = outlines[id][language]
              return [language, { text, width, height }]
            })
          ),
        ])
      )
    )}
`,
  ],
  ...glyphLanguages.map(
    (language: GlyphLanguage) =>
      [
        `glyphTitles.${language}.generated.ts`,
        `import type { GlyphPathRecord } from './glyphIds'

export const glyphPaths: GlyphPathRecord = ${json(
          Object.fromEntries(lazyGlyphIds.map((id) => [id, outlines[id][language].d]))
        )}
`,
      ] as const
  ),
]

for (const [file, source] of modules) {
  const output = new URL(file, GLYPHS_DIR)
  await Bun.write(output, source)
  const formatted = Bun.spawnSync(['bunx', 'biome', 'format', '--write', output.pathname])
  if (formatted.exitCode !== 0) throw new Error(`Biome could not format ${file}.`)
}

await Bun.write(
  Bun.stdout,
  `Outlined ${glyphTitleIds.length} titles into ${modules.map(([file]) => file).join(', ')}\n`
)
