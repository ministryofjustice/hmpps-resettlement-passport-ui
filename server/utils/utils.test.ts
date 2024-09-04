import {
  convertToTitleCase,
  initialiseName,
  convertArrayToCommaSeparatedList,
  createReferralsSubNav,
  formatAddress,
  getAnswerValueFromArrayOfMaps,
  getValidationError,
  formatTimeWithDuration,
  getDaysFromGivenDate,
  formatDateAsLocal,
  getCaseNotesIntro,
  getCaseNotesText,
  shouldShowReportInformation,
  removeSlashes,
  fullName,
} from './utils'
import { CrsReferral } from '../data/model/crsReferralResponse'
import { AppointmentLocation } from '../data/model/appointment'
import { Answer, ValidationError, ValidationErrors } from '../data/model/immediateNeedsReport'
import { PersonalDetails, PrisonerData } from '../@types/express'

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

describe('get case notes introductory line', () => {
  it.each([
    [
      'Contains first introductory sentence',
      'Resettlement status set to: In progress. This is the main text of the case notes body.',
      'Resettlement status set to: In progress.',
    ],
    ['Does not contain introductory sentence', 'This is the main text of the case notes body.', null],
    ['Empty string', '', null],
    ['Null input', null, null],
  ])('getCaseNotesIntro(%s)', (_: string, a: string, expected: string) => {
    expect(getCaseNotesIntro(a)).toEqual(expected)
  })
})

describe('get case notes body text', () => {
  it.each([
    [
      'Contains first introductory sentence',
      'Resettlement status set to: In progress. This is the main text of the case notes body.',
      'This is the main text of the case notes body.',
    ],
    [
      'Does not contain introductory sentence',
      'This is the main text of the case notes body.',
      'This is the main text of the case notes body.',
    ],
    ['Empty string', '', ''],
    ['Null input', null, ''],
  ])('getCaseNotesText(%s)', (_: string, a: string, expected: string) => {
    expect(getCaseNotesText(a)).toEqual(expected)
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

describe('getValueFromArrayOfMaps', () => {
  it.each([
    [
      'happy path 1',
      {
        answer: [
          {
            key2: 'value2',
            addressLine2_SOCIAL_HOUSING: 'City Centre',
            'something else1': 'some value1',
          },
          {
            key1: 'value1',
            addressLine1_SOCIAL_HOUSING: '56 Main Street',
            'something else': 'some value',
          },
        ],
      },
      'addressLine1_SOCIAL_HOUSING',
      '56 Main Street',
    ],
    [
      'happy path 2',
      {
        answer: [
          {
            addressLine1_SOCIAL_HOUSING: '12 Street Lane',
          },
          {
            addressLine2_SOCIAL_HOUSING: 'City Centre',
          },
          {
            addressTown_SOCIAL_HOUSING: 'Leeds',
          },
          {
            addressCounty_SOCIAL_HOUSING: 'West Yorkshire',
          },
          {
            addressPostcode_SOCIAL_HOUSING: 'LS1 2AB',
          },
        ],
      },
      'addressTown_SOCIAL_HOUSING',
      'Leeds',
    ],
    [
      'nothing found',
      {
        answer: [
          {
            addressLine1_SOCIAL_HOUSING: '12 Street Lane',
          },
          {
            addressLine2_SOCIAL_HOUSING: 'City Centre',
          },
          {
            addressTown_SOCIAL_HOUSING: 'Leeds',
          },
          {
            addressCounty_SOCIAL_HOUSING: 'West Yorkshire',
          },
          {
            addressPostcode_SOCIAL_HOUSING: 'LS1 2AB',
          },
        ],
      },
      'addressCity_SOCIAL_HOUSING',
      '',
    ],
    ['null input', null, 'addressTown_SOCIAL_HOUSING', ''],
    ['undefined input', undefined, 'addressTown_SOCIAL_HOUSING', ''],
    ['wrong type of answer', { answer: 'string' }, 'addressTown_SOCIAL_HOUSING', ''],
  ])('%s getValueFromArrayOfMaps(%s, %s, %s)', (_: string, answer: Answer, key: string, expected: string) => {
    expect(getAnswerValueFromArrayOfMaps(answer, key)).toEqual(expected)
  })
})

describe('get validation data from array by question id', () => {
  it.each([
    [null, null, null, null],
    ['Empty array', [], 'QUESTION_1', undefined],
    ['No question Id', [{ validationType: 'OPTIONAL', questionId: 'QUESTION_2' }], undefined, null],
    [
      'Array length 1',
      [{ validationType: 'MANDATORY', questionId: 'QUESTION_1' }],
      'QUESTION_1',
      { validationType: 'MANDATORY', questionId: 'QUESTION_1' },
    ],
    [
      'Array length 2',
      [
        { validationType: 'MANDATORY', questionId: 'QUESTION_1' },
        { validationType: 'OPTIONAL', questionId: 'QUESTION_2' },
      ],
      'QUESTION_2',
      { validationType: 'OPTIONAL', questionId: 'QUESTION_2' },
    ],
  ])(
    '%s getValidationError(%s, %s)',
    (_: string, validationErrors: ValidationErrors, questionId: string, expected: ValidationError) => {
      expect(getValidationError(validationErrors, questionId)).toEqual(expected)
    },
  )
})

describe('formatTimeWithDuration', () => {
  it.each([
    ['14:00:00', '2:00pm'],
    ['14:01', '2:01pm'],
    ['12:00:00', '12:00pm'],
    ['09:01:00', '9:01am'],
    ['13:50:23', '1:50pm'],
    [null, null],
    ['', null],
  ])('formatTimeWithDuration(%s)', (input: string, expected: string) => {
    expect(formatTimeWithDuration(input)).toEqual(expected)
  })

  it.each([
    ['14:00:00', '2:50pm'],
    ['14:01', '2:51pm'],
    ['12:00:00', '12:50pm'],
    ['09:01:00', '9:51am'],
    ['13:50:23', '2:40pm'],
    [null, null],
    ['', null],
  ])('it should add 50 minutes to formatTimeWithDuration(%s)', (input: string, expected: string) => {
    expect(formatTimeWithDuration(input, 50)).toEqual(expected)
  })
})

describe('getDaysFromDate', () => {
  it.each([
    ['2024-04-28', { daysDiff: 5, isPast: false }],
    ['2024-04-21', { daysDiff: 2, isPast: true }],
    [null, null],
  ])('calculate days from date 2024-04-23 to %s', (input: string, expected: object) => {
    const currentDateTime = new Date('2024-04-23T12:22:47.714Z')
    expect(getDaysFromGivenDate(input, currentDateTime)).toEqual(expected)
  })
})

describe('formatDateAsLocal', () => {
  it.each([
    ['2024-04-20T23:00:00Z', '2024-04-21T00:00:00'],
    ['2024-02-13T00:00:00Z', '2024-02-13T00:00:00'],
    ['2024-03-31T00:00:00Z', '2024-03-31T00:00:00'],
    ['2024-03-31T23:00:00Z', '2024-04-01T00:00:00'],
    [undefined, null],
    [null, null],
    ['', null],
  ])('formatDateAsLocal from %s to %s', (input: string, expected: string) => {
    expect(formatDateAsLocal(input)).toEqual(expected)
  })
})

describe('shouldShowReportInformation', () => {
  it.each([
    [undefined, undefined, false],
    [null, null, false],
    [true, true, true],
    [true, false, false],
    [false, false, true],
    [false, true, true],
  ])(
    'shouldShowReportInformation(%s, %s) to %s',
    (assessmentRequired: boolean, preReleaseSubmitted: boolean, expected: boolean) => {
      expect(shouldShowReportInformation(assessmentRequired, preReleaseSubmitted)).toEqual(expected)
    },
  )
})

describe('removeSlashes', () => {
  it.each([
    ['/fish', 'fish'],
    ['/fishy-wishy/', 'fishy-wishy'],
    [undefined, null],
    [null, null],
  ])('removeSlashes(%s) to %s', (input, expected) => {
    expect(removeSlashes(input)).toEqual(expected)
  })
})

describe('fullName', () => {
  it('Gives name in firstname lastname format', () => {
    const personalDetails = { firstName: 'fred', lastName: 'FlintstOne' } as PersonalDetails
    const prisonerData = { personalDetails } as PrisonerData
    expect(fullName(prisonerData)).toEqual('Fred Flintstone')
  })
  it.each([null, undefined, {}])('handles %s', v => {
    expect(fullName(v as PrisonerData)).toEqual('')
  })
})
