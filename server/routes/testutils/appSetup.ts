import express, { Express } from 'express'
import cookieSession from 'cookie-session'
import createError from 'http-errors'

import cookieParser from 'cookie-parser'
import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import * as auth from '../../authentication/auth'
import { Services, UserService } from '../../services'
import type { ApplicationInfo } from '../../applicationInfo'
import RpService from '../../services/rpService'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import ComponentService from '../../services/componentService'
import DocumentService from '../../services/documentService'
import { AssessmentStateService } from '../../data/assessmentStateService'
import { AppInsightsService } from '../../utils/analytics'

const testAppInfo: ApplicationInfo = {
  applicationName: 'test',
  buildNumber: '1',
  gitRef: 'long ref',
  gitShortHash: 'short ref',
}

export const user = {
  firstName: 'first',
  lastName: 'last',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'First Last',
  activeCaseLoadId: 'MDI',
  authSource: 'nomis',
}

export const flashProvider = jest.fn()

function appSetup(services: Services, production: boolean, userSupplier: () => Express.User): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, testAppInfo)
  app.use(cookieParser())
  app.use(cookieSession({ keys: [''] }))
  app.use((req, res, next) => {
    req.user = userSupplier()
    req.flash = flashProvider
    res.locals = { userActiveCaseLoad: { caseLoadId: 'MDI' }, isPrisonUser: true }
    res.locals.user = { ...req.user }
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use((req, _, next) => {
    req.sessionID = 'sessionId'
    next()
  })
  app.use(routes(services))
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = true,
  services = mockedServices,
  userSupplier = () => user,
}: {
  production?: boolean
  services?: Services
  userSupplier?: () => Express.User
}): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  return appSetup(services, production, userSupplier)
}

const rpService = jest.mocked(new RpService())
export const mockedServices: Services = {
  rpService,
  prisonerDetailsService: jest.mocked(new PrisonerDetailsService(rpService)),
  appInsightsService: jest.mocked(new AppInsightsService(null)),
  userService: jest.mocked(new UserService()),
  applicationInfo: testAppInfo,
  componentService: jest.mocked(new ComponentService(null)),
  documentService: jest.mocked(new DocumentService()),
  assessmentStateService: jest.mocked(new AssessmentStateService(null)),
}
