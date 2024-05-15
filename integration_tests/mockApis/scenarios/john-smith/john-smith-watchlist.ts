import { stubFor } from '../../wiremock'
import { responseHeaders } from '../../headers'

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

export const johnSmithPostWatchlist = () => [postWatchlist()]
export const johnSmithPostWatchlist404 = () => [postWatchlist404()]
