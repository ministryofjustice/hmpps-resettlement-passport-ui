import { stubFor } from '../../wiremock'
import { submitHeaders } from '../../headers'

const submitBankAccount = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/bankapplication',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: JSON.stringify({
            applicationSubmittedDate: '2024-04-25T23:00:00.000Z',
            bankName: 'Nationwide',
          }),
        },
      ],
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
    scenarioName: 'john-smith-finance-add-bank-account',
    requiredScenarioState: 'Started',
  })
}

const johnSmithPostFinanceAndID = () => [submitBankAccount()]
export default johnSmithPostFinanceAndID
