import { stubFor } from '../../wiremock'
import { responseHeaders } from '../../headers'

const errorOnAccommodation = () =>
  stubFor({
    name: 'John Smith Details',
    request: {
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/latest`,
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 400,
    },
    scenarioName: 'john-smith-prisoner-accommodation-400',
    requiredScenarioState: 'Started',
  })

const successOnFinanceAndIt = () =>
  stubFor({
    name: 'John Smith Details',
    request: {
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/FINANCE_AND_ID/latest`,
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 200,
      jsonBody: {
        originalAssessment: {
          assessmentType: 'BCST2',
          lastUpdated: '2023-10-10T15:54:02.235',
          updatedBy: 'Prison Officer',
          questionsAndAnswers: [
            {
              questionTitle: 'Where did the person in prison live before custody?',
              answer: 'No answer provided',
              originalPageId: 'WHERE_DID_THEY_LIVE',
            },
            {
              questionTitle: 'Where will the person in prison live when they are released?',
              answer: 'Move to a new address',
              originalPageId: 'WHERE_WILL_THEY_LIVE_2',
            },
            {
              questionTitle: 'Enter the address',
              answer: '123 The Street\nLeeds\nWest Yorkshire\nLS1 1AA',
              originalPageId: 'WHERE_WILL_THEY_LIVE_ADDRESS',
            },
          ],
        },
        latestAssessment: {
          assessmentType: 'BCST2',
          lastUpdated: '2023-10-18T12:21:38.709',
          updatedBy: 'Prison Officer',
          questionsAndAnswers: [
            {
              questionTitle: 'Where did the person in prison live before custody?',
              answer: 'Social housing',
              originalPageId: 'WHERE_DID_THEY_LIVE',
            },
            {
              questionTitle: 'Enter the address',
              answer: '12 Street Lane\nLeeds\nLS1 2AB',
              originalPageId: 'WHERE_DID_THEY_LIVE_ADDRESS',
            },
            {
              questionTitle:
                'Does the person in prison or their family need help to keep their home while they are in prison?',
              answer: 'No',
              originalPageId: 'HELP_TO_KEEP_HOME',
            },
            {
              questionTitle: 'Where will the person in prison live when they are released?',
              answer: 'Move to a new address',
              originalPageId: 'WHERE_WILL_THEY_LIVE_1',
            },
            {
              questionTitle: 'Enter the address',
              answer: '12 New address Street\nabcd\nBradford\nWest Yorkshire\nBD1 1AB',
              originalPageId: 'WHERE_WILL_THEY_LIVE_ADDRESS',
            },
          ],
        },
      },
    },
    scenarioName: 'john-smith-prisoner-finance-and-it-200',
    requiredScenarioState: 'Started',
  })

const licenceImage404 = () =>
  stubFor({
    name: 'John Smith Details',
    request: {
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/licence-condition/id/101/condition/1008/image`,
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 404,
    },
    scenarioName: 'john-smith-prisoner-licence-image',
    requiredScenarioState: 'Started',
    newScenarioState: 'licenceImageSuccess',
  })

const licenceImage200 = () =>
  stubFor({
    name: 'John Smith Details',
    request: {
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/licence-condition/id/101/condition/1008/image`,
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 200,
    },
    scenarioName: 'john-smith-prisoner-licence-image',
    requiredScenarioState: 'licenceImageSuccess',
  })

export const johnSmithReportInfo = () => [errorOnAccommodation(), successOnFinanceAndIt()]
export const johnSmithLicenceImage = () => [licenceImage404(), licenceImage200()]
