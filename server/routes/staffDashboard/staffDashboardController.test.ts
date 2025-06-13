import request from 'supertest'
import type { Express } from 'express'
import Config from '../../s3Config'
import {
  expectSomethingWentWrongPage,
  stubFeatureFlagToTrue,
  stubPrisonerDetails,
  stubPrisonersList,
  stubNoPrisonersList,
} from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import FeatureFlags from '../../featureFlag'
import { Services } from '../../services'
import { FEATURE_FLAGS } from '../../utils/constants'
import Banner from '../../banner'

let app: Express
const { rpService } = mockedServices as Services
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
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
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
      true,
      '',
      '',
    )
  })
  it('Happy path with filter prisoner name', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
    await request(app)
      .get('/?releaseTime=84&searchInput=john')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'ASC',
      'john',
      '84',
      '',
      '',
      '',
      true,
      '',
      '',
    )
  })
  it('Happy path with filter time to release 24W', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
    await request(app)
      .get('/?releaseTime=168&pathwayView=&lastReportCompleted=&searchInput=')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'ASC',
      '',
      '168',
      '',
      '',
      '',
      true,
      '',
      '',
    )
  })
  it('Happy path with filter pathway view ACCOMODATION', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
    await request(app)
      .get('/?releaseTime=84&pathwayView=ACCOMMODATION&lastReportCompleted=&searchInput=')
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
      true,
      '',
      '',
    )
  })
  it('Happy path with filter watchList true', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
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
      'true',
      true,
      '',
      '',
    )
  })

  it('Happy path with filter lastReportCompleted=BCST2', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
    await request(app)
      .get('/?releaseTime=84&lastReportCompleted=BCST2')
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
      true,
      '',
      'BCST2',
    )
  })

  it('Happy path with filter lastReportCompleted=RESETTLEMENT_PLAN', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
    await request(app)
      .get('/?releaseTime=84&lastReportCompleted=RESETTLEMENT_PLAN')
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
      true,
      '',
      'RESETTLEMENT_PLAN',
    )
  })

  it('Happy path with filter lastReportCompleted=NONE', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
    await request(app)
      .get('/?releaseTime=84&lastReportCompleted=NONE')
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
      true,
      '',
      'NONE',
    )
  })

  it('Happy path with filter prisoner number not exists', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
    await request(app)
      .get('/?releaseTime=84&pathwayView=&lastReportCompleted=&searchInput=xxxx')
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
      true,
      '',
      '',
    )
  })

  it('Happy path with sorting by name and direction DESC', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
    await request(app)
      .get(
        '/?searchInput=&releaseTime=84&pathwayView=&pathwayStatus=&sortField=name&sortDirection=DESC&lastReportCompleted=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith('MDI', 0, 20, 'name', 'DESC', '', '84', '', '', '', true, '', '')
  })

  it('Happy path with sorting by releaseDate and direction ASC', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
    await request(app)
      .get(
        '/?searchInput=&releaseTime=84&pathwayView=&pathwayStatus=&sortField=releaseDate&sortDirection=ASC&lastReportCompleted=',
      )
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
      true,
      '',
      '',
    )
  })

  it('Happy path with sorting by releaseOnTemporaryLicenceDate and direction DESC', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
    await request(app)
      .get(
        '/?searchInput=&releaseTime=84&pathwayView=&pathwayStatus=&sortField=releaseOnTemporaryLicenceDate&sortDirection=DESC&lastReportCompleted=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseOnTemporaryLicenceDate',
      'DESC',
      '',
      '84',
      '',
      '',
      '',
      true,
      '',
      '',
    )
  })

  it('Happy path with sorting by lastUpdatedDate and direction DESC', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
    await request(app)
      .get(
        '/?searchInput=&releaseTime=84&pathwayView=&pathwayStatus=&sortField=lastUpdatedDate&sortDirection=DESC&lastReportCompleted=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'lastUpdatedDate',
      'DESC',
      '',
      '84',
      '',
      '',
      '',
      true,
      '',
      '',
    )
  })

  it('Happy path filter releaseTime missing', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
    await request(app)
      .get('/?pathwayView=&lastReportCompleted=&searchInput=')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'ASC',
      '',
      '0',
      '',
      '',
      '',
      true,
      '',
      '',
    )
  })

  it('Error case - rpService throws error', async () => {
    const getPrisonersListSpy = jest
      .spyOn(rpService, 'getListOfPrisoners')
      .mockRejectedValue(new Error('Something went wrong'))
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates'])
    await request(app)
      .get('/?pathwayView=&lastReportCompleted=&searchInput=')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getPrisonersListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'ASC',
      '',
      '0',
      '',
      '',
      '',
      true,
      '',
      '',
    )
  })

  it('Happy path with default query params without tabs nav', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates', 'supportNeeds'])
    await request(app)
      .get('/')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'ASC',
      '',
      '0',
      '',
      '',
      '',
      true,
      '',
      '',
    )
  })

  it('Happy path with default query params with tabs nav', async () => {
    const getPrisonerListSpy = stubNoPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates', 'assignCaseTab'])
    await request(app)
      .get('/')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'ASC',
      '',
      '0',
      '',
      '',
      '',
      true,
      '',
      '',
    )
  })

  it('Happy path with default query params with supportNeeds enabled, no filters', async () => {
    const getPrisonerListSpy = stubPrisonersList(rpService)
    stubFeatureFlagToTrue(featureFlags, ['includePastReleaseDates', 'supportNeeds'])
    await request(app)
      .get('/')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'ASC',
      '',
      '0',
      '',
      '',
      '',
      true,
      '',
      '',
    )
  })

  it('Error case - No feature flags in file', async () => {
    stubPrisonersList(rpService)
    jest.spyOn(featureFlags, 'getFeatureFlag').mockImplementation((flag: string) => {
      // if (flag === 'whatsNewBanner') return true
      throw new Error(`Feature "${flag}" does not exist.`)
    })

    await request(app)
      .get('/')
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - invalid page parameter', async () => {
    await request(app)
      .get('/?page=InvalidValue')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - invalid releaseTime parameter', async () => {
    await request(app)
      .get('/?releaseTime=%2C9')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - invalid sortField parameter', async () => {
    await request(app)
      .get('/?sortField=invalidValue')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - invalid sortDirection parameter', async () => {
    await request(app)
      .get('/?sortDirection=4')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - invalid lastReportCompleted parameter', async () => {
    await request(app)
      .get('/?lastReportCompleted=invalidValue')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  describe('when read only mode is enabled', () => {
    it('the assign a case and staff capacity tabs should not be shown', async () => {
      stubPrisonersList(rpService)
      stubFeatureFlagToTrue(featureFlags, [
        FEATURE_FLAGS.INCLUDE_PAST_RELEASE_DATES,
        FEATURE_FLAGS.ASSIGN_CASE_TAB,
        FEATURE_FLAGS.READ_ONLY_MODE,
      ])
      await request(app)
        .get('/')
        .expect(200)
        .expect(res => {
          const htmlContent = res.text
          expect(htmlContent).not.toContain('Assign a case')
          expect(htmlContent).not.toContain('Staff capacity')
        })
    })
  })

  describe('when read only mode is not enabled', () => {
    it('the assign a case and staff capacity tabs should be shown', async () => {
      stubPrisonersList(rpService)
      stubFeatureFlagToTrue(featureFlags, [FEATURE_FLAGS.INCLUDE_PAST_RELEASE_DATES, FEATURE_FLAGS.ASSIGN_CASE_TAB])
      await request(app)
        .get('/')
        .expect(200)
        .expect(res => {
          const htmlContent = res.text
          expect(htmlContent).toContain('Assign a case')
          expect(htmlContent).toContain('Staff capacity')
        })
    })
  })

  describe('when the latest service update includes an alert', () => {
    it('should render the moj alert component', async () => {
      stubPrisonersList(rpService)
      stubFeatureFlagToTrue(featureFlags, [FEATURE_FLAGS.INCLUDE_PAST_RELEASE_DATES, FEATURE_FLAGS.ASSIGN_CASE_TAB])

      const banner = {
        date: 'date',
        bodyText: ['bodyText'],
        alert: {
          title: 'this is an alert',
        },
      }
      const getWhatsNewBannerVersion = jest.spyOn(Banner, 'getWhatsNewBannerVersion')
      getWhatsNewBannerVersion.mockReturnValue(banner)

      await request(app)
        .get('/')
        .expect(200)
        .expect(res => {
          const htmlContent = res.text
          expect(htmlContent).toContain('moj-alert')
          expect(htmlContent).toContain(banner.alert.title)
          expect(htmlContent).toMatchSnapshot()
        })
    })
  })

  describe('when the latest service update does not include an alert', () => {
    it('should not render the moj alert component', async () => {
      stubPrisonersList(rpService)
      stubFeatureFlagToTrue(featureFlags, [FEATURE_FLAGS.INCLUDE_PAST_RELEASE_DATES, FEATURE_FLAGS.ASSIGN_CASE_TAB])

      const banner = {
        date: 'date',
        bodyText: ['bodyText'],
      }
      const getWhatsNewBannerVersion = jest.spyOn(Banner, 'getWhatsNewBannerVersion')
      getWhatsNewBannerVersion.mockReturnValue(banner)

      await request(app)
        .get('/')
        .expect(200)
        .expect(res => {
          const htmlContent = res.text
          expect(htmlContent).not.toContain('moj-alert')
          expect(htmlContent).toMatchSnapshot()
        })
    })
  })
})
