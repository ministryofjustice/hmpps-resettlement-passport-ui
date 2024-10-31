import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../testutils/appSetup'
import RpService from '../../services/rpService'
import Config from '../../s3Config'
import { configHelper } from '../configHelperTest'
import { stubPrisonerDetails } from '../testutils/testUtils'

let app: Express
let rpService: jest.Mocked<RpService>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>
  configHelper(config)
  stubPrisonerDetails(rpService)

  app = appWithAllRoutes({
    services: {
      rpService,
    },
  })
})
afterEach(() => {
  jest.resetAllMocks()
})

describe('postWatch', () => {
  it('Happy path', async () => {
    const postWatchListSpy = jest.spyOn(rpService, 'postWatchlist').mockImplementation()
    await request(app)
      .post('/addToYourCases?prisonerNumber=123')
      .expect(302)
      .expect(res => expect(res.headers.location).toEqual('/prisoner-overview/?prisonerNumber=123'))

    expect(postWatchListSpy).toHaveBeenCalledWith('123')
  })
  it('Error case - rpService throws error', async () => {
    const postWatchListSpy = jest.spyOn(rpService, 'postWatchlist').mockRejectedValue(new Error('Something went wrong'))
    await request(app)
      .post('/addToYourCases?prisonerNumber=123')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(postWatchListSpy).toHaveBeenCalledWith('123')
  })
  it('Error case - missing parameter', async () => {
    await request(app)
      .post('/addToYourCases')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})

describe('deleteWatch', () => {
  it('Happy path', async () => {
    const deleteWatchListSpy = jest.spyOn(rpService, 'deleteWatchlist').mockImplementation()
    await request(app)
      .post('/removeFromYourCases?prisonerNumber=123')
      .expect(302)
      .expect(res => expect(res.headers.location).toEqual('/prisoner-overview/?prisonerNumber=123'))

    expect(deleteWatchListSpy).toHaveBeenCalledWith('123')
  })
  it('Error case - rpService throws error', async () => {
    const deleteWatchListSpy = jest
      .spyOn(rpService, 'deleteWatchlist')
      .mockImplementation()
      .mockRejectedValue(new Error('Something went wrong'))
    await request(app)
      .post('/removeFromYourCases?prisonerNumber=123')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(deleteWatchListSpy).toHaveBeenCalledWith('123')
  })
  it('Error case - missing parameter', async () => {
    await request(app)
      .post('/removeFromYourCases')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})
