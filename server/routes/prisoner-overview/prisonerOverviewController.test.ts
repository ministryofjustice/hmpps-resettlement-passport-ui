import type { Express } from 'express'
import request from 'supertest'
import { JSDOM } from 'jsdom'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import Config from '../../s3Config'
import FeatureFlags from '../../featureFlag'
import { configHelper, defaultTestConfig } from '../configHelperTest'
import { expectPrisonerNotFoundPage, stubPrisonerDetails, stubPrisonerOverviewData } from '../testutils/testUtils'
import { PrisonerData } from '../../@types/express'

let app: Express
const { rpService, documentService } = mockedServices
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>

beforeEach(() => {
  configHelper(config)

  app = appWithAllRoutes({})

  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)
  jest.useFakeTimers({ advanceTimers: true }).setSystemTime(new Date('2026-11-01'))

  stubPrisonerDetails(rpService, '2026-11-30', '1991-10-29')
})

afterEach(() => {
  jest.resetAllMocks()
  jest.restoreAllMocks()
  jest.useRealTimers()
})

describe('prisonerOverview', () => {
  it('should not render page if prisonerData does not exist', async () => {
    await request(app)
      .get('/prisoner-overview')
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })

  it('happy path with default query parameters', async () => {
    const getPrisonerOverviewPageDataSpy = stubPrisonerOverviewData(rpService)

    const getDocumentMetaSpy = jest.spyOn(documentService, 'getDocumentMeta').mockResolvedValue([
      {
        id: 1,
        fileName: 'SampleLicenceConditions.docx',
        creationDate: new Date('2024-10-29T12:33:16.78145'),
        category: 'LICENCE_CONDITIONS',
      },
    ])

    await request(app)
      .get('/prisoner-overview?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerOverviewPageDataSpy).toHaveBeenCalledWith(
      'A1234DY',
      '0',
      '10',
      'occurenceDateTime%2CDESC',
      '0',
      'All',
    )
    expect(getDocumentMetaSpy).toHaveBeenCalledWith('A1234DY')
  })

  it('should render the prisoner overview page with correct query params', async () => {
    const queryParams = {
      prisonerNumber: 'A1234DY',
      page: '1',
      size: '5',
      sort: 'occurenceDateTime%2CDESC',
      days: '7',
      selectedPathway: 'Education',
    }
    const getPrisonerOverviewPageDataSpy = stubPrisonerOverviewData(rpService)
    documentService.getDocumentMeta = jest.fn().mockResolvedValue([])
    await request(app)
      .get('/prisoner-overview')
      .query(queryParams)
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerOverviewPageDataSpy).toHaveBeenCalledWith(
      'A1234DY',
      '1',
      '5',
      'occurenceDateTime%2CDESC',
      '7',
      'Education',
    )
  })

  it('should render whats new banner when it is enabled', async () => {
    configHelper(config, {
      ...defaultTestConfig,
      whatsNew: {
        enabled: true,
        version: '20241120',
      },
    })

    stubPrisonerOverviewData(rpService)

    const response = await request(app).get('/prisoner-overview?prisonerNumber=A1234DY').expect(200)

    const { document } = new JSDOM(response.text).window
    const banner = document.getElementById('whats-new-banner')
    expect(banner).toBeTruthy()
    expect(banner.outerHTML).toMatchSnapshot()
  })

  it('should display add to your cases when enabled', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'myCases', enabled: true }])
    stubPrisonerOverviewData(rpService)

    await request(app)
      .get('/prisoner-overview?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not display add to your cases when disabled', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'myCases', enabled: false }])
    stubPrisonerOverviewData(rpService)

    await request(app)
      .get('/prisoner-overview?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should display remove from your cases when enabled and in cases', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'myCases', enabled: true }])
    jest.spyOn(rpService, 'getPrisonerDetails').mockResolvedValue({
      personalDetails: {
        prisonerNumber: 'A1234DY',
        prisonId: 'MDI',
        facialImageId: '456',
        firstName: 'John',
        lastName: 'Smith',
      },
      pathways: [
        {
          pathway: 'ACCOMMODATION',
          status: 'IN_PROGRESS',
        },
        {
          pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
          status: 'IN_PROGRESS',
        },
        {
          pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
          status: 'IN_PROGRESS',
        },
        {
          pathway: 'DRUGS_AND_ALCOHOL',
          status: 'IN_PROGRESS',
        },
        {
          pathway: 'EDUCATION_SKILLS_AND_WORK',
          status: 'IN_PROGRESS',
        },
        {
          pathway: 'FINANCE_AND_ID',
          status: 'IN_PROGRESS',
        },
        {
          pathway: 'HEALTH',
          status: 'IN_PROGRESS',
        },
      ],
      isInWatchlist: true,
    } as PrisonerData)

    stubPrisonerOverviewData(rpService)

    await request(app)
      .get('/prisoner-overview?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})
