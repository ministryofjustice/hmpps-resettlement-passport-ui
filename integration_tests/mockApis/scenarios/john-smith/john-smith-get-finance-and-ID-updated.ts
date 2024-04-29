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
            changeDate: '2024-04-12T00:00:00',
          },
          {
            id: 2,
            status: 'Returned incomplete',
            changeDate: '2024-04-13T00:00:00',
          },
          {
            id: 3,
            status: 'Account declined',
            changeDate: '2024-04-14T00:00:00',
          },
        ],
        applicationSubmittedDate: '2024-04-12T00:00:00',
        currentStatus: 'Account declined',
        bankName: 'HSBC',
        bankResponseDate: '2024-04-14T00:00:00',
        isAddedToPersonalItems: false,
        addedToPersonalItemsDate: null,
      },
    },
    scenarioName: 'john-smith-finance-get-bank-account',
    requiredScenarioState: 'Started',
  })
}

const johnSmithGetFinanceAndIDUpdated = () => [getBankAccount()]
export default johnSmithGetFinanceAndIDUpdated
