import { isInPreReleaseWindow } from './preReleaseWindow'

test.each([
  ['2024-02-14', 'in'],
  ['2023-02-13', 'in'],
  ['2024-05-08', 'in'],
  ['2025-05-08', 'out of'],
  [null, 'out of'],
  [undefined, 'out of'],
])('given the current date is 2024-05-08 release date %s is %s the pre-release window', (releaseDate, inOrOut) => {
  const expected = inOrOut === 'in'
  expect(isInPreReleaseWindow(releaseDate, new Date('2024-05-08'))).toBe(expected)
})
