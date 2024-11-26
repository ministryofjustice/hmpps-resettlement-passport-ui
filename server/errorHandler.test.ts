import express, { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, testAppInfo } from './routes/testutils/appSetup'
import Config from './s3Config'
import { configHelper } from './routes/configHelperTest'
import { sanitiseStackTrace } from './routes/testutils/testUtils'
import createErrorHandler from './errorHandler'
import nunjucksSetup from './utils/nunjucksSetup'

let app: Express
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  app = appWithAllRoutes({})
  configHelper(config)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 404', () => {
  it('should render content with stack in dev mode', () => {
    return request(appWithAllRoutes({ production: false }))
      .get('/unknown')
      .expect(404)
      .expect(res => expect(sanitiseStackTrace(res.text)).toMatchSnapshot())
  })

  it('should render content without stack in production mode', () => {
    return request(app)
      .get('/unknown')
      .expect(404)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should render something went wrong page', () => {
    const appWithErrorRoute = express()
    appWithErrorRoute.set('view engine', 'njk')
    appWithErrorRoute
      .use('/error-page', (req, res, next) => {
        next(new Error('Error'))
      })
      .use(createErrorHandler(true))

    nunjucksSetup(appWithErrorRoute, testAppInfo)
    return request(appWithErrorRoute)
      .get('/error-page')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})
