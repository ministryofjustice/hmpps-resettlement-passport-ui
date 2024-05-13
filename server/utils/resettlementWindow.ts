import { differenceInCalendarDays } from 'date-fns'

export function isInResettlementWindowDays(daysToRelease: number): boolean {
  return daysToRelease <= 84
}

export function isInResettlementWindow(releaseDate: string, now = new Date()): boolean {
  if (!releaseDate) {
    return false
  }
  return isInResettlementWindowDays(differenceInCalendarDays(releaseDate, now))
}
