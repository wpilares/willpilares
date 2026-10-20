export interface TextSegment {
  value: string
  isMetric: boolean
  offset: number
}

const groupedNumber = String.raw`\d{1,3}(?:,\d{3})*`
const unitWords = '(?:minutes|minutos|developers|desarrolladores)'

const metricPattern = new RegExp(
  [
    String.raw`~\d+(?:\.\d+)?%`,
    String.raw`más de ${groupedNumber}\+?`,
    String.raw`(?<![\w,.])${groupedNumber}\+`,
    String.raw`(?<![\w,.])\d+ ${unitWords}\b`,
  ].join('|'),
  'g'
)

export const splitMetrics = (text: string): TextSegment[] => {
  const segments: TextSegment[] = []
  let cursor = 0

  for (const match of text.matchAll(metricPattern)) {
    const start = match.index
    if (start > cursor)
      segments.push({ value: text.slice(cursor, start), isMetric: false, offset: cursor })
    segments.push({ value: match[0], isMetric: true, offset: start })
    cursor = start + match[0].length
  }

  if (cursor < text.length)
    segments.push({ value: text.slice(cursor), isMetric: false, offset: cursor })

  return segments
}
