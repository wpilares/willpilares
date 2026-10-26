import { describe, expect, it } from 'vitest'
import { TALLY_CAP, TALLY_GROUP_SIZE, tallyGroups } from './tally'

describe('tallyGroups', () => {
  it('splits a count into five-bar groups and loose marks', () => {
    expect(tallyGroups(8)).toEqual({ full: 1, remainder: 3 })
    expect(tallyGroups(10)).toEqual({ full: 2, remainder: 0 })
    expect(tallyGroups(4)).toEqual({ full: 0, remainder: 4 })
  })

  it('draws nothing for zero, negative or non-finite counts', () => {
    expect(tallyGroups(0)).toEqual({ full: 0, remainder: 0 })
    expect(tallyGroups(-3)).toEqual({ full: 0, remainder: 0 })
    expect(tallyGroups(Number.NaN)).toEqual({ full: 0, remainder: 0 })
  })

  it('floors fractional counts', () => {
    expect(tallyGroups(7.9)).toEqual({ full: 1, remainder: 2 })
  })

  it('caps the drawn marks at thirty', () => {
    expect(TALLY_CAP).toBe(30)
    expect(TALLY_GROUP_SIZE).toBe(5)
    expect(tallyGroups(30)).toEqual({ full: 6, remainder: 0 })
    expect(tallyGroups(42)).toEqual({ full: 6, remainder: 0 })
    expect(tallyGroups(Number.POSITIVE_INFINITY)).toEqual({ full: 0, remainder: 0 })
  })
})
