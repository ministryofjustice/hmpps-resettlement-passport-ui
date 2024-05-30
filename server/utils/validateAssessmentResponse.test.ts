import { AssessmentPage, QuestionsAndAnswers } from '../data/model/immediateNeedsReport'
import validateAssessmentResponse, { RequestBody } from './validateAssessmentResponse'

type ValidationObject = {
  validationType: string
  questionId: string
}

describe('Validate assessment question', () => {
  it.each([
    [null, null, null, null],
    [
      'Mandatory radio button - no answer provided',
      {
        id: 'REGISTERED_WITH_GP',
        questionsAndAnswers: [
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
              validationType: 'MANDATORY',
            },
          } as QuestionsAndAnswers,
        ],
      },
      {
        pathway: 'HEALTH',
        currentPageId: 'REGISTERED_WITH_GP',
      },
      [
        {
          questionId: 'REGISTERED_WITH_GP',
          validationType: 'MANDATORY',
        },
      ],
    ],
    [
      'Mandatory radio button - answer provided',
      {
        id: 'REGISTERED_WITH_GP',
        questionsAndAnswers: [
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
              validationType: 'MANDATORY',
            },
          } as QuestionsAndAnswers,
        ],
      },
      {
        REGISTERED_WITH_GP: 'YES',
        pathway: 'HEALTH',
        currentPageId: 'REGISTERED_WITH_GP',
      },
      null,
    ],
    [
      'Multiple question on page - no answers provided',
      {
        id: 'ASSESSMENT_SUMMARY',
        questionsAndAnswers: [
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
              validationType: 'MANDATORY',
            },
          } as QuestionsAndAnswers,
          {
            question: {
              id: 'CASE_NOTE_SUMMARY',
              type: 'LONG_TEXT',
              options: null,
              validationType: 'MANDATORY',
            },
          } as QuestionsAndAnswers,
        ],
      },
      {
        CASE_NOTE_SUMMARY: '',
        pathway: 'ACCOMMODATION',
        currentPageId: 'ASSESSMENT_SUMMARY',
      },
      [
        {
          questionId: 'SUPPORT_NEEDS',
          validationType: 'MANDATORY',
        },
        {
          questionId: 'CASE_NOTE_SUMMARY',
          validationType: 'MANDATORY',
        },
      ],
    ],
    [
      'Short text max character limit',
      {
        id: 'EMPLOYMENT_DETAILS_BEFORE_CUSTODY',
        questionsAndAnswers: [
          {
            question: {
              id: 'EMPLOYMENT_TITLE_BEFORE_CUSTODY',
              type: 'SHORT_TEXT',
              validationType: 'MANDATORY',
            },
          } as QuestionsAndAnswers,
        ],
      },
      {
        EMPLOYMENT_TITLE_BEFORE_CUSTODY:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 15000s",
        pathway: 'EDUCATION_SKILLS_AND_WORK',
        currentPageId: 'EMPLOYMENT_DETAILS_BEFORE_CUSTODY',
      },
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
        id: 'CASE_NOTE_SUMMARY',
        questionsAndAnswers: [
          {
            question: {
              id: 'CASE_NOTE_SUMMARY',
              type: 'LONG_TEXT',
              validationType: 'MANDATORY',
            },
          } as QuestionsAndAnswers,
        ],
      },
      {
        CASE_NOTE_SUMMARY:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 15000s",
        pathway: 'EDUCATION_SKILLS_AND_WORK',
        currentPageId: 'EMPLOYMENT_DETAILS_BEFORE_CUSTODY',
      },
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
        id: 'EMPLOYMENT_DETAILS_BEFORE_CUSTODY',
        questionsAndAnswers: [
          {
            question: {
              id: 'ADDRESS_OF_EMPLOYER',
              type: 'ADDRESS',
              validationType: 'MANDATORY',
            },
          } as QuestionsAndAnswers,
        ],
      },
      {
        pathway: 'EDUCATION_SKILLS_AND_WORK',
        currentPageId: 'EMPLOYMENT_DETAILS_BEFORE_CUSTODY',
        addressLine1: '',
        addressLine2: '',
        addressTown: '',
        addressCounty: '',
        addressPostcode: '',
      },
      [
        {
          questionId: 'ADDRESS_OF_EMPLOYER',
          validationType: 'MANDATORY',
        },
      ],
    ],
    [
      'Address - 1 answer provided in any field',
      {
        id: 'EMPLOYMENT_DETAILS_BEFORE_CUSTODY',
        questionsAndAnswers: [
          {
            question: {
              id: 'ADDRESS_OF_EMPLOYER',
              type: 'ADDRESS',
              validationType: 'MANDATORY',
            },
          } as QuestionsAndAnswers,
        ],
      },
      {
        pathway: 'EDUCATION_SKILLS_AND_WORK',
        currentPageId: 'EMPLOYMENT_DETAILS_BEFORE_CUSTODY',
        addressLine1: '',
        addressLine2: '',
        addressTown: 'Test town',
        addressCounty: '',
        addressPostcode: '',
      },
      null,
    ],
  ])(
    '%s validateAssessmentResponse(%s, %s)',
    (_: string, currentPage: AssessmentPage, reqBody: RequestBody, expected: ValidationObject[] | null) => {
      expect(validateAssessmentResponse(currentPage, reqBody)).toEqual(expected)
    },
  )
})
