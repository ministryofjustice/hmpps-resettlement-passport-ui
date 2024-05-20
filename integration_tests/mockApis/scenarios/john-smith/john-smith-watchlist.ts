import { stubFor } from '../../wiremock'
import { responseHeaders } from '../../headers'

const prisonerDetails = {
  personalDetails: {
    prisonerNumber: 'A8731DY',
    prisonId: 'MDI',
    firstName: 'John',
    middleNames: 'Michael',
    lastName: 'Smith',
    releaseDate: '2024-06-17',
    releaseType: 'CRD',
    dateOfBirth: '1982-10-24',
    age: 41,
    location: 'K-3-011',
    facialImageId: '1313058',
  },
  pathways: [
    {
      pathway: 'ACCOMMODATION',
      status: 'NOT_STARTED',
      lastDateChange: null,
    },
    {
      pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
      status: 'NOT_STARTED',
      lastDateChange: null,
    },
    {
      pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
      status: 'NOT_STARTED',
      lastDateChange: null,
    },
    {
      pathway: 'DRUGS_AND_ALCOHOL',
      status: 'NOT_STARTED',
      lastDateChange: null,
    },
    {
      pathway: 'EDUCATION_SKILLS_AND_WORK',
      status: 'NOT_STARTED',
      lastDateChange: null,
    },
    { pathway: 'FINANCE_AND_ID', status: 'NOT_STARTED', lastDateChange: null },
    {
      pathway: 'HEALTH',
      status: 'NOT_STARTED',
      lastDateChange: null,
    },
  ],
  assessmentRequired: true,
  resettlementReviewAvailable: false,
  isInWatchlist: false,
}

const prisonerDetailsWithWatchlist = {
  ...prisonerDetails,
  isInWatchlist: true,
}

const postWatchlist = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/watch',
      method: 'POST',
    },
    response: {
      status: 200,
      headers: responseHeaders,
    },
    scenarioName: 'john-smith-finance-post-watchlist',
    requiredScenarioState: 'Started',
  })
}

const deleteWatchlist = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/watch',
      method: 'DELETE',
    },
    response: {
      status: 200,
      headers: responseHeaders,
    },
    scenarioName: 'john-smith-finance-delete-watchlist',
    requiredScenarioState: 'Started',
  })
}

const postWatchlist404 = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/watch',
      method: 'POST',
    },
    response: {
      status: 404,
      headers: responseHeaders,
    },
    scenarioName: 'john-smith-finance-post-watchlist-404',
    requiredScenarioState: 'Started',
  })
}

const deleteWatchlist404 = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/watch',
      method: 'DELETE',
    },
    response: {
      status: 404,
      headers: responseHeaders,
    },
    scenarioName: 'john-smith-finance-delete-watchlist-404',
    requiredScenarioState: 'Started',
  })
}

const johnSmithPrisonerDetailsNoWatchlist = () =>
  stubFor({
    name: 'John Smith Details',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY',
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 200,
      jsonBody: prisonerDetails,
    },
    scenarioName: 'john-smith-prisoner-adding-case',
    requiredScenarioState: 'Started',
    newScenarioState: 'withWatchlist',
  })

const johnSmithPrisonerDetailsWatchlist = () =>
  stubFor({
    name: 'John Smith Details',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY',
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 200,
      jsonBody: prisonerDetailsWithWatchlist,
    },
    scenarioName: 'john-smith-prisoner-adding-case',
    requiredScenarioState: 'withWatchlist',
  })

const johnSmithPrisonerDetailsDeleteNoWatchlist = () =>
  stubFor({
    name: 'John Smith Details',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY',
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 200,
      jsonBody: prisonerDetails,
    },
    scenarioName: 'john-smith-prisoner-removing-case',
    requiredScenarioState: 'withoutWatchlist',
  })

const johnSmithPrisonerDetailsDeleteWatchlist = () =>
  stubFor({
    name: 'John Smith Details',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY',
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 200,
      jsonBody: prisonerDetailsWithWatchlist,
    },
    scenarioName: 'john-smith-prisoner-removing-case',
    requiredScenarioState: 'Started',
    newScenarioState: 'withoutWatchlist',
  })

const johnSmithPrisonerDetailsWithWatchlist = () =>
  stubFor({
    name: 'John Smith Details',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY',
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 200,
      jsonBody: prisonerDetailsWithWatchlist,
    },
    scenarioName: 'john-smith-prisoner-removing-case-404',
    requiredScenarioState: 'Started',
  })

export const johnSmithPostWatchlist = () => [
  johnSmithPrisonerDetailsNoWatchlist(),
  johnSmithPrisonerDetailsWatchlist(),
  postWatchlist(),
]
export const johnSmithDeleteWatchlist = () => [
  johnSmithPrisonerDetailsDeleteNoWatchlist(),
  johnSmithPrisonerDetailsDeleteWatchlist(),
  deleteWatchlist(),
]
export const johnSmithPostWatchlist404 = () => [postWatchlist404()]
export const johnSmithDeleteWatchlist404 = () => [johnSmithPrisonerDetailsWithWatchlist(), deleteWatchlist404()]
