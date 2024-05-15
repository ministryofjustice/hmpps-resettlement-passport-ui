import { johnSmithDefaults } from './john-smith'
import johnSmithGetPrisonerDetails, {
  aDateInsideOfPreReleaseWindow,
  aDateOutsideOfPreReleaseWindow,
} from './john-smith-prisoner-details'
import { stubFor } from '../../wiremock'
import { responseHeaders, submitHeaders } from '../../headers'

const stubAssessmentSkip = () =>
  stubFor({
    name: 'Assessment skip post',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/skip',
      method: 'POST',
    },
    response: {
      status: 204,
      headers: submitHeaders,
    },
  })

export const stubJohnSmithSkipInsidePreReleaseWindow = () =>
  Promise.all([
    ...johnSmithDefaults(),
    ...johnSmithGetPrisonerDetails(aDateInsideOfPreReleaseWindow),
    stubAssessmentSkip(),
  ])

export const stubJohnSmithSkipOutsidePreReleaseWindow = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithGetPrisonerDetails(aDateOutsideOfPreReleaseWindow)])
