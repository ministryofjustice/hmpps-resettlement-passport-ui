import request from 'supertest'
import type { Express } from 'express'
import Config from '../../s3Config'
import { expectSomethingWentWrongPage, stubPrisonerDetails, stubPrisonersCasesList } from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import FeatureFlags from '../../featureFlag'

let app: Express
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>
const { rpService } = mockedServices

beforeEach(() => {
  jest.mock('applicationinsights', () => jest.fn())
  configHelper(config)

  app = appWithAllRoutes({})

  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)

  stubPrisonerDetails(rpService)
})
afterEach(() => {
  jest.resetAllMocks()
})

describe('getView', () => {
  it('Error case - rpService throws error getting prisoner list', async () => {
    rpService.getListOfPrisonerCases.mockRejectedValue(new Error('Something went wrong'))

    await request(app)
      .get('/assign-a-case')
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
    expect(rpService.getListOfPrisonerCases).toHaveBeenCalledWith('MDI', true)
  })

  it('Error case - rpService throws error getting resettlement workers', async () => {
    stubPrisonersCasesList(rpService)
    rpService.getAvailableResettlementWorkers.mockRejectedValue(new Error('Something went wrong'))

    await request(app)
      .get('/assign-a-case')
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
    expect(rpService.getListOfPrisonerCases).toHaveBeenCalledWith('MDI', true)

    expect(rpService.getAvailableResettlementWorkers).toHaveBeenCalledWith('MDI')
  })

  it('Happy path with default query params', async () => {
    const getPrisonerListSpy = stubPrisonersCasesList(rpService)
    rpService.getAvailableResettlementWorkers.mockResolvedValue([
      {
        staffId: 1,
        firstName: 'Staff1First',
        lastName: 'Staff1Last',
      },
      {
        staffId: 2,
        firstName: 'Staff2First',
        lastName: 'Staff2Last',
      },
    ])

    await request(app)
      .get('/assign-a-case')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith('MDI', true)
  })
})
