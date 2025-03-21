import { ResettlementReportUserInput } from './assessmentHelperTypes'
import validateAssessmentResponse from './validateAssessmentResponse'

type ValidationObject = {
  validationType: string
  questionId: string
}

describe('Validate assessment question', () => {
  it.each([
    [null, null, null],
    [
      'Mandatory radio button - no answer provided',
      {
        questionsAndAnswers: [],
        flattenedQuestionsOnPage: [
          {
            question: {
              id: 'REGISTERED_WITH_GP',
              type: 'RADIO',
              options: [
                {
                  id: 'YES',
                  displayText: 'Yes',
                },
                {
                  id: 'NO',
                  displayText: 'No',
                },
              ],
              validation: { type: 'MANDATORY' },
            },
          },
        ],
        pageId: 'REGISTERED_WITH_GP',
      } as ResettlementReportUserInput,
      [
        {
          questionId: 'REGISTERED_WITH_GP',
          validationType: 'MANDATORY_INPUT',
        },
      ],
    ],
    [
      'Mandatory radio button - answer provided',
      {
        questionsAndAnswers: [
          {
            questionId: 'REGISTERED_WITH_GP',
            answer: 'YES',
          },
        ],
        flattenedQuestionsOnPage: [
          {
            question: {
              id: 'REGISTERED_WITH_GP',
              type: 'RADIO',
              options: [
                {
                  id: 'YES',
                  displayText: 'Yes',
                },
                {
                  id: 'NO',
                  displayText: 'No',
                },
              ],
              validation: { type: 'MANDATORY' },
            },
          },
        ],
        pageId: 'REGISTERED_WITH_GP',
      } as ResettlementReportUserInput,
      null,
    ],
    [
      'Multiple question on page - no answers provided',
      {
        questionsAndAnswers: [
          {
            questionId: 'CASE_NOTE_SUMMARY',
            answer: '',
          },
        ],
        flattenedQuestionsOnPage: [
          {
            question: {
              id: 'SUPPORT_NEEDS',
              type: 'RADIO',
              options: [
                {
                  id: 'SUPPORT_REQUIRED',
                  displayText: 'Support required',
                },
                {
                  id: 'SUPPORT_DECLINED',
                  displayText: 'Support declined',
                },
              ],
              validation: { type: 'MANDATORY' },
            },
          },
          {
            question: {
              id: 'CASE_NOTE_SUMMARY',
              type: 'LONG_TEXT',
              options: null,
              validation: { type: 'MANDATORY' },
            },
          },
        ],
        pageId: 'ASSESSMENT_SUMMARY',
      } as ResettlementReportUserInput,
      [
        {
          questionId: 'SUPPORT_NEEDS',
          validationType: 'MANDATORY_INPUT',
        },
        {
          questionId: 'CASE_NOTE_SUMMARY',
          validationType: 'MANDATORY_INPUT',
        },
      ],
    ],
    [
      'Short text max character limit',
      {
        questionsAndAnswers: [
          {
            questionId: 'EMPLOYMENT_TITLE_BEFORE_CUSTODY',
            answer:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 15000s",
          },
        ],
        flattenedQuestionsOnPage: [
          {
            question: {
              id: 'EMPLOYMENT_TITLE_BEFORE_CUSTODY',
              type: 'SHORT_TEXT',
              validation: { type: 'MANDATORY' },
            },
          },
        ],
        pageId: 'EMPLOYMENT_DETAILS_BEFORE_CUSTODY',
      } as ResettlementReportUserInput,
      [
        {
          questionId: 'EMPLOYMENT_TITLE_BEFORE_CUSTODY',
          validationType: 'MAX_CHARACTER_LIMIT_SHORT_TEXT',
        },
      ],
    ],
    [
      'Long text max character limit',
      {
        questionsAndAnswers: [
          {
            questionId: 'CASE_NOTE_SUMMARY',
            answer:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 15000s",
          },
        ],
        flattenedQuestionsOnPage: [
          {
            question: {
              id: 'CASE_NOTE_SUMMARY',
              type: 'LONG_TEXT',
              validation: { type: 'MANDATORY' },
            },
          },
        ],
        pageId: 'ASSESSMENT_SUMMARY',
      } as ResettlementReportUserInput,
      [
        {
          questionId: 'CASE_NOTE_SUMMARY',
          validationType: 'MAX_CHARACTER_LIMIT_LONG_TEXT',
        },
      ],
    ],
    [
      'Address - no answers provided in any field',
      {
        questionsAndAnswers: [
          {
            questionId: 'ADDRESS_OF_EMPLOYER',
            subField: 'addressLine1',
            answer: '',
          },
          {
            questionId: 'ADDRESS_OF_EMPLOYER',
            subField: 'addressLine2',
            answer: '',
          },
          {
            questionId: 'ADDRESS_OF_EMPLOYER',
            subField: 'addressTown',
            answer: '',
          },
          {
            questionId: 'ADDRESS_OF_EMPLOYER',
            subField: 'addressCounty',
            answer: '',
          },
          {
            questionId: 'ADDRESS_OF_EMPLOYER',
            subField: 'addressPostcode',
            answer: '',
          },
        ],
        flattenedQuestionsOnPage: [
          {
            question: {
              id: 'ADDRESS_OF_EMPLOYER',
              type: 'ADDRESS',
              validation: { type: 'MANDATORY' },
            },
          },
        ],
        pageId: 'EMPLOYER_ADDRESS',
      } as ResettlementReportUserInput,
      [
        {
          questionId: 'ADDRESS_OF_EMPLOYER',
          validationType: 'MANDATORY_INPUT',
        },
      ],
    ],
    [
      'Address - 1 answer provided in any field',
      {
        questionsAndAnswers: [
          {
            questionId: 'ADDRESS_OF_EMPLOYER',
            subField: 'addressLine1',
            answer: '',
          },
          {
            questionId: 'ADDRESS_OF_EMPLOYER',
            subField: 'addressLine2',
            answer: '',
          },
          {
            questionId: 'ADDRESS_OF_EMPLOYER',
            subField: 'addressTown',
            answer: 'Test town',
          },
          {
            questionId: 'ADDRESS_OF_EMPLOYER',
            subField: 'addressCounty',
            answer: '',
          },
          {
            questionId: 'ADDRESS_OF_EMPLOYER',
            subField: 'addressPostcode',
            answer: '',
          },
        ],
        flattenedQuestionsOnPage: [
          {
            question: {
              id: 'ADDRESS_OF_EMPLOYER',
              type: 'ADDRESS',
              validation: { type: 'MANDATORY' },
            },
          },
        ],
      } as ResettlementReportUserInput,
      null,
    ],
    [
      'Regex validation - value matches regex',
      {
        questionsAndAnswers: [
          {
            questionId: 'NUMBER_OF_CHILDREN',
            answer: '3',
          },
        ],
        flattenedQuestionsOnPage: [
          {
            question: {
              id: 'NUMBER_OF_CHILDREN',
              type: 'SHORT_TEXT',
              validation: {
                type: 'MANDATORY',
                regex: '^\\d+$',
                message: 'Must be numerical',
              },
            },
          },
        ],
      } as ResettlementReportUserInput,
      null,
    ],
    [
      'Regex validation - value does not match regex',
      {
        questionsAndAnswers: [
          {
            questionId: 'NUMBER_OF_CHILDREN',
            answer: 'not a number',
          },
        ],
        flattenedQuestionsOnPage: [
          {
            question: {
              id: 'NUMBER_OF_CHILDREN',
              type: 'SHORT_TEXT',
              validation: {
                type: 'MANDATORY',
                regex: '^\\d+$',
                message: 'Must be numerical',
              },
            },
          },
        ],
      } as ResettlementReportUserInput,
      [
        {
          questionId: 'NUMBER_OF_CHILDREN',
          validationType: 'CUSTOM',
          customErrorMessage: 'Must be numerical',
        },
      ],
    ],
    [
      'CheckBox - without Other freeText',
      {
        questionsAndAnswers: [
          {
            questionId: 'CHECKBOX_NO_FREETEXT',
            answer: 'NEED_1',
          },
        ],
        flattenedQuestionsOnPage: [
          {
            question: {
              id: 'CHECKBOX_NO_FREETEXT',
              type: 'CHECKBOX',
              options: [
                { id: 'NEED_1', displayText: 'Need 1', description: null, exclusive: false, freeText: false },
                { id: 'NEED_2', displayText: 'Need 2', description: null, exclusive: false, freeText: false },
                { id: 'NEED_3', displayText: 'Need 3', description: null, exclusive: false, freeText: false },
              ],
              validation: { type: 'MANDATORY' },
            },
          },
        ],
      } as ResettlementReportUserInput,
      null,
    ],
    [
      'CheckBox - with Other freeText and other not in answers',
      {
        questionsAndAnswers: [
          {
            questionId: 'CHECKBOX_FREETEXT',
            answer: 'NEED_1',
          },
        ],
        flattenedQuestionsOnPage: [
          {
            question: {
              id: 'CHECKBOX_FREETEXT',
              type: 'CHECKBOX',
              options: [
                { id: 'NEED_1', displayText: 'Need 1', description: null, exclusive: false, freeText: false },
                { id: 'NEED_2', displayText: 'Need 2', description: null, exclusive: false, freeText: false },
                { id: 'NEED_3', displayText: 'Need 3', description: null, exclusive: false, freeText: true },
              ],
              validation: { type: 'MANDATORY' },
            },
          },
        ],
      } as ResettlementReportUserInput,
      null,
    ],
    [
      'CheckBox - with Other freeText and other in answers filled in',
      {
        questionsAndAnswers: [
          {
            questionId: 'CHECKBOX_FREETEXT',
            answer: 'NEED_3: Some text here',
          },
        ],
        flattenedQuestionsOnPage: [
          {
            question: {
              id: 'CHECKBOX_FREETEXT',
              type: 'CHECKBOX',
              options: [
                { id: 'NEED_1', displayText: 'Need 1', description: null, exclusive: false, freeText: false },
                { id: 'NEED_2', displayText: 'Need 2', description: null, exclusive: false, freeText: false },
                { id: 'NEED_3', displayText: 'Need 3', description: null, exclusive: false, freeText: true },
              ],
              validation: { type: 'MANDATORY' },
            },
          },
        ],
      } as ResettlementReportUserInput,
      null,
    ],
    [
      'CheckBox - with Other freeText and other in answers not filled in',
      {
        questionsAndAnswers: [
          {
            questionId: 'CHECKBOX_FREETEXT',
            answer: 'NEED_3: ',
          },
        ],
        flattenedQuestionsOnPage: [
          {
            question: {
              id: 'CHECKBOX_FREETEXT',
              type: 'CHECKBOX',
              options: [
                { id: 'NEED_1', displayText: 'Need 1', description: null, exclusive: false, freeText: false },
                { id: 'NEED_2', displayText: 'Need 2', description: null, exclusive: false, freeText: false },
                { id: 'NEED_3', displayText: 'Need 3', description: null, exclusive: false, freeText: true },
              ],
              validation: { type: 'MANDATORY' },
            },
          },
        ],
      } as ResettlementReportUserInput,
      [
        {
          questionId: 'CHECKBOX_FREETEXT',
          validationType: 'MANDATORY_INPUT',
          optionId: 'NEED_3',
        },
      ],
    ],
  ])(
    '%s validateAssessmentResponse(%s)',
    (_: string, userInput: ResettlementReportUserInput, expected: ValidationObject[] | null) => {
      expect(validateAssessmentResponse(userInput)).toEqual(expected)
    },
  )
})
