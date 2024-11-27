import request from 'supertest'
import type { Express } from 'express'
import Config from '../../s3Config'
import {
  expectSomethingWentWrongPage,
  redirectedToPath,
  stubPrisonerDetails,
  stubPrisonersCasesList,
} from '../testutils/testUtils'
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

describe('post', () => {
  test('successfully assign a single case', async () => {
    await request(app)
      .post('/assign-a-case')
      .send({
        prisonerNumber: 'A8731DY',
        worker: JSON.stringify({ staffId: 123, firstName: 'First', lastName: 'Last' }),
      })
      .expect(302)
      .expect(res => expect(redirectedToPath(res)).toEqual('/assign-a-case'))

    expect(rpService.postCaseAllocations).toHaveBeenCalledWith({
      nomsIds: ['A8731DY'],
      staffId: 123,
      staffFirstName: 'First',
      staffLastName: 'Last',
    })
  })

  test('successfully assign a multiple cases', async () => {
    await request(app)
      .post('/assign-a-case')
      .send({
        prisonerNumber: ['A8731DY', 'G4161UF', 'G5384GE'],
        worker: JSON.stringify({ staffId: 123, firstName: 'First', lastName: 'Last' }),
      })
      .expect(302)
      .expect(res => expect(redirectedToPath(res)).toEqual('/assign-a-case'))

    expect(rpService.postCaseAllocations).toHaveBeenCalledWith({
      nomsIds: ['A8731DY', 'G4161UF', 'G5384GE'],
      staffId: 123,
      staffFirstName: 'First',
      staffLastName: 'Last',
    })
  })
})
