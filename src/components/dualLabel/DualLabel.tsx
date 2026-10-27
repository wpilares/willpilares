export type DualLabelProps = {
  readonly themed: string
  readonly plain: string
  readonly onTouch?: 'plain' | 'themed'
}

export const DualLabel = ({ themed, plain, onTouch = 'plain' }: DualLabelProps) => (
  <span className={onTouch === 'themed' ? 'dual-label dual-label--touch-themed' : 'dual-label'}>
    <span className="dual-label__themed">{themed}</span>
    <span className="dual-label__separator sr-only">, </span>
    <span className="dual-label__plain">{plain}</span>
  </span>
)
