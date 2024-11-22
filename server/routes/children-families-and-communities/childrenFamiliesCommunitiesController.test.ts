import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import {
  stubAssessmentInformation,
  stubCaseNotesCreators,
  stubCaseNotesHistory,
  stubCrsReferrals,
  stubPrisonerDetails,
  stubRpServiceNoData,
  stubRpServiceThrowError,
} from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import Config from '../../s3Config'

let app: Express
const { rpService } = mockedServices
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  stubPrisonerDetails(rpService)
  configHelper(config)

  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('getView', () => {
  it('Happy path with default query params and data from endpoints', async () => {
    const getCrsReferralsSpy = stubCrsReferrals(rpService, 'CHILDREN_FAMILIES_AND_COMMUNITY')
    const getAssessmentInformationSpy = stubAssessmentInformation(rpService)
    const getCaseNotesHistorySpy = stubCaseNotesHistory(rpService, 'CHILDREN_FAMILIES_AND_COMMUNITY')
    const getCaseNotesCreatorsSpy = stubCaseNotesCreators(rpService)

    await request(app)
      .get('/children-families-and-communities?prisonerNumber=123')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('123', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('123', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      '123',
      'CHILDREN_FAMILIES_AND_COMMUNITY',
      '0',
      '10',
      '0',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('123', 'CHILDREN_FAMILIES_AND_COMMUNITY')
  })

  it('Happy path with default query params and no data from endpoints', async () => {
    const getCrsReferralsSpy = stubRpServiceNoData(rpService, 'getCrsReferrals')
    const getAssessmentInformationSpy = stubRpServiceNoData(rpService, 'getAssessmentInformation')
    const getCaseNotesHistorySpy = stubRpServiceNoData(rpService, 'getCaseNotesHistory')
    const getCaseNotesCreatorsSpy = stubRpServiceNoData(rpService, 'getCaseNotesCreators')

    await request(app)
      .get('/children-families-and-communities?prisonerNumber=123')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('123', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('123', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      '123',
      'CHILDREN_FAMILIES_AND_COMMUNITY',
      '0',
      '10',
      '0',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('123', 'CHILDREN_FAMILIES_AND_COMMUNITY')
  })

  it('Happy path with specified query params and data from endpoints', async () => {
    const getCrsReferralsSpy = stubCrsReferrals(rpService, 'CHILDREN_FAMILIES_AND_COMMUNITY')
    const getAssessmentInformationSpy = stubAssessmentInformation(rpService)
    const getCaseNotesHistorySpy = stubCaseNotesHistory(rpService, 'CHILDREN_FAMILIES_AND_COMMUNITY')
    const getCaseNotesCreatorsSpy = stubCaseNotesCreators(rpService)

    await request(app)
      .get(
        '/children-families-and-communities?prisonerNumber=123&page=1&pageSize=20&sort=occurenceDateTime%2CASC&days=30&createdByUserId=2',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('123', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('123', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      '123',
      'CHILDREN_FAMILIES_AND_COMMUNITY',
      '2',
      '20',
      '1',
      'occurenceDateTime,ASC',
      '30',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('123', 'CHILDREN_FAMILIES_AND_COMMUNITY')
  })

  it('Error case - missing prisonerNumber', async () => {
    await request(app)
      .get('/children-families-and-communities')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Error case - error thrown from rpService', async () => {
    stubRpServiceThrowError(rpService, 'getCrsReferrals')
    await request(app)
      .get('/children-families-and-communities?prisonerNumber=123')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})
