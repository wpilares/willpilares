import { parse } from 'opentype.js'
import en from '../public/locales/en/translation.json'
import es from '../public/locales/es/translation.json'
import {
  type GlyphOutline,
  type GlyphTitleId,
  glyphLanguages,
  glyphTitleIds,
} from '../src/journal/glyphs/glyphIds'
import { glyphSources, missingCharacters, outlineFrame } from '../src/journal/glyphs/glyphOutline'
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
const OUTPUT = new URL('../src/journal/glyphs/glyphTitles.generated.ts', import.meta.url)

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

const outline = (text: string): GlyphOutline => {
  const frame = outlineFrame(
    font.getPath(text, 0, 0, EM, { kerning: true }).getBoundingBox(),
    PADDING
  )
  const path = font.getPath(text, frame.offsetX, frame.offsetY, EM, { kerning: true })
  return {
    text,
    d: path.toPathData(1),
    width: frame.width,
    height: frame.height,
    baseline: frame.baseline,
  }
}

const record = Object.fromEntries(
  glyphTitleIds.map((id) => [
    id,
    Object.fromEntries(
      glyphLanguages.map((language) => [language, outline(sources[id][language])])
    ),
  ])
)

const moduleSource = `import type { GlyphTitleRecord } from './glyphIds'

export const glyphTitles: GlyphTitleRecord = ${JSON.stringify(record, null, 2)}
`

await Bun.write(OUTPUT, moduleSource)
const formatted = Bun.spawnSync(['bunx', 'biome', 'format', '--write', OUTPUT.pathname])
if (formatted.exitCode !== 0) throw new Error('Biome could not format the generated glyph titles.')

const generated: readonly GlyphTitleId[] = glyphTitleIds
await Bun.write(Bun.stdout, `Outlined ${generated.length} titles: ${generated.join(', ')}\n`)
