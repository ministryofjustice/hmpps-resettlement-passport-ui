import { stubFor } from '../../wiremock'
import { submitHeaders } from '../../headers'

const patchAccommodationSupportNeedEndATenancy = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/need/286',
      method: 'PATCH',
      bodyPatterns: [
        {
          equalToJson: {
            status: 'IN_PROGRESS',
            isPrisonResponsible: true,
            isProbationResponsible: true,
            text: 'Update',
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
    scenarioName: 'john-smith-patch-accommodation-support-need-end-a-tenancy',
    requiredScenarioState: 'Started',
  })
}

export const johnSmithPatchAccommodationSupportNeeds = () => [patchAccommodationSupportNeedEndATenancy()]
