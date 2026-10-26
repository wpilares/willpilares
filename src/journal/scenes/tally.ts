export const TALLY_GROUP_SIZE = 5
export const TALLY_CAP = 30

export type TallyGroups = {
  readonly full: number
  readonly remainder: number
}

export const tallyGroups = (n: number): TallyGroups => {
  if (!Number.isFinite(n) || n <= 0) return { full: 0, remainder: 0 }
  const marks = Math.min(Math.floor(n), TALLY_CAP)
  return {
    full: Math.floor(marks / TALLY_GROUP_SIZE),
    remainder: marks % TALLY_GROUP_SIZE,
  }
}
