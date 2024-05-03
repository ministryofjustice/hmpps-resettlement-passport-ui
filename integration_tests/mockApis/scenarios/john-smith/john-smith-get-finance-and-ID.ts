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

const getID = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/idapplication/all',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      body: JSON.stringify([
        {
          id: 1,
          prisoner: {
            id: 1,
            nomsId: 'A8731DY',
            creationDate: '2023-11-17T14:49:58.308566',
            crn: 'U328968',
            prisonId: 'MDI',
            releaseDate: '2024-06-17',
          },
          idType: {
            id: 1,
            name: 'Birth certificate',
          },
          creationDate: '2023-08-17T12:00:01',
          applicationSubmittedDate: '2023-08-17T12:00:01',
          isPriorityApplication: false,
          costOfApplication: 10.5,
          refundAmount: null,
          haveGro: true,
          isUkNationalBornOverseas: false,
          countryBornIn: null,
          caseNumber: null,
          courtDetails: null,
          driversLicenceType: null,
          driversLicenceApplicationMadeAt: null,
          isAddedToPersonalItems: null,
          addedToPersonalItemsDate: null,
          status: 'pending',
          statusUpdateDate: null,
          isDeleted: false,
          deletionDate: null,
          dateIdReceived: null,
        },
      ]),
    },
    scenarioName: 'john-smith-finance-get-ID',
    requiredScenarioState: 'Started',
  })
}
export const johnSmithGetFinanceAndID = () => [getBankAccount(), getID()]
export const johnSmithGetFinance = () => [getBankAccount()]
