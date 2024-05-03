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
            applicationSubmittedDate: '2024-04-26T00:00:00',
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

const submitDrivingLicence = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/idapplication',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: JSON.stringify({
            idType: 'Driving licence',
            applicationSubmittedDate: '2024-05-01T00:00:00',
            isPriorityApplication: 'false',
            costOfApplication: 100,
            driversLicenceType: 'Renewal',
            driversLicenceApplicationMadeAt: 'Online',
          }),
        },
      ],
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
    scenarioName: 'john-smith-finance-add-driving',
    requiredScenarioState: 'Started',
  })
}

const submitMarriageCertificate = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/idapplication',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: JSON.stringify({
            idType: 'Marriage certificate',
            applicationSubmittedDate: '2024-05-02T01:00:00',
            isPriorityApplication: 'false',
            costOfApplication: 10.5,
            haveGro: 'false',
            isUkNationalBornOverseas: 'true',
            countryBornIn: 'Malawi',
          }),
        },
      ],
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
    scenarioName: 'john-smith-finance-add-marriage',
    requiredScenarioState: 'Started',
  })
}

export const johnSmithPostFinanceAndID = () => [submitBankAccount()]
export const johnSmithPostID = () => [submitDrivingLicence(), submitMarriageCertificate()]
