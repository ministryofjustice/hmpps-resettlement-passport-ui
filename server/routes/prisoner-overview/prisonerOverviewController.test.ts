import type { Express } from 'express'
import request from 'supertest'
import RpService from '../../services/rpService'
import { appWithAllRoutes } from '../testutils/appSetup'
import Config from '../../s3Config'
import FeatureFlags from '../../featureFlag'
import { configHelper } from '../configHelperTest'
import { stubPrisonerDetails, stubPrisonerOverviewData } from '../testutils/testUtils'
import DocumentService from '../../services/documentService'

let app: Express
let rpService: jest.Mocked<RpService>
let documentService: jest.Mocked<DocumentService>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>
  documentService = new DocumentService() as jest.Mocked<DocumentService>
  configHelper(config)

  app = appWithAllRoutes({
    services: {
      rpService,
      documentService,
    },
  })

  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)
  jest.useFakeTimers({ advanceTimers: true }).setSystemTime(new Date('2026-11-01'))

  stubPrisonerDetails(rpService, '2026-11-30', '1991-10-29')
})

afterEach(() => {
  jest.resetAllMocks()
  jest.useRealTimers()
})

describe('prisonerOverview', () => {
  it('should not render page if prisonerData does not exist', async () => {
    await request(app)
      .get('/prisoner-overview')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
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
      .get('/prisoner-overview?prisonerNumber=123')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerOverviewPageDataSpy).toHaveBeenCalledWith(
      '123',
      '0',
      '10',
      'occurenceDateTime%2CDESC',
      '0',
      'All',
    )
    expect(getDocumentMetaSpy).toHaveBeenCalledWith('123')
  })

  it('should render the prisoner overview page with correct query params', async () => {
    const queryParams = {
      page: '1',
      size: '5',
      sort: 'occurenceDateTime%2CDESC',
      days: '7',
      selectedPathway: 'Education',
    }

    const getPrisonerOverviewPageDataSpy = stubPrisonerOverviewData(rpService)

    await request(app)
      .get('/prisoner-overview?prisonerNumber=123')
      .query(queryParams)
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerOverviewPageDataSpy).toHaveBeenCalledWith(
      '123',
      '1',
      '5',
      'occurenceDateTime%2CDESC',
      '7',
      'Education',
    )
  })
})
