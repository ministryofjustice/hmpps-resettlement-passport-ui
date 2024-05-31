import { stubJohnSmithPrisonerDetails } from './john-smith-prisoner-details'
import { stubFor } from '../../wiremock'
import { submitHeaders } from '../../headers'
import { johnSmithDefaults } from './john-smith'

const assessmentFlags = {
  assessmentRequired: false,
  immediateNeedsSubmitted: true,
  preReleaseSubmitted: false,
  resettlementReviewAvailable: true,
}

const profileBeforeUpdate = () =>
  stubJohnSmithPrisonerDetails({
    pathwayStatus: {
      ACCOMMODATION: 'SUPPORT_REQUIRED',
    },
    assessmentFlags,
    scenarioName: 'john-smith-status-update',
    requiredScenarioState: 'Started',
  })

const profileAfterUpdate = () =>
  stubJohnSmithPrisonerDetails({
    pathwayStatus: {
      ACCOMMODATION: 'IN_PROGRESS',
    },
    assessmentFlags,
    scenarioName: 'john-smith-status-update',
    requiredScenarioState: 'after-submit',
  })

const stubApiUpdate = () =>
  stubFor({
    name: 'update john smith accommodation to in progress',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/pathway-with-case-note',
      method: 'PATCH',
      bodyPatterns: [
        {
          equalToJson: JSON.stringify({
            caseNoteText: 'Resettlement status set to: In progress. Initial enquiries have been made',
            pathway: 'ACCOMMODATION',
            status: 'IN_PROGRESS',
          }),
          ignoreArrayOrder: true,
          ignoreExtraElements: true,
        },
      ],
    },
    response: {
      headers: submitHeaders,
      status: 200,
    },
    scenarioName: 'john-smith-status-update',
    requiredScenarioState: 'Started',
    newScenarioState: 'after-submit',
  })

const stubApiUpdateFailure = () =>
  stubFor({
    name: 'update john smith but the request fails',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/pathway-with-case-note',
      method: 'PATCH',
      bodyPatterns: [
        {
          equalToJson: JSON.stringify({
            caseNoteText: 'Resettlement status set to: In progress. Long and precious case note',
            pathway: 'ACCOMMODATION',
            status: 'IN_PROGRESS',
          }),
          ignoreArrayOrder: true,
          ignoreExtraElements: true,
        },
      ],
    },
    response: {
      headers: submitHeaders,
      status: 500,
      jsonBody: {
        status: 500,
        userMessage: 'It broke, sorry',
      },
    },
  })

export const stubJohnSmithStatusUpdateSuccess = () =>
  Promise.all([...johnSmithDefaults(), profileBeforeUpdate(), profileAfterUpdate(), stubApiUpdate()])

export const stubJohnSmithStatusUpdateFailure = () =>
  Promise.all([...johnSmithDefaults(), profileBeforeUpdate(), stubApiUpdateFailure()])
