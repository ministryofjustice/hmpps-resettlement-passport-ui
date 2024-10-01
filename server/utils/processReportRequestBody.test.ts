import { RequestBody, ResettlementReportUserInput } from './assessmentHelperTypes'
import { ApiAssessmentPage } from '../data/model/immediateNeedsReport'
import { processReportRequestBody } from './processReportRequestBody'

describe('Process Report Request Body', () => {
  it.each([
    [
      'Happy path',
      {
        id: 'PAST_AND_FUTURE_ACCOMMODATION',
        questionsAndAnswers: [
          {
            question: {
              id: 'WHERE_DID_THEY_LIVE',
              title: 'Where did the person in prison live before custody?',
              type: 'RADIO',
              options: [
                {
                  id: 'PRIVATE_RENTED_HOUSING',
                  displayText: 'Private rented housing',
                  nestedQuestions: [
                    {
                      question: {
                        id: 'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_RENTED_HOUSING',
                        title: 'Enter the address',
                        type: 'ADDRESS',
                        validationType: 'MANDATORY',
                      },
                      originalPageId: 'PAST_AND_FUTURE_ACCOMMODATION',
                    },
                  ],
                },
                {
                  id: 'PRIVATE_HOUSING_OWNED',
                  displayText: 'Private housing owned by them',
                  nestedQuestions: [
                    {
                      question: {
                        id: 'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_HOUSING_OWNED',
                        title: 'Enter the address',
                        type: 'ADDRESS',
                        validationType: 'MANDATORY',
                      },
                      originalPageId: 'PAST_AND_FUTURE_ACCOMMODATION',
                    },
                  ],
                },
              ],
              validationType: 'MANDATORY',
            },
            originalPageId: 'PAST_AND_FUTURE_ACCOMMODATION',
          },
          {
            question: {
              id: 'ADDITIONAL_INFORMATION_WHERE_DID_THEY_LIVE',
              title: 'Additional information',
              type: 'LONG_TEXT',
              validationType: 'MANDATORY',
            },
            originalPageId: 'PAST_AND_FUTURE_ACCOMMODATION',
          },
        ],
      } as ApiAssessmentPage,
      {
        WHERE_DID_THEY_LIVE: 'PRIVATE_RENTED_HOUSING',
        'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_RENTED_HOUSING-addressLine1': '123 Fake Street',
        'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_RENTED_HOUSING-addressLine2': '',
        'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_RENTED_HOUSING-addressTown': 'Leeds',
        'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_RENTED_HOUSING-county': 'West Yorkshire',
        'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_RENTED_HOUSING-postcode': 'LS1 1AS',
        ADDITIONAL_INFORMATION_WHERE_DID_THEY_LIVE: 'some additional information',
      } as RequestBody,
      {
        questionsAndAnswers: [
          {
            questionId: 'WHERE_DID_THEY_LIVE',
            answer: 'PRIVATE_RENTED_HOUSING',
          },
          {
            questionId: 'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_RENTED_HOUSING',
            subField: 'addressLine1',
            answer: '123 Fake Street',
          },
          {
            questionId: 'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_RENTED_HOUSING',
            subField: 'addressLine2',
            answer: '',
          },
          {
            questionId: 'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_RENTED_HOUSING',
            subField: 'addressTown',
            answer: 'Leeds',
          },
          {
            questionId: 'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_RENTED_HOUSING',
            subField: 'county',
            answer: 'West Yorkshire',
          },
          {
            questionId: 'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_RENTED_HOUSING',
            subField: 'postcode',
            answer: 'LS1 1AS',
          },
          {
            questionId: 'ADDITIONAL_INFORMATION_WHERE_DID_THEY_LIVE',
            answer: 'some additional information',
          },
        ],
        flattenedQuestionsOnPage: [
          {
            question: {
              id: 'WHERE_DID_THEY_LIVE',
              title: 'Where did the person in prison live before custody?',
              type: 'RADIO',
              options: [
                {
                  id: 'PRIVATE_RENTED_HOUSING',
                  displayText: 'Private rented housing',
                  nestedQuestions: [
                    {
                      question: {
                        id: 'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_RENTED_HOUSING',
                        title: 'Enter the address',
                        type: 'ADDRESS',
                        validationType: 'MANDATORY',
                      },
                      originalPageId: 'PAST_AND_FUTURE_ACCOMMODATION',
                    },
                  ],
                },
                {
                  id: 'PRIVATE_HOUSING_OWNED',
                  displayText: 'Private housing owned by them',
                  nestedQuestions: [
                    {
                      question: {
                        id: 'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_HOUSING_OWNED',
                        title: 'Enter the address',
                        type: 'ADDRESS',
                        validationType: 'MANDATORY',
                      },
                      originalPageId: 'PAST_AND_FUTURE_ACCOMMODATION',
                    },
                  ],
                },
              ],
              validationType: 'MANDATORY',
            },
            originalPageId: 'PAST_AND_FUTURE_ACCOMMODATION',
          },
          {
            question: {
              id: 'WHERE_DID_THEY_LIVE_ADDRESS_PRIVATE_RENTED_HOUSING',
              title: 'Enter the address',
              type: 'ADDRESS',
              validationType: 'MANDATORY',
            },
            originalPageId: 'PAST_AND_FUTURE_ACCOMMODATION',
          },
          {
            question: {
              id: 'ADDITIONAL_INFORMATION_WHERE_DID_THEY_LIVE',
              title: 'Additional information',
              type: 'LONG_TEXT',
              validationType: 'MANDATORY',
            },
            originalPageId: 'PAST_AND_FUTURE_ACCOMMODATION',
          },
        ],
        pageId: 'PAST_AND_FUTURE_ACCOMMODATION',
      } as ResettlementReportUserInput,
    ],
  ])(
    '%s processReportRequestBody(%s, %s)',
    (_: string, currentPage: ApiAssessmentPage, body: RequestBody, expected: ResettlementReportUserInput | null) => {
      expect(processReportRequestBody(currentPage, body)).toEqual(expected)
    },
  )
})
