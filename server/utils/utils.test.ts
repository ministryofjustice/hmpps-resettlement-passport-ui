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
  removeSlashes,
  fullName,
  startsWith,
  removePrefix,
  convertQuestionsAndAnswersToCacheFormat,
  getPagesFromCheckYourAnswers,
  convertApiQuestionAndAnswersToPageWithQuestions,
  findOtherNestedQuestions,
  getResetReason,
  getCaseNoteTitle,
  isValidPathway,
  isValidStatus,
  parseAssessmentType,
} from './utils'
import { CrsReferral } from '../data/model/crsReferralResponse'
import { AppointmentLocation } from '../data/model/appointment'
import {
  Answer,
  ApiAssessmentPage,
  ApiQuestionsAndAnswer,
  CachedQuestionAndAnswer,
  PageWithQuestions,
  ValidationError,
  ValidationErrors,
  WorkingCachedAssessment,
} from '../data/model/immediateNeedsReport'
import { PersonalDetails, PrisonerData } from '../@types/express'
import { AssessmentType } from '../data/model/assessmentInformation'

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

// describe('get case notes introductory line', () => {
//   it.each([
//     [
//       'Contains first introductory sentence',
//       'Resettlement status set to: In progress. This is the main text of the case notes body.',
//       'Resettlement status set to: In progress.',
//     ],
//     ['Does not contain introductory sentence', 'This is the main text of the case notes body.', null],
//     ['Empty string', '', null],
//     ['Null input', null, null],
//   ])('getCaseNotesIntro(%s)', (_: string, a: string, expected: string) => {
//     expect(getCaseNotesIntro(a)).toEqual(expected)
//   })
// })

// describe('get case notes body text', () => {
//   it.each([
//     [
//       'Contains first introductory sentence',
//       'Resettlement status set to: In progress. This is the main text of the case notes body.',
//       'This is the main text of the case notes body.',
//     ],
//     [
//       'Does not contain introductory sentence',
//       'This is the main text of the case notes body.',
//       'This is the main text of the case notes body.',
//     ],
//     ['Empty string', '', ''],
//     ['Null input', null, ''],
//   ])('getCaseNotesText(%s)', (_: string, a: string, expected: string) => {
//     expect(getCaseNotesText(a)).toEqual(expected)
//   })
})

describe('get reset reason from case notes', () => {
  it.each([
    [
      'Contains reset reason',
      "Prepare someone for release reports and statuses reset\n\nReason for reset: The person has returned to prison on a new sentence\n\nAny previous immediate needs and pre-release reports have been saved in our archive, but are no longer visible in PSfR.\n\nAll pathway resettlement statuses have been set back to 'Not Started'.\n\nContact the service desk if you think there's a problem.",
      "The person has returned to prison on a new sentence\n\nAny previous immediate needs and pre-release reports have been saved in our archive, but are no longer visible in PSfR.\n\nAll pathway resettlement statuses have been set back to 'Not Started'.\n\nContact the service desk if you think there's a problem.",
    ],
    [
      'Contains reset reason but no reason provided',
      'Prepare someone for release reports and statuses reset. Reason for reset:',
      '',
    ],
    [
      'Does not contain reset reason',
      'Prepare someone for release reports and statuses reset. No reason provided here.',
      null,
    ],
    ['Does not start with the reset prefix', 'Some unrelated case note text: ', null],
    ['Empty string', '', null],
    ['Null input', null, null],
  ])('getResetReason(%s)', (_: string, a: string, expected: string | null) => {
    expect(getResetReason(a)).toEqual(expected)
  })
})

describe('get case note title', () => {
  it.each([
    [
      'Starts with reset prefix',
      'Prepare someone for release reports and statuses reset. Reason for reset: Delay in paperwork.',
      'Accommodation',
      'Prepare someone for release reports and statuses reset',
    ],
    ['Does not start with reset prefix', 'Some notes', 'Accommodation', 'Accommodation'],
    ['Empty string for case note', '', 'Accommodation', 'Accommodation'],
    ['Null input for case note', null, 'Accommodation', 'Accommodation'],
    ['No pathway provided', 'Some case note text here.', undefined, ''],
    ['Null pathway provided', 'Some case note text here.', null, ''],
    ['Empty string pathway', 'Some case note text here.', '', ''],
  ])('getCaseNoteTitle(%s)', (_: string, a: string, pathway: string | undefined, expected: string) => {
    expect(getCaseNoteTitle(a, pathway)).toEqual(expected)
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

describe('startsWith', () => {
  it.each([
    ['String starts with prefix', 'hello world', 'hello', true],
    ['String does not start with prefix', 'hello world', 'world', false],
    ['Empty string with non-empty prefix', '', 'prefix', false],
    ['Non-empty string with empty prefix', 'hello world', '', true],
    ['Prefix longer than the string', 'hi', 'hello', false],
  ])('%s: startsWith(%s, %s)', (_: string, string: string, prefix: string, expected: boolean) => {
    expect(startsWith(string, prefix)).toBe(expected)
  })
})

describe('removePrefix', () => {
  it.each([
    ['String starts with prefix', 'hello world', 'hello', ' world'],
    ['String does not start with prefix', 'hello world', 'world', 'hello world'],
    ['String with empty prefix', 'hello world', '', 'hello world'],
    ['Empty string with non-empty prefix', '', 'prefix', ''],
    ['Prefix longer than the string', 'hi', 'hello', 'hi'],
  ])('%s: removePrefix(%s, %s)', (_: string, string: string, prefix: string, expected: string) => {
    expect(removePrefix(string, prefix)).toEqual(expected)
  })
})

describe('convertQuestionsAndAnswersToCacheFormat', () => {
  it.each([
    ['Null input', null, []],
    ['Undefined input', undefined, []],
    ['Blank input', [], []],
    [
      'Happy path',
      [
        {
          question: {
            id: 'QUESTION_1',
            title: 'Question 1',
            subTitle: 'Question subtitle',
            type: 'RADIO',
            options: [
              {
                id: 'OPTION_1',
                displayText: 'Option 1',
                description: 'Option 1 desc',
                exclusive: false,
                nestedQuestions: [],
                freeText: false,
              },
              {
                id: 'OPTION_2',
                displayText: 'Option 2',
                description: 'Option 2 desc',
                exclusive: false,
                nestedQuestions: [
                  {
                    question: {
                      id: 'NESTED_QUESTION',
                      title: 'Nested question',
                      subTitle: 'Nested question subtitle',
                      type: 'SHORT_TEXT',
                    },
                    answer: { answer: 'Answer text', '@class': 'StringAnswer' },
                    originalPageId: 'PAGE_1',
                  },
                ],
                freeText: false,
              },
              {
                id: 'OTHER',
                displayText: 'Other',
                description: 'Other desc',
                exclusive: false,
                nestedQuestions: [],
                freeText: true,
              },
              {
                id: 'NO_ANSWER',
                displayText: 'No answer',
                description: 'No answer desc',
                exclusive: true,
                nestedQuestions: [],
                freeText: false,
              },
            ],
            validationType: 'OPTIONAL',
          },
          answer: { answer: 'OPTION_1', '@class': 'StringAnswer' },
          originalPageId: 'PAGE_1',
        },
        {
          question: {
            id: 'QUESTION_2',
            title: 'Question 2',
            type: 'LONG_TEXT',
            validationType: 'MANDATORY',
          },
          answer: { answer: 'Some long text', '@class': 'StringAnswer' },
          originalPageId: 'PAGE_1',
        },
      ] as ApiQuestionsAndAnswer[],
      [
        {
          answer: {
            '@class': 'StringAnswer',
            answer: 'OPTION_1',
            displayText: 'Option 1',
          },
          pageId: 'PAGE_1',
          question: 'QUESTION_1',
          questionTitle: 'Question 1',
          questionType: 'RADIO',
        },
        {
          answer: {
            '@class': 'StringAnswer',
            answer: 'Some long text',
            displayText: 'Some long text',
          },
          pageId: 'PAGE_1',
          question: 'QUESTION_2',
          questionTitle: 'Question 2',
          questionType: 'LONG_TEXT',
        },
      ] as CachedQuestionAndAnswer[],
    ],
  ])('%s', (_: string, input: ApiQuestionsAndAnswer[], expectedOutput: CachedQuestionAndAnswer[]) => {
    expect(convertQuestionsAndAnswersToCacheFormat(input)).toEqual(expectedOutput)
  })
})

describe('getPagesFromCheckYourAnswers', () => {
  it.each([
    ['Null input', null, []],
    ['Undefined input', undefined, []],
    ['Blank input', [], []],
    [
      'Happy path',
      [
        {
          question: {
            id: 'QUESTION_1',
            title: 'Question 1',
            subTitle: 'Question subtitle',
            type: 'RADIO',
            options: [
              {
                id: 'OPTION_1',
                displayText: 'Option 1',
                description: 'Option 1 desc',
                exclusive: false,
                nestedQuestions: [],
                freeText: false,
              },
              {
                id: 'OPTION_2',
                displayText: 'Option 2',
                description: 'Option 2 desc',
                exclusive: false,
                nestedQuestions: [
                  {
                    question: {
                      id: 'NESTED_QUESTION',
                      title: 'Nested question',
                      subTitle: 'Nested question subtitle',
                      type: 'SHORT_TEXT',
                    },
                    answer: { answer: 'Answer text', '@class': 'StringAnswer' },
                    originalPageId: 'PAGE_1',
                  },
                ],
                freeText: false,
              },
              {
                id: 'OTHER',
                displayText: 'Other',
                description: 'Other desc',
                exclusive: false,
                nestedQuestions: [],
                freeText: true,
              },
              {
                id: 'NO_ANSWER',
                displayText: 'No answer',
                description: 'No answer desc',
                exclusive: true,
                nestedQuestions: [],
                freeText: false,
              },
            ],
            validationType: 'OPTIONAL',
          },
          answer: { answer: 'OPTION_1', '@class': 'StringAnswer' },
          originalPageId: 'PAGE_1',
        },
        {
          question: {
            id: 'QUESTION_2',
            title: 'Question 2',
            type: 'LONG_TEXT',
            validationType: 'MANDATORY',
          },
          answer: { answer: 'Some long text', '@class': 'StringAnswer' },
          originalPageId: 'PAGE_2',
        },
        {
          question: {
            id: 'QUESTION_3',
            title: 'Question 3',
            type: 'ADDRESS',
            validationType: 'MANDATORY',
          },
          originalPageId: 'PAGE_3',
        },
        {
          question: {
            id: 'QUESTION_4',
            title: 'Question 4',
            type: 'SHORT_TEXT',
            validationType: 'MANDATORY',
          },
          originalPageId: 'PAGE_3',
        },
      ] as ApiQuestionsAndAnswer[],
      [
        {
          pageId: 'PAGE_1',
          questions: ['QUESTION_1', 'NESTED_QUESTION'],
        },
        {
          pageId: 'PAGE_2',
          questions: ['QUESTION_2'],
        },
        {
          pageId: 'PAGE_3',
          questions: ['QUESTION_3', 'QUESTION_4'],
        },
        {
          pageId: 'CHECK_ANSWERS',
          questions: [],
        },
      ] as PageWithQuestions[],
    ],
  ])('%s', (_: string, input: ApiQuestionsAndAnswer[], expectedOutput: PageWithQuestions[]) => {
    expect(getPagesFromCheckYourAnswers(input)).toEqual(expectedOutput)
  })
})

describe('convertApiQuestionAndAnswersToPageWithQuestions', () => {
  it.each([
    ['Null input', null, { pageId: undefined, questions: [] }],
    ['Undefined input', undefined, { pageId: undefined, questions: [] }],
    [
      'Happy path',
      {
        id: 'PAGE_1',
        title: 'Page 1',
        questionsAndAnswers: [
          {
            question: {
              id: 'QUESTION_1',
              title: 'Question 1',
              type: 'RADIO',
              options: [
                {
                  id: 'OPTION_1',
                  displayText: 'Option 1',
                },
                {
                  id: 'OPTION_2',
                  displayText: 'Option 2',
                  nestedQuestions: [
                    {
                      question: {
                        id: 'NESTED_QUESTION',
                        title: 'Nested question',
                        subTitle: 'Nested question subtitle',
                        type: 'SHORT_TEXT',
                      },
                      originalPageId: 'PAGE_1',
                    },
                  ],
                },
                {
                  id: 'OTHER',
                  displayText: 'Other',
                  freeText: true,
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer',
                  description: 'No answer desc',
                  exclusive: true,
                  nestedQuestions: [],
                  freeText: false,
                },
              ],
              validationType: 'OPTIONAL',
            },
            answer: { answer: 'OPTION_1', '@class': 'StringAnswer' },
            originalPageId: 'PAGE_1',
          },
          {
            question: {
              id: 'QUESTION_2',
              title: 'Question 2',
              type: 'LONG_TEXT',
              validationType: 'MANDATORY',
            },
            answer: { answer: 'Some long text', '@class': 'StringAnswer' },
            originalPageId: 'PAGE_1',
          },
          {
            question: {
              id: 'QUESTION_3',
              title: 'Question 3',
              type: 'ADDRESS',
              validationType: 'MANDATORY',
            },
            originalPageId: 'PAGE_1',
          },
          {
            question: {
              id: 'QUESTION_4',
              title: 'Question 4',
              type: 'SHORT_TEXT',
              validationType: 'MANDATORY',
            },
            originalPageId: 'PAGE_1',
          },
        ],
      } as ApiAssessmentPage,
      {
        pageId: 'PAGE_1',
        questions: ['QUESTION_1', 'NESTED_QUESTION', 'QUESTION_2', 'QUESTION_3', 'QUESTION_4'],
      } as PageWithQuestions,
    ],
  ])('%s', (_: string, input: ApiAssessmentPage, expectedOutput: PageWithQuestions) => {
    expect(convertApiQuestionAndAnswersToPageWithQuestions(input)).toEqual(expectedOutput)
  })
})

describe('findOtherNestedQuestions', () => {
  const testApiAssessmentPage = {
    id: 'PAGE_1',
    title: 'Page 1',
    questionsAndAnswers: [
      {
        question: {
          id: 'QUESTION_1',
          title: 'Question 1',
          type: 'RADIO',
          options: [
            {
              id: 'OPTION_1',
              displayText: 'Option 1',
              nestedQuestions: [
                {
                  question: {
                    id: 'OPTION_1_NESTED_QUESTION_1',
                    title: 'Option 1 nested question 1',
                    type: 'SHORT_TEXT',
                  },
                  originalPageId: 'PAGE_1',
                },
                {
                  question: {
                    id: 'OPTION_1_NESTED_QUESTION_2',
                    title: 'Option 1 nested question 2',
                    type: 'SHORT_TEXT',
                  },
                  originalPageId: 'PAGE_1',
                },
                {
                  question: {
                    id: 'OPTION_1_NESTED_QUESTION_3',
                    title: 'Option 1 nested question 3',
                    type: 'SHORT_TEXT',
                  },
                  originalPageId: 'PAGE_1',
                },
              ],
            },
            {
              id: 'OPTION_2',
              displayText: 'Option 2',
              nestedQuestions: [
                {
                  question: {
                    id: 'OPTION_2_NESTED_QUESTION_1',
                    title: 'Option 2 nested question 1',
                    type: 'SHORT_TEXT',
                  },
                  originalPageId: 'PAGE_1',
                },
                {
                  question: {
                    id: 'OPTION_2_NESTED_QUESTION_2',
                    title: 'Option 2 nested question 2',
                    type: 'SHORT_TEXT',
                  },
                  originalPageId: 'PAGE_1',
                },
                {
                  question: {
                    id: 'OPTION_2_NESTED_QUESTION_3',
                    title: 'Option 2 nested question 3',
                    type: 'SHORT_TEXT',
                  },
                  originalPageId: 'PAGE_1',
                },
              ],
            },
            {
              id: 'OTHER',
              displayText: 'Other',
              freeText: true,
            },
            {
              id: 'NO_ANSWER',
              displayText: 'No answer',
              description: 'No answer desc',
              exclusive: true,
              nestedQuestions: [],
              freeText: false,
            },
          ],
          validationType: 'OPTIONAL',
        },
        answer: { answer: 'OPTION_1', '@class': 'StringAnswer' },
        originalPageId: 'PAGE_1',
      },
      {
        question: {
          id: 'QUESTION_2',
          title: 'Question 2',
          type: 'LONG_TEXT',
          validationType: 'MANDATORY',
        },
        answer: { answer: 'Some long text', '@class': 'StringAnswer' },
        originalPageId: 'PAGE_1',
      },
    ],
  } as ApiAssessmentPage

  it.each([
    ['Null input', null, null, null, []],
    ['undefined input', undefined, undefined, undefined, []],
    [
      'Not a nested question',
      {
        question: 'QUESTION_1',
        questionTitle: 'Question 1',
        pageId: 'PAGE_1',
        questionType: 'SHORT_TEXT',
        answer: { answer: 'Some text', displayText: 'Some text', '@class': 'StringAnswer' },
      } as CachedQuestionAndAnswer,
      {
        assessment: { questionsAndAnswers: [], version: 1 },
        pageLoadHistory: [{ pageId: 'PAGE_1', questions: ['QUESTION_1'] }],
      } as WorkingCachedAssessment,
      testApiAssessmentPage,
      [],
    ],
    [
      'Nested question answered but current cache empty',
      {
        question: 'OPTION_1_NESTED_QUESTION_2',
        questionTitle: 'Option 1 nested question 2',
        pageId: 'PAGE_1',
        questionType: 'SHORT_TEXT',
        answer: { answer: 'Some text', displayText: 'Some text', '@class': 'StringAnswer' },
      } as CachedQuestionAndAnswer,
      {
        assessment: { questionsAndAnswers: [], version: 1 },
        pageLoadHistory: [{ pageId: 'PAGE_1', questions: ['QUESTION_1'] }],
      } as WorkingCachedAssessment,
      testApiAssessmentPage,
      [],
    ],
    [
      'Nested question answered with cache filled in with same option',
      {
        question: 'OPTION_1_NESTED_QUESTION_2',
        questionTitle: 'Option 1 nested question 2',
        pageId: 'PAGE_1',
        questionType: 'SHORT_TEXT',
        answer: { answer: 'Some text', displayText: 'Some text', '@class': 'StringAnswer' },
      } as CachedQuestionAndAnswer,
      {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'OPTION_1_NESTED_QUESTION_1',
              questionTitle: 'Option 1 nested question 1',
              pageId: 'PAGE_1',
              questionType: 'SHORT_TEXT',
              answer: { answer: 'Some text', displayText: 'Some text', '@class': 'StringAnswer' },
            },
            {
              question: 'OPTION_1_NESTED_QUESTION_2',
              questionTitle: 'Option 1 nested question 2',
              pageId: 'PAGE_1',
              questionType: 'SHORT_TEXT',
              answer: { answer: 'Some text', displayText: 'Some text', '@class': 'StringAnswer' },
            },
            {
              question: 'OPTION_1_NESTED_QUESTION_3',
              questionTitle: 'Option 1 nested question 3',
              pageId: 'PAGE_1',
              questionType: 'SHORT_TEXT',
              answer: { answer: 'Some text', displayText: 'Some text', '@class': 'StringAnswer' },
            },
          ],
          version: 1,
        },
        pageLoadHistory: [{ pageId: 'PAGE_1', questions: ['QUESTION_1'] }],
      } as WorkingCachedAssessment,
      testApiAssessmentPage,
      [],
    ],
    [
      'Nested question answered with cache filled in with other option',
      {
        question: 'OPTION_1_NESTED_QUESTION_2',
        questionTitle: 'Option 1 nested question 2',
        pageId: 'PAGE_1',
        questionType: 'SHORT_TEXT',
        answer: { answer: 'Some text', displayText: 'Some text', '@class': 'StringAnswer' },
      } as CachedQuestionAndAnswer,
      {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'OPTION_2_NESTED_QUESTION_1',
              questionTitle: 'Option 2 nested question 1',
              pageId: 'PAGE_1',
              questionType: 'SHORT_TEXT',
              answer: { answer: 'Some text', displayText: 'Some text', '@class': 'StringAnswer' },
            },
            {
              question: 'OPTION_2_NESTED_QUESTION_2',
              questionTitle: 'Option 2 nested question 2',
              pageId: 'PAGE_1',
              questionType: 'SHORT_TEXT',
              answer: { answer: 'Some text', displayText: 'Some text', '@class': 'StringAnswer' },
            },
            {
              question: 'OPTION_2_NESTED_QUESTION_3',
              questionTitle: 'Option 2 nested question 3',
              pageId: 'PAGE_1',
              questionType: 'SHORT_TEXT',
              answer: { answer: 'Some text', displayText: 'Some text', '@class': 'StringAnswer' },
            },
          ],
          version: 1,
        },
        pageLoadHistory: [{ pageId: 'PAGE_1', questions: ['QUESTION_1'] }],
      } as WorkingCachedAssessment,
      testApiAssessmentPage,
      [
        {
          answer: {
            '@class': 'StringAnswer',
            answer: 'Some text',
            displayText: 'Some text',
          },
          pageId: 'PAGE_1',
          question: 'OPTION_2_NESTED_QUESTION_1',
          questionTitle: 'Option 2 nested question 1',
          questionType: 'SHORT_TEXT',
        },
        {
          answer: {
            '@class': 'StringAnswer',
            answer: 'Some text',
            displayText: 'Some text',
          },
          pageId: 'PAGE_1',
          question: 'OPTION_2_NESTED_QUESTION_2',
          questionTitle: 'Option 2 nested question 2',
          questionType: 'SHORT_TEXT',
        },
        {
          answer: {
            '@class': 'StringAnswer',
            answer: 'Some text',
            displayText: 'Some text',
          },
          pageId: 'PAGE_1',
          question: 'OPTION_2_NESTED_QUESTION_3',
          questionTitle: 'Option 2 nested question 3',
          questionType: 'SHORT_TEXT',
        },
      ] as CachedQuestionAndAnswer[],
    ],
    [
      'Option selected with no nesting should return all other nested questions in other options',
      {
        question: 'QUESTION_1',
        questionTitle: 'Question 1',
        pageId: 'PAGE_1',
        questionType: 'RADIO',
        answer: { answer: 'NO_ANSWER', displayText: 'No answer', '@class': 'StringAnswer' },
      } as CachedQuestionAndAnswer,
      {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'OPTION_2_NESTED_QUESTION_1',
              questionTitle: 'Option 2 nested question 1',
              pageId: 'PAGE_1',
              questionType: 'SHORT_TEXT',
              answer: { answer: 'Some text', displayText: 'Some text', '@class': 'StringAnswer' },
            },
            {
              question: 'OPTION_2_NESTED_QUESTION_2',
              questionTitle: 'Option 2 nested question 2',
              pageId: 'PAGE_1',
              questionType: 'SHORT_TEXT',
              answer: { answer: 'Some text', displayText: 'Some text', '@class': 'StringAnswer' },
            },
            {
              question: 'OPTION_2_NESTED_QUESTION_3',
              questionTitle: 'Option 2 nested question 3',
              pageId: 'PAGE_1',
              questionType: 'SHORT_TEXT',
              answer: { answer: 'Some text', displayText: 'Some text', '@class': 'StringAnswer' },
            },
          ],
          version: 1,
        },
        pageLoadHistory: [{ pageId: 'PAGE_1', questions: ['QUESTION_1'] }],
      } as WorkingCachedAssessment,
      testApiAssessmentPage,
      [
        {
          answer: {
            '@class': 'StringAnswer',
            answer: 'Some text',
            displayText: 'Some text',
          },
          pageId: 'PAGE_1',
          question: 'OPTION_2_NESTED_QUESTION_1',
          questionTitle: 'Option 2 nested question 1',
          questionType: 'SHORT_TEXT',
        },
        {
          answer: {
            '@class': 'StringAnswer',
            answer: 'Some text',
            displayText: 'Some text',
          },
          pageId: 'PAGE_1',
          question: 'OPTION_2_NESTED_QUESTION_2',
          questionTitle: 'Option 2 nested question 2',
          questionType: 'SHORT_TEXT',
        },
        {
          answer: {
            '@class': 'StringAnswer',
            answer: 'Some text',
            displayText: 'Some text',
          },
          pageId: 'PAGE_1',
          question: 'OPTION_2_NESTED_QUESTION_3',
          questionTitle: 'Option 2 nested question 3',
          questionType: 'SHORT_TEXT',
        },
      ] as CachedQuestionAndAnswer[],
    ],
  ])(
    '%s',
    (
      _: string,
      newQandA: CachedQuestionAndAnswer,
      existingAssessmentFromCache: WorkingCachedAssessment,
      apiAssessmentPage: ApiAssessmentPage,
      expectedOutput: CachedQuestionAndAnswer[],
    ) => {
      expect(findOtherNestedQuestions(newQandA, existingAssessmentFromCache, apiAssessmentPage)).toEqual(expectedOutput)
    },
  )
})

describe('test isValidPathway', () => {
  it.each([
    ['null', null, false],
    ['undefined', undefined, false],
    ['accommodation', 'accommodation', true],
    ['attitudes, thinking and behaviour', 'attitudes-thinking-and-behaviour', true],
    ['children, families and communities', 'children-families-and-communities', true],
    ['drugs and alcohol', 'drugs-and-alcohol', true],
    ['education, skills and work', 'education-skills-and-work', true],
    ['finance and id', 'finance-and-id', true],
    ['health', 'health-status', true],
    ['not a pathway', 'not-a-pathway', false],
  ])('%s isValidPathway(%s)', (_: string, pathwayFromUrl: string, expected: boolean) => {
    expect(isValidPathway(pathwayFromUrl)).toEqual(expected)
  })
})

describe('test isValidStatus', () => {
  it.each([
    ['null', null, false],
    ['undefined', undefined, false],
    ['Not started', 'NOT_STARTED', true],
    ['Support required', 'SUPPORT_REQUIRED', true],
    ['In progress', 'IN_PROGRESS', true],
    ['Support not required', 'SUPPORT_NOT_REQUIRED', true],
    ['Support declined', 'SUPPORT_DECLINED', true],
    ['Done', 'DONE', true],
    ['Not a status', 'NOT_A_STATUS', false],
  ])('%s isValidStatus(%s)', (_: string, status: string, expected: boolean) => {
    expect(isValidStatus(status)).toEqual(expected)
  })
})

describe('test parseAssessmentType', () => {
  it.each([
    ['null', null, new Error('Unable to parse assessmentType: null')],
    ['undefined', undefined, new Error('Assessment type is missing from request')],
    ['BCST2', 'BCST2', 'BCST2' as AssessmentType],
    ['RESETTLEMENT_PLAN', 'RESETTLEMENT_PLAN', 'RESETTLEMENT_PLAN' as AssessmentType],
    ['Not a type', 'NOT_A_TYPE', new Error('Unable to parse assessmentType: NOT_A_TYPE')],
  ])('%s parseAssessmentType(%s)', (_: string, type: unknown, expected: AssessmentType | Error) => {
    if (typeof expected === 'string') {
      expect(parseAssessmentType(type)).toEqual(expected)
    } else {
      expect(() => {
        parseAssessmentType(type)
      }).toThrow(expected)
    }
  })
})
