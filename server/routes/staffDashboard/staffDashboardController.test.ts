import request from 'supertest'
import type { Express } from 'express'
import Config from '../../s3Config'
import { stubPrisonerDetails, stubPrisonersList } from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import FeatureFlags from '../../featureFlag'

let app: Express
const { rpService } = mockedServices
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>

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
  it('Happy path with filter prisoner number', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    jest
      .spyOn(featureFlags, 'getFeatureFlags')
      .mockResolvedValue([{ feature: 'includePastReleaseDates', enabled: true }])
    await request(app)
      .get('/?releaseTime=84&searchInput=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'ASC',
      'A1234DY',
      '84',
      '',
      '',
      '',
      '',
      true,
    )
  })
  it('Happy path with filter time to release 24W', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    jest
      .spyOn(featureFlags, 'getFeatureFlags')
      .mockResolvedValue([{ feature: 'includePastReleaseDates', enabled: true }])
    await request(app)
      .get('/?releaseTime=168&pathwayView=&assessmentRequired=&searchInput=')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith('MDI', 0, 20, 'releaseDate', 'ASC', '', '168', '', '', '', '', true)
  })
  it('Happy path with filter pathway view ACCOMODATION', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    jest
      .spyOn(featureFlags, 'getFeatureFlags')
      .mockResolvedValue([{ feature: 'includePastReleaseDates', enabled: true }])
    await request(app)
      .get('/?releaseTime=84&pathwayView=ACCOMMODATION&assessmentRequired=&searchInput=')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'ASC',
      '',
      '84',
      'ACCOMMODATION',
      '',
      '',
      '',
      true,
    )
  })
  it('Happy path with filter  watchList true', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    jest
      .spyOn(featureFlags, 'getFeatureFlags')
      .mockResolvedValue([{ feature: 'includePastReleaseDates', enabled: true }])
    await request(app)
      .get('/?releaseTime=84&pathwayView=&pathwayStatus=&searchInput=&watchList=true')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'ASC',
      '',
      '84',
      '',
      '',
      '',
      'true',
      true,
    )
  })

  it('Happy path with filter  assessmentRequired true', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    jest
      .spyOn(featureFlags, 'getFeatureFlags')
      .mockResolvedValue([{ feature: 'includePastReleaseDates', enabled: true }])
    await request(app)
      .get('/?releaseTime=84&pathwayView=&assessmentRequired=true&searchInput=')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'ASC',
      '',
      '84',
      '',
      '',
      'true',
      '',
      true,
    )
  })

  it('Happy path with filter prisoner number not exists', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    jest
      .spyOn(featureFlags, 'getFeatureFlags')
      .mockResolvedValue([{ feature: 'includePastReleaseDates', enabled: true }])
    await request(app)
      .get('/?releaseTime=84&pathwayView=&assessmentRequired=&searchInput=xxxx')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'ASC',
      'xxxx',
      '84',
      '',
      '',
      '',
      '',
      true,
    )
  })

  it('Happy path with sorting by name', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    jest
      .spyOn(featureFlags, 'getFeatureFlags')
      .mockResolvedValue([{ feature: 'includePastReleaseDates', enabled: true }])
    await request(app)
      .get(
        '/?searchInput=&releaseTime=84&pathwayView=&pathwayStatus=&sortField=name&sortDirection=DESC&assessmentRequired=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith('MDI', 0, 20, 'name', 'DESC', '', '84', '', '', '', '', true)
  })

  it('Happy path filter releaseTime missing', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    jest
      .spyOn(featureFlags, 'getFeatureFlags')
      .mockResolvedValue([{ feature: 'includePastReleaseDates', enabled: true }])
    await request(app)
      .get('/?pathwayView=&assessmentRequired=&searchInput=')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith('MDI', 0, 20, 'releaseDate', 'ASC', '', '0', '', '', '', '', true)
  })

  it('Error case - rpService throws error', async () => {
    const getPrisonersListSpy = jest
      .spyOn(rpService, 'getListOfPrisoners')
      .mockRejectedValue(new Error('Something went wrong'))
    jest
      .spyOn(featureFlags, 'getFeatureFlags')
      .mockResolvedValue([{ feature: 'includePastReleaseDates', enabled: true }])
    await request(app)
      .get('/?pathwayView=&assessmentRequired=&searchInput=')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getPrisonersListSpy).toHaveBeenCalledWith('MDI', 0, 20, 'releaseDate', 'ASC', '', '0', '', '', '', '', true)
  })

  it('Happy path with default query params', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    jest
      .spyOn(featureFlags, 'getFeatureFlags')
      .mockResolvedValue([{ feature: 'includePastReleaseDates', enabled: true }])
    await request(app)
      .get('/')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith('MDI', 0, 20, 'releaseDate', 'ASC', '', '0', '', '', '', '', true)
  })
})
