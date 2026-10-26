export interface DeviceMockupProps {
  title: string
  accentLabel: string
}

const skeletonRows = ['first', 'second', 'third'] as const

export const DeviceMockup = ({ title, accentLabel }: DeviceMockupProps) => (
  <div
    aria-hidden="true"
    className="mx-auto flex aspect-[9/19] w-full max-w-[320px] flex-col overflow-hidden rounded-[2rem] border-4 border-ink bg-paper text-ink shadow-[8px_8px_0_0_rgba(11,11,12,0.35)]"
  >
    <div className="label-mono flex items-center justify-between border-b border-ink/10 px-6 pb-2 pt-4 text-[0.65rem]">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-ink" />
        <span className="h-1.5 w-1.5 rounded-full bg-ink" />
        <span className="h-1.5 w-1.5 rounded-full bg-ink/30" />
      </span>
    </div>

    <div className="flex items-center justify-between px-5 py-4">
      <span className="font-display text-lg font-semibold tracking-tight">{title}</span>
      <span className="h-7 w-7 rounded-full bg-ink/10" />
    </div>

    <div className="flex flex-1 flex-col gap-3 px-5 pb-6">
      <div className="rounded-2xl bg-blue p-4 text-paper">
        <span className="label-mono text-[0.65rem] opacity-80">{accentLabel}</span>
        <span className="mt-3 block h-2 w-2/3 rounded-full bg-paper/80" />
        <span className="mt-2 block h-2 w-1/3 rounded-full bg-paper/50" />
      </div>

      {skeletonRows.map((row) => (
        <div key={row} className="rounded-2xl border border-ink/10 bg-stone p-4">
          <span className="block h-2 w-1/2 rounded-full bg-ink/10" />
          <span className="mt-2 block h-2 w-5/6 rounded-full bg-ink/10" />
        </div>
      ))}
    </div>
  </div>
)
