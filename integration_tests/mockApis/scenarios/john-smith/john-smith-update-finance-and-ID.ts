import { stubFor } from '../../wiremock'
import { submitHeaders } from '../../headers'

const patchBankAccount = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/bankapplication/1',
      method: 'PATCH',
      bodyPatterns: [
        {
          equalToJson: JSON.stringify({
            status: 'Account opened',
            bankResponseDate: '2024-04-29T01:00:00',
            isAddedToPersonalItems: true,
            addedToPersonalItemsDate: '2024-04-30T01:00:00',
            resubmissionDate: null,
          }),
        },
      ],
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
    scenarioName: 'john-smith-finance-update-bank-account',
    requiredScenarioState: 'Started',
  })
}

const johnSmithUpdateFinanceAndID = () => [patchBankAccount()]
export default johnSmithUpdateFinanceAndID
