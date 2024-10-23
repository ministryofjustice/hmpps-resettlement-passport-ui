import express from 'express'

import createError from 'http-errors'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import authorisationMiddleware, { AUTH_ROLES } from './middleware/authorisationMiddleware'
import { metricsMiddleware } from './monitoring/metricsApp'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'
import GotenbergClient from './data/gotenbergClient'
import pdfRenderer from './utils/pdfRenderer'
import routes from './routes'
import type { Services } from './services'
import getFrontendComponents from './middleware/setUpFrontendComponents'
import setUpEnvironmentName from './middleware/setUpEnvironmentName'
import userMetricsAndLoggingMiddleware from './middleware/userMetricsAndLoggingMiddleware'
import config from './config'
import { userContextMiddleware } from './middleware/userContextMiddleware'
import { appInsightsMiddleware } from './utils/azureAppInsights'

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(appInsightsMiddleware())
  app.use(metricsMiddleware)
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  setUpEnvironmentName(app)
  nunjucksSetup(app, services.applicationInfo)
  app.use(setUpAuthentication())
  app.use(authorisationMiddleware(AUTH_ROLES))
  app.use(setUpCsrf())
  app.use(setUpCurrentUser(services))
  app.use(userMetricsAndLoggingMiddleware())
  app.use(userContextMiddleware)

  app.use(getFrontendComponents(services))

  app.use(pdfRenderer(new GotenbergClient(config.apis.gotenberg.apiUrl)))
  app.use(routes(services))

  app.use((_req, _res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
