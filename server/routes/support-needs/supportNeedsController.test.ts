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

describe('resetSupportNeedsCache', () => {
  it('should delete the support needs cache and redirect to support needs page', async () => {
    jest.spyOn(supportNeedStateService, 'deleteSupportNeeds').mockImplementation()
    await request(app)
      .get('/support-needs/accommodation/reset/?prisonerNumber=A1234DY')
      .expect(302)
      .expect(res =>
        expect(res.text).toEqual('Found. Redirecting to /support-needs/accommodation/?prisonerNumber=A1234DY'),
      )

    expect(supportNeedStateService.deleteSupportNeeds).toHaveBeenCalledWith({
      prisonerNumber: 'A1234DY',
      userId: 'user1',
      pathway: 'accommodation',
    })
  })
})
