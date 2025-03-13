import { FieldValidationError } from 'express-validator'
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
  isAdditionalDetails,
  getPaginationPages,
  checkSupportNeedsSet,
  getReportTypeName,
  getSupportNeedsStatus,
  getSupportNeedsColour,
  validatePathwaySupportNeeds,
  validateStringIsAnInteger,
  processSupportNeedsRequestBody,
  trimToNull,
  validSupportNeedsStatus,
  errorSummaryList,
  findError,
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
import { Pagination } from '../data/model/pagination'
import FeatureFlags from '../featureFlag'
import { PrisonerSupportNeedsPatch } from '../data/model/supportNeeds'
import { SupportNeedStatus } from '../data/model/supportNeedStatus'

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
      '1234 Main Street,\nLeeds,\nLS1 1AA',
    ],
    [
      'Relevant fields populated',
      {
        buildingNumber: '1234',
        streetName: 'Main Street',
        town: 'Leeds',
        postcode: 'LS1 1AA',
      },
      '1234 Main Street,\nLeeds,\nLS1 1AA',
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
      '1234 Main Street,\nLeeds',
    ],
    [
      'Just building number, street name and postcode populated',
      {
        buildingNumber: '1234',
        streetName: 'Main Street',
        postcode: 'LS1 1AA',
      },
      '1234 Main Street,\nLS1 1AA',
    ],
    [
      'Just street name, town and postcode populated',
      {
        streetName: 'Main Street',
        town: 'Leeds',
        postcode: 'LS1 1AA',
      },
      'Main Street,\nLeeds,\nLS1 1AA',
    ],
    [
      'Just building number, town and postcode populated',
      {
        buildingNumber: '1234',
        town: 'Leeds',
        postcode: 'LS1 1AA',
      },
      '1234,\nLeeds,\nLS1 1AA',
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
            validation: { type: 'OPTIONAL' },
          },
          answer: { answer: 'OPTION_1', '@class': 'StringAnswer' },
          originalPageId: 'PAGE_1',
        },
        {
          question: {
            id: 'QUESTION_2',
            title: 'Question 2',
            type: 'LONG_TEXT',
            validation: { type: 'MANDATORY' },
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
            validation: { type: 'OPTIONAL' },
          },
          answer: { answer: 'OPTION_1', '@class': 'StringAnswer' },
          originalPageId: 'PAGE_1',
        },
        {
          question: {
            id: 'QUESTION_2',
            title: 'Question 2',
            type: 'LONG_TEXT',
            validation: { type: 'MANDATORY' },
          },
          answer: { answer: 'Some long text', '@class': 'StringAnswer' },
          originalPageId: 'PAGE_2',
        },
        {
          question: {
            id: 'QUESTION_3',
            title: 'Question 3',
            type: 'ADDRESS',
            validation: { type: 'MANDATORY' },
          },
          originalPageId: 'PAGE_3',
        },
        {
          question: {
            id: 'QUESTION_4',
            title: 'Question 4',
            type: 'SHORT_TEXT',
            validation: { type: 'MANDATORY' },
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
              validation: { type: 'OPTIONAL' },
            },
            answer: { answer: 'OPTION_1', '@class': 'StringAnswer' },
            originalPageId: 'PAGE_1',
          },
          {
            question: {
              id: 'QUESTION_2',
              title: 'Question 2',
              type: 'LONG_TEXT',
              validation: { type: 'MANDATORY' },
            },
            answer: { answer: 'Some long text', '@class': 'StringAnswer' },
            originalPageId: 'PAGE_1',
          },
          {
            question: {
              id: 'QUESTION_3',
              title: 'Question 3',
              type: 'ADDRESS',
              validation: { type: 'MANDATORY' },
            },
            originalPageId: 'PAGE_1',
          },
          {
            question: {
              id: 'QUESTION_4',
              title: 'Question 4',
              type: 'SHORT_TEXT',
              validation: { type: 'MANDATORY' },
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
          validation: { type: 'OPTIONAL' },
        },
        answer: { answer: 'OPTION_1', '@class': 'StringAnswer' },
        originalPageId: 'PAGE_1',
      },
      {
        question: {
          id: 'QUESTION_2',
          title: 'Question 2',
          type: 'LONG_TEXT',
          validation: { type: 'MANDATORY' },
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

describe('isAdditionalDetails', () => {
  it.each([
    [{ question: 'WHERE_DID_THEY_LIVE_ADDITIONAL_DETAILS' }, true],
    [{ question: 'ARE_THEY_BATMAN_ADDITIONAL_DETAILS' }, true],
    [{ questionTitle: 'Additional details' }, true],
    [{ questionTitle: 'Something something additional details' }, true],
    [{}, false],
    [{ question: null }, false],
    [null, false],
    [undefined, false],
  ])('isAdditionalDetail(%o) should be %s', (questionAndAnswer, result) => {
    expect(isAdditionalDetails(questionAndAnswer as CachedQuestionAndAnswer)).toEqual(result)
  })
})
describe('getPaginationPages', () => {
  it.each([
    [
      'only enough results for one page, should not display pagination',
      0, // currentPage
      20, // pageSize
      10, // totalElements (less than pageSize)
      undefined, // pagesAroundCurrent
      {
        pages: null, // No pagination required
        startItem: 1,
        endItem: 10,
        totalElements: 10,
      },
    ],
    [
      'current page is 1 (index 0) of 5 pages (index 0 to 4)',
      0, // currentPage (zero-based index)
      20, // pageSize
      96, // totalElements
      undefined, // pagesAroundCurrent
      {
        pages: [
          { pageType: 'number', pageNumber: 0, isCurrent: true },
          { pageType: 'number', pageNumber: 1, isCurrent: false },
          { pageType: 'ellipses', isCurrent: false },
          { pageType: 'number', pageNumber: 4, isCurrent: false },
          { pageType: 'next', pageNumber: 1, isCurrent: false },
        ],
        startItem: 1,
        endItem: 20,
        totalElements: 96,
      } as Pagination,
    ],
    [
      'current page is 3 (index 2) of 5 pages (index 0 to 4)',
      2, // currentPage
      20, // pageSize
      96, // totalElements
      undefined, // pagesAroundCurrent
      {
        pages: [
          { pageType: 'previous', pageNumber: 1, isCurrent: false },
          { pageType: 'number', pageNumber: 0, isCurrent: false },
          { pageType: 'number', pageNumber: 1, isCurrent: false },
          { pageType: 'number', pageNumber: 2, isCurrent: true },
          { pageType: 'number', pageNumber: 3, isCurrent: false },
          { pageType: 'number', pageNumber: 4, isCurrent: false },
          { pageType: 'next', pageNumber: 3, isCurrent: false },
        ],
        startItem: 41,
        endItem: 60,
        totalElements: 96,
      } as Pagination,
    ],
    [
      'current page is 5 (index 4) of 5 pages (index 0 to 4)',
      4, // currentPage
      20, // pageSize
      96, // totalElements
      undefined, // pagesAroundCurrent
      {
        pages: [
          { pageType: 'previous', pageNumber: 3, isCurrent: false },
          { pageType: 'number', pageNumber: 0, isCurrent: false },
          { pageType: 'ellipses', isCurrent: false },
          { pageType: 'number', pageNumber: 3, isCurrent: false },
          { pageType: 'number', pageNumber: 4, isCurrent: true },
        ],
        startItem: 81,
        endItem: 96,
        totalElements: 96,
      } as Pagination,
    ],
    [
      'current page is 3 (index 2) of 10 pages (index 0 to 9) with 2 pages around current',
      2, // currentPage
      10, // pageSize
      96, // totalElements
      2, // pagesAroundCurrent
      {
        pages: [
          { pageType: 'previous', pageNumber: 1, isCurrent: false },
          { pageType: 'number', pageNumber: 0, isCurrent: false },
          { pageType: 'number', pageNumber: 1, isCurrent: false },
          { pageType: 'number', pageNumber: 2, isCurrent: true },
          { pageType: 'number', pageNumber: 3, isCurrent: false },
          { pageType: 'number', pageNumber: 4, isCurrent: false },
          { pageType: 'ellipses', isCurrent: false },
          { pageType: 'number', pageNumber: 9, isCurrent: false },
          { pageType: 'next', pageNumber: 3, isCurrent: false },
        ],
        startItem: 21,
        endItem: 30,
        totalElements: 96,
      } as Pagination,
    ],
  ])(
    '%s',
    (
      _description: string,
      currentPage: number,
      pageSize: number,
      totalElements: number,
      pagesAroundCurrent: number,
      expected: Pagination,
    ) => {
      expect(getPaginationPages(currentPage, pageSize, totalElements, pagesAroundCurrent)).toEqual(expected)
    },
  )
})

describe('checkSupportNeedsSet', () => {
  const prisonerData = {
    prisonerNumber: 'G6933GF',
    firstName: 'BUSTER',
    middleNames: 'CHRISTABERT HECTUR',
    lastName: 'CORALLO',
    releaseDate: '2021-10-14',
    releaseType: 'CRD',
    paroleEligibilityDate: '2019-03-28',
    releaseEligibilityDate: '2019-03-28',
    releaseEligibilityType: 'PED',
    assessmentRequired: true,
    assignedWorkerFirstname: 'Lucie',
    assignedWorkerLastname: 'Johnson',
  }
  const pageData = {
    pageSize: 20,
    page: 0,
    sortName: 'releaseDate,ASC',
    totalElements: 96,
    last: false,
  }
  it.each([
    [
      'Single prisoner, all pathways not reviewed',
      {
        content: [
          {
            ...prisonerData,
            needs: [
              {
                pathway: 'ACCOMMODATION',
                reviewed: false,
                notStarted: 5,
                inProgress: 3,
                met: 3,
                declined: 4,
                lastUpdated: '2024-02-21',
              },
              {
                pathway: 'HEALTH',
                reviewed: false,
                notStarted: 2,
                inProgress: 1,
                met: 3,
                declined: 0,
                lastUpdated: '2024-02-21',
              },
            ],
          },
        ],
        ...pageData,
      },
      {
        content: [
          {
            ...prisonerData,
            needs: [
              {
                pathway: 'ACCOMMODATION',
                reviewed: false,
                notStarted: 5,
                inProgress: 3,
                met: 3,
                declined: 4,
                lastUpdated: '2024-02-21',
              },
              {
                pathway: 'HEALTH',
                reviewed: false,
                notStarted: 2,
                inProgress: 1,
                met: 3,
                declined: 0,
                lastUpdated: '2024-02-21',
              },
            ],
            needsNotSet: true,
          },
        ],
        ...pageData,
      },
    ],
    [
      'Single prisoner, some pathways reviewed',
      {
        content: [
          {
            ...prisonerData,
            needs: [
              {
                pathway: 'ACCOMMODATION',
                reviewed: false,
                notStarted: 5,
                inProgress: 3,
                met: 3,
                declined: 4,
                lastUpdated: '2024-02-21',
              },
              {
                pathway: 'HEALTH',
                reviewed: true,
                notStarted: 2,
                inProgress: 1,
                met: 3,
                declined: 0,
                lastUpdated: '2024-02-21',
              },
            ],
          },
        ],
        ...pageData,
      },
      {
        content: [
          {
            ...prisonerData,
            needs: [
              {
                pathway: 'ACCOMMODATION',
                reviewed: false,
                notStarted: 5,
                inProgress: 3,
                met: 3,
                declined: 4,
                lastUpdated: '2024-02-21',
              },
              {
                pathway: 'HEALTH',
                reviewed: true,
                notStarted: 2,
                inProgress: 1,
                met: 3,
                declined: 0,
                lastUpdated: '2024-02-21',
              },
            ],
            needsNotSet: false,
          },
        ],
        ...pageData,
      },
    ],
    [
      'Single prisoner, no needs array',
      {
        content: [
          {
            ...prisonerData,
          },
        ],
        ...pageData,
      },
      {
        content: [
          {
            ...prisonerData,
            needsNotSet: true,
          },
        ],
        ...pageData,
      },
    ],
  ])('%s', (_: string, input, expected) => {
    expect(checkSupportNeedsSet(input)).toEqual(expected)
  })
})

describe('getReportTypeName', () => {
  it.each([
    ['Existing report type: BCST2', 'BCST2', 'Immediate needs'],
    ['Existing report type: RESETTLEMENT_PLAN', 'RESETTLEMENT_PLAN', 'Pre-release'],
    ['Non-existent report type: UNKNOWN_TYPE', 'UNKNOWN_TYPE', undefined],
    ['Empty string', '', undefined],
    ['Null value', null, undefined],
    ['Undefined value', undefined, undefined],
  ])('%s -> getReportTypeName(%s)', (_: string, reportTypeEnum: string, expected: string | undefined) => {
    expect(getReportTypeName(reportTypeEnum)).toEqual(expected)
  })
})

describe('getSupportNeedsStatus', () => {
  it.each([
    ['Existing status: NOT_STARTED', 'NOT_STARTED', 'Support not started'],
    ['Existing status: IN_PROGRESS', 'IN_PROGRESS', 'Support in progress'],
    ['Existing status: MET', 'MET', 'Support met'],
    ['Existing status: DECLINED', 'DECLINED', 'Support declined'],
    ['Non-existent status: UNKNOWN_STATUS', 'UNKNOWN_STATUS', undefined],
    ['Empty string', '', undefined],
    ['Null value', null, undefined],
    ['Undefined value', undefined, undefined],
  ])('%s -> getSupportNeedsStatus(%s)', (_: string, statusEnum: string, expected: string | undefined) => {
    expect(getSupportNeedsStatus(statusEnum)).toEqual(expected)
  })
})

describe('getSupportNeedsColour', () => {
  it.each([
    ['Existing status: NOT_STARTED', 'NOT_STARTED', 'orange'],
    ['Existing status: IN_PROGRESS', 'IN_PROGRESS', 'yellow'],
    ['Existing status: MET', 'MET', 'green'],
    ['Existing status: DECLINED', 'DECLINED', 'purple'],
    ['Non-existent status: UNKNOWN_STATUS', 'UNKNOWN_STATUS', undefined],
    ['Empty string', '', undefined],
    ['Null value', null, undefined],
    ['Undefined value', undefined, undefined],
  ])('%s -> getSupportNeedsColour(%s)', (_: string, statusEnum: string, expected: string | undefined) => {
    expect(getSupportNeedsColour(statusEnum)).toEqual(expected)
  })
})

describe('validatePathwaySupportNeeds', () => {
  it.each([
    ['Happy path - flag on and valid pathway - accommodation', 'accommodation', true, null],
    ['Happy path - flag on and valid pathway - atb', 'attitudes-thinking-and-behaviour', true, null],
    ['Happy path - flag on and valid pathway - cfc', 'children-families-and-communities', true, null],
    ['Happy path - flag on and valid pathway - drugs', 'drugs-and-alcohol', true, null],
    ['Happy path - flag on and valid pathway - esk', 'education-skills-and-work', true, null],
    ['Happy path - flag on and valid pathway - finance', 'finance-and-id', true, null],
    ['Happy path - flag on and valid pathway - health', 'health-status', true, null],
    ['Error case - flag off and valid pathway', 'accommodation', false, 'Page unavailable'],
    ['Error case - flag off and invalid pathway', 'not-a-pathway', false, 'Pathway not found'],
    ['Error case - flag on and invalid pathway', 'not-a-pathway', true, 'Pathway not found'],
  ])('%s -> validatePathwaySupportNeeds(%s)', async (_: string, pathway: string, flag: boolean, error: string) => {
    const mockedFeatureFlags = new FeatureFlags()
    jest.spyOn(mockedFeatureFlags, 'IsInitialized').mockReturnValue(true)
    jest.spyOn(mockedFeatureFlags, 'getFeatureFlag').mockReturnValue(flag)
    jest.spyOn(FeatureFlags, 'getInstance').mockReturnValue(mockedFeatureFlags)

    if (!error) {
      await validatePathwaySupportNeeds(pathway)
    } else {
      await expect(validatePathwaySupportNeeds(pathway)).rejects.toThrow(error)
    }
  })
})

describe('validateStringIsAnInteger', () => {
  it.each([
    ['valid 1', '1', null],
    ['valid 13', '13', null],
    ['valid 1256', '1256', null],
    ['not valid - number not whole', '12.5', 'Input 12.5 is not a valid integer'],
    ['not valid - number has leading zeros', '00457', 'Input 00457 is not a valid integer'],
    ['not valid - not a number', 'abcd', 'Input abcd is not a valid integer'],
    ['not valid - mix of numbers and letters', '1234abcd', 'Input 1234abcd is not a valid integer'],
    ['not valid - mix of letters and numbers', 'rydhj7865', 'Input rydhj7865 is not a valid integer'],
    [
      'not valid - special chars',
      '!"£$%^&*()-_=+[]{};:@\'#~/?<>,.|',
      'Input !"£$%^&*()-_=+[]{};:@\'#~/?<>,.| is not a valid integer',
    ],
  ])('%s -> validateStringIsAnInteger(%s)', (_: string, input: string, error: string) => {
    if (!error) {
      validateStringIsAnInteger(input)
    } else {
      expect(() => validateStringIsAnInteger(input)).toThrow(error)
    }
  })
})

describe('processSupportNeedsRequestBody', () => {
  it.each([
    [
      'happy path 1',
      {
        additionalDetails: 'This are the additional details',
        updateStatus: 'IN_PROGRESS',
        responsibleStaff: ['PRISON'],
      },
      {
        text: 'This are the additional details',
        status: SupportNeedStatus.IN_PROGRESS,
        isPrisonResponsible: true,
        isProbationResponsible: false,
      },
      null,
    ],
    [
      'happy path 2',
      {
        updateStatus: 'NOT_STARTED',
        responsibleStaff: ['PRISON', 'PROBATION'],
      },
      {
        status: SupportNeedStatus.NOT_STARTED,
        isPrisonResponsible: true,
        isProbationResponsible: true,
        text: null,
      },
      null,
    ],
    [
      'happy path 2',
      {
        additionalDetails: '',
        updateStatus: 'MET',
        responsibleStaff: 'PROBATION',
      },
      {
        status: SupportNeedStatus.MET,
        isPrisonResponsible: false,
        isProbationResponsible: true,
        text: null,
      },
      null,
    ],
    [
      'happy path 3',
      {
        additionalDetails: '   Some text with whitespace     ',
        updateStatus: 'DECLINED',
      },
      {
        status: SupportNeedStatus.DECLINED,
        isPrisonResponsible: false,
        isProbationResponsible: false,
        text: 'Some text with whitespace',
      },
      null,
    ],
    [
      'status does not exist',
      {
        additionalDetails: 'An update',
        updateStatus: 'DOES_NOT_EXIST',
      },
      null,
      'Cannot extract updateStatus from form',
    ],
  ])(
    '%s -> processSupportNeedsRequestBody(%s)',
    (_: string, input: Record<string, string | string[]>, expected: PrisonerSupportNeedsPatch, error: string) => {
      if (!error) {
        expect(processSupportNeedsRequestBody(input)).toEqual(expected)
      } else {
        expect(() => processSupportNeedsRequestBody(input)).toThrow(error)
      }
    },
  )
})

describe('trimToNull', () => {
  it.each([
    ['normal string', 'This is a normal string.', 'This is a normal string.'],
    ['string with leading/trailing whitespace', '  this is a  sentence  ', 'this is a  sentence'],
    ['blank', '', null],
    ['whitespace', '    ', null],
    ['null', null, null],
    ['undefined', undefined, null],
  ])('%s -> trimToNull(%s)', (_: string, input: string, output: string) => {
    expect(trimToNull(input)).toEqual(output)
  })
})

describe('validSupportNeedsStatus', () => {
  it.each([
    ['Not started', 'NOT_STARTED', true],
    ['In progress', 'IN_PROGRESS', true],
    ['Declined', 'DECLINED', true],
    ['Met', 'MET', true],
    ['invalid', 'INVALID', false],
    ['null', null, false],
    ['undefined', undefined, false],
  ])('%s -> validSupportNeedsStatus(%s)', (_: string, input: string, output: boolean) => {
    expect(validSupportNeedsStatus(input)).toEqual(output)
  })
})

describe('errorSummaryList', () => {
  it('should map errors to text and href', () => {
    const errors = <FieldValidationError[]>[
      { msg: 'Field 1 message', path: 'field1' },
      { msg: 'Field 2 message', path: 'field2' },
    ]
    const expectedResult = [
      { text: 'Field 1 message', href: '#field1' },
      { text: 'Field 2 message', href: '#field2' },
    ]

    const result = errorSummaryList(errors)
    expect(result).toEqual(expectedResult)
  })

  it('should map error with no path to text with no href', () => {
    const errors = <FieldValidationError[]>[{ msg: 'Field 1 message with no path' }]
    const expectedResult = [{ text: 'Field 1 message with no path', href: '#' }]

    const result = errorSummaryList(errors)
    expect(result).toEqual(expectedResult)
  })

  it('should handle empty errors object', () => {
    const result = errorSummaryList(undefined)
    expect(result).toEqual([])
  })
})

describe('findError', () => {
  const errors = <FieldValidationError[]>[
    { msg: 'Field 1 message', path: 'field1' },
    { msg: 'Field 2 message', path: 'field2' },
  ]

  it('should find specified error and return errorMessage for GDS components', () => {
    const result = findError(errors, 'field2')

    expect(result).toEqual({ text: 'Field 2 message' })
  })

  it('should handle empty errors object', () => {
    const result = findError(undefined, 'field2')

    expect(result).toEqual(null)
  })

  it('should handle missing form field', () => {
    const result = findError(undefined, undefined)

    expect(result).toEqual(null)
  })
})
