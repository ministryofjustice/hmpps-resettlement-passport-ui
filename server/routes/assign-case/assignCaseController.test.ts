import request from 'supertest'
import type { Express } from 'express'
import RpService from '../../services/rpService'
import Config from '../../s3Config'
import { stubPrisonerDetails, stubPrisonersCasesList } from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes } from '../testutils/appSetup'
import FeatureFlags from '../../featureFlag'

let app: Express
let rpService: jest.Mocked<RpService>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>

  jest.mock('applicationinsights', () => jest.fn())
  configHelper(config)

  app = appWithAllRoutes({
    services: {
      rpService,
    },
  })

  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)

  stubPrisonerDetails(rpService)
})
afterEach(() => {
  jest.resetAllMocks()
})

describe('getView', () => {
  it('Error case - rpService throws error', async () => {
    const getPrisonersListSpy = jest
      .spyOn(rpService, 'getListOfPrisonerCases')
      .mockRejectedValue(new Error('Something went wrong'))
    jest
      .spyOn(featureFlags, 'getFeatureFlags')
      .mockResolvedValue([{ feature: 'includePastReleaseDates', enabled: true }])
    await request(app)
      .get('/assign-a-case')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonersListSpy).toHaveBeenCalledWith('MDI', true)
  })

  it('Happy path with default query params', async () => {
    const getPrisonerListSpy = stubPrisonersCasesList(rpService)
    jest
      .spyOn(featureFlags, 'getFeatureFlags')
      .mockResolvedValue([{ feature: 'includePastReleaseDates', enabled: true }])
    await request(app)
      .get('/assign-a-case')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith('MDI', true)
  })
})
