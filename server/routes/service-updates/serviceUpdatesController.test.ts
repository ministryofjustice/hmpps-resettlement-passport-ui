import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../testutils/appSetup'
import Config from '../../s3Config'
import FeatureFlags from '../../featureFlag'
import { configHelper } from '../configHelperTest'
import { ConfigFile } from '../../@types/express'

let app: Express
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>

beforeEach(() => {
  app = appWithAllRoutes({})
  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('ServiceUpdatesController', () => {
  describe('getView', () => {
    function getConfigWithWhatsNewVersion(version: string): ConfigFile {
      return {
        reports: {
          immediateNeedsVersion: {
            ACCOMMODATION: 2,
            ATTITUDES_THINKING_AND_BEHAVIOUR: 1,
            CHILDREN_FAMILIES_AND_COMMUNITY: 1,
            DRUGS_AND_ALCOHOL: 1,
            EDUCATION_SKILLS_AND_WORK: 1,
            FINANCE_AND_ID: 1,
            HEALTH: 1,
          },
          preReleaseVersion: {
            ACCOMMODATION: 2,
            ATTITUDES_THINKING_AND_BEHAVIOUR: 1,
            CHILDREN_FAMILIES_AND_COMMUNITY: 1,
            DRUGS_AND_ALCOHOL: 1,
            EDUCATION_SKILLS_AND_WORK: 1,
            FINANCE_AND_ID: 1,
            HEALTH: 1,
          },
        },
        whatsNew: {
          enabled: true,
          version,
        },
      }
    }

    it('should render the service updates page without specific page parameter - future version number (i.e. show everything)', async () => {
      configHelper(config, getConfigWithWhatsNewVersion('99991231'))
      await request(app)
        .get('/service-updates')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })

    it('should render the service updates page without specific page parameter - specific version number', async () => {
      configHelper(config, getConfigWithWhatsNewVersion('20241120'))
      await request(app)
        .get('/service-updates')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })

    it('should render the service updates page without specific page parameter - past version number', async () => {
      configHelper(config, getConfigWithWhatsNewVersion('20240101'))
      await request(app)
        .get('/service-updates')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })

    it('should render the service update for inputting report answers', async () => {
      configHelper(config)
      await request(app)
        .get('/service-updates/inputting-report-answers')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })

    it('should render the service update for assign a case', async () => {
      configHelper(config)
      await request(app)
        .get('/service-updates/assign-a-case')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })

    it('should render the service update for support needs', async () => {
      configHelper(config)
      await request(app)
        .get('/service-updates/support-needs')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })

    it('should return 500 if the specified template does not exist (error path)', async () => {
      configHelper(config)
      await request(app).get('/service-updates/invalid-page').expect(500)
    })
  })
})
