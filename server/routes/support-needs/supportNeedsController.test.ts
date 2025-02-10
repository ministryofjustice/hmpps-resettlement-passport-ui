import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import { Services } from '../../services'
import FeatureFlags from '../../featureFlag'
import { stubFeatureFlagToTrue, stubPrisonerDetails } from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import Config from '../../s3Config'

let app: Express
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const { supportNeedStateService, rpService } = mockedServices as Services

beforeEach(() => {
  configHelper(config)

  app = appWithAllRoutes({})

  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)
  stubFeatureFlagToTrue(featureFlags, ['supportNeeds'])

  stubPrisonerDetails(rpService)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('SupportNeedsController', () => {
  describe('resetSupportNeedsCache', () => {
    it('should delete the support needs cache and redirect', async () => {
      jest.spyOn(supportNeedStateService, 'deleteSupportNeeds').mockImplementation()

      await request(app)
        .get('/support-needs/accommodation/reset/?prisonerNumber=A1234DY')
        .expect(302)
        .expect('Location', '/support-needs/accommodation/?prisonerNumber=A1234DY')

      expect(supportNeedStateService.deleteSupportNeeds).toHaveBeenCalledWith({
        prisonerNumber: 'A1234DY',
        userId: 'user1',
        pathway: 'accommodation',
      })
    })
  })

  describe('getSupportNeeds', () => {
    it('should render the support needs page', async () => {
      await request(app)
        .get('/support-needs/accommodation')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })
  })

  describe('submitSupportNeeds', () => {
    it('should render the support needs status page on form submission', async () => {
      await request(app)
        .post('/support-needs/accommodation')
        .send({}) // Adjust as needed for form data
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })
  })

  describe('getSupportNeedsStatus', () => {
    it('should render the support needs status page', async () => {
      await request(app)
        .get('/support-needs/accommodation/status')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })
  })

  describe('submitSupportNeedsStatus', () => {
    it('should render the check your answers page on form submission', async () => {
      await request(app)
        .post('/support-needs/accommodation/status')
        .send({})
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })
  })

  describe('finaliseSupportNeeds', () => {
    it('should redirect to pathway page', async () => {
      await request(app)
        .post('/support-needs/accommodation/complete/?prisonerNumber=A1234DY')
        .send({})
        .expect(302)
        .expect('Location', '/accommodation/?prisonerNumber=A1234DY')
    })
  })
})
