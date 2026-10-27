export type PathCommand =
  | { readonly type: 'M'; readonly x: number; readonly y: number }
  | { readonly type: 'L'; readonly x: number; readonly y: number }
  | {
      readonly type: 'Q'
      readonly x1: number
      readonly y1: number
      readonly x: number
      readonly y: number
    }
  | {
      readonly type: 'C'
      readonly x1: number
      readonly y1: number
      readonly x2: number
      readonly y2: number
      readonly x: number
      readonly y: number
    }
  | { readonly type: 'Z' }

type Point = { readonly x: number; readonly y: number }

type Segment =
  | { readonly kind: 'line'; readonly to: Point }
  | { readonly kind: 'quad'; readonly control: Point; readonly to: Point }
  | { readonly kind: 'cubic'; readonly start: Point; readonly end: Point; readonly to: Point }

type Contour = {
  readonly start: Point
  readonly segments: Segment[]
  closed: boolean
}

type Instruction = { readonly letter: string; readonly values: readonly number[] }

const point = (x: number, y: number): Point => ({ x: Math.round(x), y: Math.round(y) })

const same = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y

const reflect = (control: Point, around: Point): Point => ({
  x: around.x * 2 - control.x,
  y: around.y * 2 - control.y,
})

const segmentFor = (command: Exclude<PathCommand, { type: 'M' | 'Z' }>): Segment => {
  if (command.type === 'L') return { kind: 'line', to: point(command.x, command.y) }
  if (command.type === 'Q') {
    return {
      kind: 'quad',
      control: point(command.x1, command.y1),
      to: point(command.x, command.y),
    }
  }
  return {
    kind: 'cubic',
    start: point(command.x1, command.y1),
    end: point(command.x2, command.y2),
    to: point(command.x, command.y),
  }
}

const toContours = (commands: readonly PathCommand[]): Contour[] => {
  const contours: Contour[] = []
  for (const command of commands) {
    const current = contours.at(-1)
    if (command.type === 'M') {
      contours.push({ start: point(command.x, command.y), segments: [], closed: false })
    } else if (command.type === 'Z') {
      if (current) current.closed = true
    } else {
      current?.segments.push(segmentFor(command))
    }
  }
  return contours
}

const isDegenerate = (segment: Segment, from: Point): boolean => {
  if (segment.kind === 'line') return same(segment.to, from)
  if (segment.kind === 'quad') return same(segment.to, from) && same(segment.control, from)
  return same(segment.to, from) && same(segment.start, from) && same(segment.end, from)
}

const continuesLine = (from: Point, middle: Point, to: Point): boolean => {
  const ax = middle.x - from.x
  const ay = middle.y - from.y
  const bx = to.x - middle.x
  const by = to.y - middle.y
  return ax * by - ay * bx === 0 && ax * bx + ay * by > 0
}

const simplify = (contour: Contour): Segment[] => {
  const kept: Segment[] = []
  const origins: Point[] = []
  let from = contour.start
  for (const segment of contour.segments) {
    if (isDegenerate(segment, from)) continue
    const previous = kept.at(-1)
    const origin = origins.at(-1)
    if (
      segment.kind === 'line' &&
      previous?.kind === 'line' &&
      origin &&
      continuesLine(origin, previous.to, segment.to)
    ) {
      kept[kept.length - 1] = segment
    } else {
      kept.push(segment)
      origins.push(from)
    }
    from = segment.to
  }
  const last = kept.at(-1)
  if (contour.closed && last?.kind === 'line' && same(last.to, contour.start)) kept.pop()
  return kept
}

const lineInstruction = (from: Point, to: Point): Instruction => {
  if (to.y === from.y) return { letter: 'h', values: [to.x - from.x] }
  if (to.x === from.x) return { letter: 'v', values: [to.y - from.y] }
  return { letter: 'l', values: [to.x - from.x, to.y - from.y] }
}

const contourInstructions = (contour: Contour): Instruction[] => {
  const instructions: Instruction[] = [{ letter: 'M', values: [contour.start.x, contour.start.y] }]
  let from = contour.start
  let quadControl: Point | undefined
  let cubicControl: Point | undefined
  for (const segment of simplify(contour)) {
    const dx = segment.to.x - from.x
    const dy = segment.to.y - from.y
    if (segment.kind === 'line') {
      instructions.push(lineInstruction(from, segment.to))
      quadControl = undefined
      cubicControl = undefined
    } else if (segment.kind === 'quad') {
      const smooth = quadControl !== undefined && same(reflect(quadControl, from), segment.control)
      instructions.push(
        smooth
          ? { letter: 't', values: [dx, dy] }
          : {
              letter: 'q',
              values: [segment.control.x - from.x, segment.control.y - from.y, dx, dy],
            }
      )
      quadControl = segment.control
      cubicControl = undefined
    } else {
      const smooth = cubicControl !== undefined && same(reflect(cubicControl, from), segment.start)
      const tail = [segment.end.x - from.x, segment.end.y - from.y, dx, dy]
      instructions.push(
        smooth
          ? { letter: 's', values: tail }
          : { letter: 'c', values: [segment.start.x - from.x, segment.start.y - from.y, ...tail] }
      )
      cubicControl = segment.end
      quadControl = undefined
    }
    from = segment.to
  }
  if (contour.closed) instructions.push({ letter: 'z', values: [] })
  return instructions
}

const joinValues = (values: readonly number[]): string =>
  values.reduce<string>((text, value, index) => {
    const number = String(value)
    if (index === 0 || number.startsWith('-')) return text + number
    return `${text} ${number}`
  }, '')

export const compactPathData = (commands: readonly PathCommand[]): string => {
  let previousLetter = ''
  let data = ''
  for (const contour of toContours(commands)) {
    for (const { letter, values } of contourInstructions(contour)) {
      const repeats = letter === previousLetter && letter !== 'z' && letter !== 'M'
      const separator = repeats && !String(values[0]).startsWith('-') ? ' ' : ''
      data += (repeats ? separator : letter) + joinValues(values)
      previousLetter = letter
    }
  }
  return data
}
