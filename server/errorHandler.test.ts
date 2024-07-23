import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './routes/testutils/appSetup'
import Config from './s3Config'
import { configHelper } from './routes/configHelperTest'

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
    return request(app)
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('NotFoundError: Not found')
        expect(res.text).not.toContain('Something went wrong')
      })
  })

  it('should render content without stack in production mode', () => {
    return request(appWithAllRoutes({ production: true }))
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Something went wrong')
        expect(res.text).not.toContain('NotFoundError: Not found')
      })
  })
})
