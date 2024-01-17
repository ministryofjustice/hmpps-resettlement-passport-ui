import {
  convertToTitleCase,
  initialiseName,
  convertArrayToCommaSeparatedList,
  createReferralsSubNav,
  formatAddress,
} from './utils'
import { CrsReferral } from '../data/model/crsReferralResponse'
import { AppointmentLocation } from '../data/model/appointment'

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
    ['Undefined', undefined, [{ name: 'Referral', id: 'referral' }]],
    ['Null', null, [{ name: 'Referral', id: 'referral' }]],
    ['Empty', [], [{ name: 'Referral', id: 'referral' }]],
    [
      '1 referral',
      [{ contractType: 'The contract type' }],
      [{ name: 'Referral - The contract type', id: 'referral-the-contract-type' }],
    ],
    [
      '2 referral',
      [{ contractType: 'The contract type' }, { contractType: 'Another contract type' }],
      [
        { name: 'Referral - The contract type', id: 'referral-the-contract-type' },
        { name: 'Referral - Another contract type', id: 'referral-another-contract-type' },
      ],
    ],
  ])(
    '%s createReferralsSubNav(%s, %s)',
    (_: string, input: CrsReferral[], expected: { id: string; name: string }[]) => {
      expect(createReferralsSubNav(input)).toEqual(expected)
    },
  )
})

describe('format address', () => {
  it.each([
    [null, null, ''],
    ['All blank', {}, ''],
    [
      'All populated',
      {
        buildingName: 'My Building Name',
        buildingNumber: '1234',
        streetName: 'Main Street',
        district: 'West Park',
        town: 'Leeds',
        county: 'West Yorkshire',
        postcode: 'LS1 1AA',
        description: 'Testing',
      },
      '1234 Main Street,<br />Leeds,<br />LS1 1AA',
    ],
    [
      'Relevant fields populated',
      {
        buildingNumber: '1234',
        streetName: 'Main Street',
        town: 'Leeds',
        postcode: 'LS1 1AA',
      },
      '1234 Main Street,<br />Leeds,<br />LS1 1AA',
    ],
    [
      'Just building number populated',
      {
        buildingNumber: '1234',
      },
      '1234',
    ],
    [
      'Just street name populated',
      {
        streetName: 'Main Street',
      },
      'Main Street',
    ],
    [
      'Just town populated',
      {
        town: 'Leeds',
      },
      'Leeds',
    ],
    [
      'Just postcode populated',
      {
        postcode: 'LS1 1AA',
      },
      'LS1 1AA',
    ],
    [
      'Just building number and street name populated',
      {
        buildingNumber: '1234',
        streetName: 'Main Street',
      },
      '1234 Main Street',
    ],
    [
      'Just building number, street name and town populated',
      {
        buildingNumber: '1234',
        streetName: 'Main Street',
        town: 'Leeds',
      },
      '1234 Main Street,<br />Leeds',
    ],
    [
      'Just building number, street name and postcode populated',
      {
        buildingNumber: '1234',
        streetName: 'Main Street',
        postcode: 'LS1 1AA',
      },
      '1234 Main Street,<br />LS1 1AA',
    ],
    [
      'Just street name, town and postcode populated',
      {
        streetName: 'Main Street',
        town: 'Leeds',
        postcode: 'LS1 1AA',
      },
      'Main Street,<br />Leeds,<br />LS1 1AA',
    ],
    [
      'Just building number, town and postcode populated',
      {
        buildingNumber: '1234',
        town: 'Leeds',
        postcode: 'LS1 1AA',
      },
      '1234,<br />Leeds,<br />LS1 1AA',
    ],
  ])('%s: formatAddress(%s)', (_: string, a: AppointmentLocation, expected: string) => {
    expect(formatAddress(a)).toEqual(expected)
  })
})
