/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
const appInsightsClient = buildAppInsightsClient(applicationInfo)

import HmppsAuthClient from './hmppsAuthClient'
import { createRedisClient } from './redisClient'
import TokenStore from './tokenStore'
import RPClient from './rpClient'
import ComponentClient from './componentClient'

export const dataAccess = () => ({
  applicationInfo,
  appInsightsClient,
  hmppsAuthClient: new HmppsAuthClient(new TokenStore(createRedisClient())),
  rpClient: new RPClient(),
  componentClient: new ComponentClient(),
})

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuthClient, RPClient }
