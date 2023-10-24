import { convertToTitleCase, initialiseName, convertArrayToCommaSeparatedList, createReferralsSubNav } from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('covert array to comma separated list', () => {
  it.each([
    [null, null, ''],
    ['Empty array', [], ''],
    ['Array length 1', ['cat'], 'cat'],
    ['Array length 2', ['cat', 'dog'], 'cat, dog'],
    ['Array length 3', ['cat', 'dog', 'bird'], 'cat, dog, bird'],
  ])('%s convertArrayToCommaSeparatedList(%s, %s)', (_: string, a: string[], expected: string) => {
    expect(convertArrayToCommaSeparatedList(a)).toEqual(expected)
  })
})

describe('Create referrals subNavigation', () => {
  it.each([
    ['Undefined', undefined, [{ name: 'Referral details', id: 'referral-details' }]],
    ['1 referral', 1, [{ name: 'Referral details', id: 'referral-details' }]],
    [
      '2 referrals',
      2,
      [
        { name: 'Referral 1 details', id: 'referral-details-1' },
        { name: 'Referral 2 details', id: 'referral-details-2' },
      ],
    ],
    [
      '3 referrals',
      3,
      [
        { name: 'Referral 1 details', id: 'referral-details-1' },
        { name: 'Referral 2 details', id: 'referral-details-2' },
        { name: 'Referral 3 details', id: 'referral-details-3' },
      ],
    ],
  ])('%s createReferralsSubNav(%s, %s)', (_: string, a: number, expected: { id: string; name: string }[]) => {
    expect(createReferralsSubNav(a)).toEqual(expected)
  })
})
