import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import RpService from '../../services/rpService'
import Config from '../../s3Config'
import { configHelper } from '../configHelperTest'
import { stubPrisonerDetails } from '../testutils/testUtils'

let app: Express
const { rpService } = mockedServices
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  configHelper(config)
  stubPrisonerDetails(rpService)

  app = appWithAllRoutes({})
})
afterEach(() => {
  jest.resetAllMocks()
})

describe('postWatch', () => {
  it('Happy path', async () => {
    const postWatchListSpy = jest.spyOn(rpService, 'postWatchlist').mockImplementation()
    await request(app)
      .post('/addToYourCases?prisonerNumber=A1234DY')
      .expect(302)
      .expect(res => expect(res.headers.location).toEqual('/prisoner-overview/?prisonerNumber=A1234DY'))

    expect(postWatchListSpy).toHaveBeenCalledWith('A1234DY')
  })
  it('Error case - rpService throws error', async () => {
    const postWatchListSpy = jest.spyOn(rpService, 'postWatchlist').mockRejectedValue(new Error('Something went wrong'))
    await request(app)
      .post('/addToYourCases?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(postWatchListSpy).toHaveBeenCalledWith('A1234DY')
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
      .post('/removeFromYourCases?prisonerNumber=A1234DY')
      .expect(302)
      .expect(res => expect(res.headers.location).toEqual('/prisoner-overview/?prisonerNumber=A1234DY'))

    expect(deleteWatchListSpy).toHaveBeenCalledWith('A1234DY')
  })
  it('Error case - rpService throws error', async () => {
    const deleteWatchListSpy = jest
      .spyOn(rpService, 'deleteWatchlist')
      .mockImplementation()
      .mockRejectedValue(new Error('Something went wrong'))
    await request(app)
      .post('/removeFromYourCases?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(deleteWatchListSpy).toHaveBeenCalledWith('A1234DY')
  })
  it('Error case - missing parameter', async () => {
    await request(app)
      .post('/removeFromYourCases')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})
