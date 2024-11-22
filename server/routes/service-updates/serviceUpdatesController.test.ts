import type { Express } from 'express'
import request from 'supertest'
import RpService from '../../services/rpService'
import { appWithAllRoutes } from '../testutils/appSetup'
import Config from '../../s3Config'
import FeatureFlags from '../../featureFlag'
import { configHelper } from '../configHelperTest'

let app: Express
let rpService: jest.Mocked<RpService>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>
  configHelper(config)

  app = appWithAllRoutes({
    services: {
      rpService,
    },
  })

  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('ServiceUpdatesController', () => {
  describe('getView', () => {
    it('should render the service updates page without specific page parameter', async () => {
      await request(app)
        .get('/service-updates')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })

    it('should render the service updates subpage when a page parameter is provided', async () => {
      await request(app)
        .get('/service-updates/inputting-report-answers')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })

    it('should return 404 if the specified template does not exist (error path)', async () => {
      await request(app).get('/service-updates/invalid-page').expect(404)
    })
  })
})
