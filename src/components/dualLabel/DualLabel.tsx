export type DualLabelProps = {
  readonly themed: string
  readonly plain: string
}

export const DualLabel = ({ themed, plain }: DualLabelProps) => (
  <span className="dual-label">
    <span className="dual-label__themed">{themed}</span>
    <span className="dual-label__separator sr-only">, </span>
    <span className="dual-label__plain">{plain}</span>
  </span>
)
