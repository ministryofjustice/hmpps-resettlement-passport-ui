import { stubFor } from '../../wiremock'
import { responseHeaders } from '../../headers'

const getBankAccount = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/bankapplication',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 1,
        prisoner: {
          id: 1,
          nomsId: 'A8731DY',
          creationDate: '2023-11-17T14:49:58.308566',
          crn: 'U328968',
          prisonId: 'MDI',
          releaseDate: '2024-06-17',
        },
        logs: [
          {
            id: 1,
            status: 'Pending',
            changeDate: '2024-03-12T00:00:00',
          },
        ],
        applicationSubmittedDate: '2024-03-12T00:00:00',
        currentStatus: 'Pending',
        bankName: 'Barclays',
      },
    },
    scenarioName: 'john-smith-finance-get-bank-account',
    requiredScenarioState: 'Started',
  })
}

const johnSmithGetFinanceAndID = () => [getBankAccount()]
export default johnSmithGetFinanceAndID
