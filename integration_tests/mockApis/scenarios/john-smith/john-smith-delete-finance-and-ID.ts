import { stubFor } from '../../wiremock'
import { submitHeaders } from '../../headers'

const deleteBankAccount = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/bankapplication/1',
      method: 'DELETE',
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
    scenarioName: 'john-smith-finance-delete-bank-account',
    requiredScenarioState: 'Started',
  })
}

const deleteId = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/idapplication/1',
      method: 'DELETE',
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
    scenarioName: 'john-smith-finance-delete-Id',
    requiredScenarioState: 'Started',
  })
}

export const johnSmithDeleteFinanceAndID = () => [deleteBankAccount()]
export const johnSmithDeleteID = () => [deleteId()]
