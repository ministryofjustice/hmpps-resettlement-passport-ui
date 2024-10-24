import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './routes/testutils/appSetup'
import Config from './s3Config'
import { configHelper } from './routes/configHelperTest'
import { sanitiseStackTrace } from './routes/testutils/testUtils'

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
})
