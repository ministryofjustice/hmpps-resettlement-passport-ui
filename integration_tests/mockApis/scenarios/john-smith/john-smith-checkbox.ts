import { stubFor } from '../../wiremock'
import { responseHeaders } from '../../headers'

export const johnSmithCheckbox = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy_resettlement-assessment_accommodation_page_where_did_they_live',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/WHERE_DID_THEY_LIVE?assessmentType=RESETTLEMENT_PLAN',
      method: 'GET',
    },
    response: {
      status: 200,
      jsonBody: {
        id: 'WHERE_DID_THEY_LIVE',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'WHERE_DID_THEY_LIVE',
              title: 'Where did the person in prison live before custody?',
              subTitle: 'New subTitle text here',
              type: 'CHECKBOX',
              options: [
                {
                  id: 'PRIVATE_RENTED_HOUSING',
                  displayText: 'Private rented housing',
                  description: null,
                  exclusive: false,
                },
                { id: 'SOCIAL_HOUSING', displayText: 'Social housing', description: null, exclusive: false },
                { id: 'HOMEOWNER', displayText: 'Homeowner', description: null, exclusive: false },
                {
                  id: 'NO_PERMANENT_OR_FIXED',
                  displayText: 'No permanent or fixed address',
                  description: null,
                  exclusive: false,
                },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
              ],
              validationType: 'MANDATORY',
            },
            answer: { '@class': 'StringAnswer', answer: 'NO_PERMANENT_OR_FIXED' },
            originalPageId: 'WHERE_DID_THEY_LIVE',
          },
        ],
      },
      headers: responseHeaders,
    },
  })
