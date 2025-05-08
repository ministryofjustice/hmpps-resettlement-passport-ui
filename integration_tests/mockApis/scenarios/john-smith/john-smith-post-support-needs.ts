import { stubFor } from '../../wiremock'
import { submitHeaders } from '../../headers'

const postAccommodationSupportNeeds = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/needs',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: {
            needs: [
              {
                needId: 1,
                prisonerSupportNeedId: null,
                otherDesc: null,
                text: 'Some additional details',
                status: 'NOT_STARTED',
                isPrisonResponsible: true,
                isProbationResponsible: false,
              },
              {
                needId: 11,
                prisonerSupportNeedId: null,
                otherDesc: null,
                text: null,
                status: null,
                isPrisonResponsible: null,
                isProbationResponsible: null,
              },
              {
                needId: 14,
                prisonerSupportNeedId: null,
                otherDesc: 'Custom accommodation support need',
                text: '',
                status: 'IN_PROGRESS',
                isPrisonResponsible: false,
                isProbationResponsible: true,
              },
            ],
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
    scenarioName: 'john-smith-post-accommodation-support-needs-first-time',
    requiredScenarioState: 'Started',
  })
}

export const johnSmithPostAccommodationSupportNeeds = () => [postAccommodationSupportNeeds()]
