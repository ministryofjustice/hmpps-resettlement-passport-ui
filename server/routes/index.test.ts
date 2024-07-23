import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import { configHelper } from './configHelperTest'
import Config from '../s3Config'

let app: Express
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  app = appWithAllRoutes({})
  configHelper(config)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('All pathways overview')
      })
  })
})
