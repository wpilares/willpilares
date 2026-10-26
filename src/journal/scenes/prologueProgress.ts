export const PROLOGUE_INTRO_END = 0.5

const clampUnit = (value: number): number => Math.min(1, Math.max(0, value))

export const prologueProgress = (intro: number, exit: number): number => {
  const introduced = Math.min(clampUnit(intro), PROLOGUE_INTRO_END)
  const exited = clampUnit(exit)
  if (exited === 0) return introduced
  return Math.max(introduced, PROLOGUE_INTRO_END + (1 - PROLOGUE_INTRO_END) * exited)
}
