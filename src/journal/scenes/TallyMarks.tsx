import { TALLY_GROUP_SIZE, tallyGroups } from './tally'

type TallyMarksProps = {
  readonly count: number
  readonly className?: string
}

type Stroke = {
  readonly id: string
  readonly x: number
  readonly tilt: number
}

const GROUP_WIDTH = 40
const GROUP_HEIGHT = 36

const strokes: readonly Stroke[] = [
  { id: 'first', x: 6, tilt: 0.8 },
  { id: 'second', x: 14, tilt: -0.6 },
  { id: 'third', x: 22, tilt: 0.4 },
  { id: 'fourth', x: 30, tilt: -0.9 },
]

const strokeProps = {
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'round',
} as const

const TallyGroup = ({ marks, crossed }: { marks: number; crossed: boolean }) => (
  <svg
    aria-hidden="true"
    viewBox={`0 0 ${GROUP_WIDTH} ${GROUP_HEIGHT}`}
    width={GROUP_WIDTH}
    height={GROUP_HEIGHT}
    data-tally-group={crossed ? 'full' : 'partial'}
  >
    {strokes.slice(0, marks).map((stroke) => (
      <line
        key={stroke.id}
        x1={stroke.x - stroke.tilt}
        y1={4}
        x2={stroke.x + stroke.tilt}
        y2={GROUP_HEIGHT - 4}
        {...strokeProps}
      />
    ))}
    {crossed && <line x1={1} y1={GROUP_HEIGHT - 9} x2={GROUP_WIDTH - 3} y2={9} {...strokeProps} />}
  </svg>
)

export const TallyMarks = ({ count, className }: TallyMarksProps) => {
  const { full, remainder } = tallyGroups(count)
  const groupIds = Array.from({ length: full }, (_, position) => `group-${position + 1}`)

  return (
    <div className={className ? `flex flex-wrap gap-1 ${className}` : 'flex flex-wrap gap-1'}>
      {groupIds.map((id) => (
        <TallyGroup key={id} marks={TALLY_GROUP_SIZE - 1} crossed />
      ))}
      {remainder > 0 && <TallyGroup marks={remainder} crossed={false} />}
    </div>
  )
}
