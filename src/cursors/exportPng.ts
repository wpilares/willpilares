const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] as const
const MAX_STORED_BLOCK = 0xffff
const CLEAR = '.'

export type PixelLegend<Key extends string> = Readonly<Record<string, Key>>
export type HexPalette<Key extends string> = Readonly<Record<Key, string>>

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  }
  return value >>> 0
})

const crc32 = (bytes: Uint8Array): number => {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc = (crcTable[(crc ^ byte) & 0xff] ?? 0) ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

const adler32 = (bytes: Uint8Array): number => {
  let low = 1
  let high = 0
  for (const byte of bytes) {
    low = (low + byte) % 65521
    high = (high + low) % 65521
  }
  return ((high << 16) | low) >>> 0
}

const uint32 = (value: number): number[] => [
  (value >>> 24) & 0xff,
  (value >>> 16) & 0xff,
  (value >>> 8) & 0xff,
  value & 0xff,
]

const ascii = (text: string): number[] => Array.from(text, (character) => character.charCodeAt(0))

const chunk = (type: string, data: readonly number[] | Uint8Array): number[] => {
  const body = Uint8Array.from([...ascii(type), ...data])
  return [...uint32(data.length), ...body, ...uint32(crc32(body))]
}

const storedDeflate = (raw: Uint8Array): number[] => {
  const output: number[] = [0x78, 0x01]
  const blockCount = Math.max(1, Math.ceil(raw.length / MAX_STORED_BLOCK))
  for (let blockIndex = 0; blockIndex < blockCount; blockIndex += 1) {
    const block = raw.subarray(blockIndex * MAX_STORED_BLOCK, (blockIndex + 1) * MAX_STORED_BLOCK)
    const last = blockIndex === blockCount - 1 ? 1 : 0
    output.push(last, block.length & 0xff, block.length >>> 8)
    output.push(~block.length & 0xff, (~block.length >>> 8) & 0xff)
    output.push(...block)
  }
  output.push(...uint32(adler32(raw)))
  return output
}

const hexToRgb = (hex: string): number[] => {
  const value = Number.parseInt(hex.slice(1), 16)
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff]
}

export const encodeIndexedPng = <Key extends string>(
  rows: readonly string[],
  legend: PixelLegend<Key>,
  palette: HexPalette<Key>,
  scale: number
): Uint8Array => {
  if (!Number.isInteger(scale) || scale < 1) throw new Error(`invalid scale ${scale}`)
  const sourceHeight = rows.length
  const sourceWidth = rows[0]?.length ?? 0
  if (sourceWidth === 0) throw new Error('empty frame')

  const keys = [...new Set(Object.values<Key>(legend))]
  const indexByKey = new Map<Key, number>(keys.map((key, index) => [key, index + 1]))

  const width = sourceWidth * scale
  const height = sourceHeight * scale
  const raw = new Uint8Array((width + 1) * height)
  rows.forEach((row, sourceY) => {
    if (row.length !== sourceWidth) throw new Error(`row ${sourceY} has width ${row.length}`)
    const line = new Uint8Array(width)
    Array.from(row).forEach((character, sourceX) => {
      const key = character === CLEAR ? undefined : legend[character]
      if (character !== CLEAR && key === undefined) throw new Error(`unknown pixel ${character}`)
      const index = key === undefined ? 0 : (indexByKey.get(key) ?? 0)
      line.fill(index, sourceX * scale, (sourceX + 1) * scale)
    })
    for (let repeat = 0; repeat < scale; repeat += 1) {
      const start = (sourceY * scale + repeat) * (width + 1)
      raw[start] = 0
      raw.set(line, start + 1)
    }
  })

  const header = [...uint32(width), ...uint32(height), 8, 3, 0, 0, 0]
  const plte = [0, 0, 0, ...keys.flatMap((key) => hexToRgb(palette[key]))]

  return Uint8Array.from([
    ...PNG_SIGNATURE,
    ...chunk('IHDR', header),
    ...chunk('PLTE', plte),
    ...chunk('tRNS', [0]),
    ...chunk('IDAT', storedDeflate(raw)),
    ...chunk('IEND', []),
  ])
}
