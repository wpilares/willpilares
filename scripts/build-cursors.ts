import { backdropPalette } from '../src/backdrops/palette'
import { cursorLegend, cursors } from '../src/cursors/art'
import { encodeIndexedPng } from '../src/cursors/exportPng'

declare const Bun: {
  readonly stdout: unknown
  write(destination: URL | unknown, data: Uint8Array | string): Promise<number>
}

const OUTPUT = new URL('../public/cursors/', import.meta.url)
const SCALES = [
  { scale: 1, suffix: '' },
  { scale: 2, suffix: '@2x' },
] as const

const written: string[] = []
for (const cursor of cursors) {
  for (const { scale, suffix } of SCALES) {
    const name = `${cursor.file}${suffix}.png`
    const bytes = encodeIndexedPng(cursor.rows, cursorLegend, backdropPalette, scale)
    await Bun.write(new URL(name, OUTPUT), bytes)
    written.push(`${name} ${bytes.length} B hotspot ${cursor.hotspot.x} ${cursor.hotspot.y}`)
  }
}

await Bun.write(Bun.stdout, `${written.join('\n')}\n`)
