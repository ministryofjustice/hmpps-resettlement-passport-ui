import request from 'supertest'
import type { Express } from 'express'
import RpService from '../../services/rpService'
import Config from '../../s3Config'
import { stubPrisonerDetails } from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes } from '../testutils/appSetup'

let app: Express
let rpService: jest.Mocked<RpService>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>
  jest.mock('applicationinsights', () => jest.fn())
  configHelper(config)

  app = appWithAllRoutes({
    services: {
      rpService,
    },
  })
  stubPrisonerDetails(rpService)
})
afterEach(() => {
  jest.resetAllMocks()
})
describe('getView', () => {
  it('Happy path with default query params', async () => {
    await request(app)
      .get('/')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Happy path with filter prisoner number', async () => {
    await request(app)
      .get('/?releaseTime=84&searchInput=123')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Happy path with filter time to release 24W', async () => {
    await request(app)
      .get('/?releaseTime=168&pathwayView=&assessmentRequired=&searchInput=')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Happy path with filter pathway view ACCOMODATION', async () => {
    await request(app)
      .get('/?releaseTime=84&pathwayView=ACCOMMODATION&assessmentRequired=&searchInput=')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Happy path with filter  watchList true', async () => {
    await request(app)
      .get('/?releaseTime=84&pathwayView=&pathwayStatus=&searchInput=&watchList=true')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Happy path with filter  assessmentRequired true', async () => {
    await request(app)
      .get('/?releaseTime=84&pathwayView=&assessmentRequired=true&searchInput=')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Happy path with filter prisoner number not exists', async () => {
    await request(app)
      .get('/?releaseTime=84&pathwayView=&assessmentRequired=&searchInput=xxxx')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Happy path with sorting by name', async () => {
    await request(app)
      .get(
        '/?searchInput=&releaseTime=84&pathwayView=&pathwayStatus=&sortField=name&sortDirection=DESC&assessmentRequired=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Happy path filter releaseTime missing', async () => {
    await request(app)
      .get('/?pathwayView=&assessmentRequired=&searchInput=')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Happy path all filter missing', async () => {
    await request(app)
      .get('/')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})
