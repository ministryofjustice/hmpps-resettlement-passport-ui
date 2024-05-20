import { differenceInCalendarDays } from 'date-fns'

export function isInPreReleaseWindowDays(daysToRelease: number): boolean {
  return daysToRelease <= 84
}

export function isInPreReleaseWindow(releaseDate: string, now = new Date()): boolean {
  if (!releaseDate) {
    return false
  }
  return isInPreReleaseWindowDays(differenceInCalendarDays(releaseDate, now))
}
