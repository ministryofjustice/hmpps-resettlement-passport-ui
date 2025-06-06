import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import {
  expectPrisonerNotFoundPage,
  stubFeatureFlagToFalse,
  stubFeatureFlagToTrue,
  stubPrisonerDetails,
  stubRpServiceThrowError,
} from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import Config from '../../s3Config'
import FeatureFlags from '../../featureFlag'

let app: Express
const { rpService } = mockedServices
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>

beforeEach(() => {
  stubPrisonerDetails(rpService)
  configHelper(config)

  app = appWithAllRoutes({})

  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)
  stubFeatureFlagToFalse(featureFlags)
  stubFeatureFlagToTrue(featureFlags, ['whatsNewBanner'])
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('getView', () => {
  it('Happy path with default query params and data from endpoints', async () => {
    // const getPrisonerDetails = stubRpServiceData(rpService, 'getPrisonerDetails')
    await request(app)
      .get('/add-case-note?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Error case - missing prisonerNumber', async () => {
    await request(app)
      .get('/add-case-note')
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })

  it('Error case - error thrown from rpService', async () => {
    stubRpServiceThrowError(rpService, 'getPrisonerDetails')
    await request(app)
      .get('/add-case-note?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('support needs flag is set to true - redirects to overview page', async () => {
    stubFeatureFlagToTrue(featureFlags, ['supportNeeds'])

    await request(app)
      .get('/add-case-note?prisonerNumber=A1234DY')
      .expect(302)
      .expect('Location', 'prisoner-overview/?prisonerNumber=A1234DY#case-notes')
  })
})
