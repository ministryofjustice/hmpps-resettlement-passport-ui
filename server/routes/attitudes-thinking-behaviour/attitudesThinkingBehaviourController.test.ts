import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import {
  expectPrisonerNotFoundPage,
  expectSomethingWentWrongPage,
  stubAssessmentInformation,
  stubCaseNotesCreators,
  stubCaseNotesHistory,
  stubCrsReferrals,
  stubPathwaySupportNeedsSummary,
  stubPathwaySupportNeedsSummaryNoData,
  stubPathwaySupportNeedsUpdates,
  stubPathwaySupportNeedsUpdatesNoData,
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
    const getCrsReferralsSpy = stubCrsReferrals(rpService, 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    const getAssessmentInformationSpy = stubAssessmentInformation(rpService)
    const getCaseNotesHistorySpy = stubCaseNotesHistory(rpService, 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    const getCaseNotesCreatorsSpy = stubCaseNotesCreators(rpService)
    const getPathwaySupportNeedsSummarySpy = stubPathwaySupportNeedsSummary(rpService)
    const getPathwaySupportNeedsUpdatesSpy = stubPathwaySupportNeedsUpdates(rpService)

    await request(app)
      .get('/attitudes-thinking-and-behaviour?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('A1234DY', 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('A1234DY', 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      'A1234DY',
      'ATTITUDES_THINKING_AND_BEHAVIOUR',
      '0',
      '10',
      '0',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('A1234DY', 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    expect(getPathwaySupportNeedsSummarySpy).toHaveBeenCalledWith('A1234DY', 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    expect(getPathwaySupportNeedsUpdatesSpy).toHaveBeenCalledWith(
      'A1234DY',
      'ATTITUDES_THINKING_AND_BEHAVIOUR',
      0,
      1000,
      'createdDate,DESC',
      '',
    )
  })

  it('Happy path with default query params and no data from endpoints', async () => {
    const getCrsReferralsSpy = stubRpServiceNoData(rpService, 'getCrsReferrals')
    const getAssessmentInformationSpy = stubRpServiceNoData(rpService, 'getAssessmentInformation')
    const getCaseNotesHistorySpy = stubRpServiceNoData(rpService, 'getCaseNotesHistory')
    const getCaseNotesCreatorsSpy = stubRpServiceNoData(rpService, 'getCaseNotesCreators')
    const getPathwaySupportNeedsSummarySpy = stubPathwaySupportNeedsSummaryNoData(rpService)
    const getPathwaySupportNeedsUpdatesSpy = stubPathwaySupportNeedsUpdatesNoData(rpService)

    await request(app)
      .get('/attitudes-thinking-and-behaviour?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('A1234DY', 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('A1234DY', 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      'A1234DY',
      'ATTITUDES_THINKING_AND_BEHAVIOUR',
      '0',
      '10',
      '0',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('A1234DY', 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    expect(getPathwaySupportNeedsSummarySpy).toHaveBeenCalledWith('A1234DY', 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    expect(getPathwaySupportNeedsUpdatesSpy).toHaveBeenCalledWith(
      'A1234DY',
      'ATTITUDES_THINKING_AND_BEHAVIOUR',
      0,
      1000,
      'createdDate,DESC',
      '',
    )
  })

  it('Happy path with specified query params and data from endpoints', async () => {
    const getCrsReferralsSpy = stubCrsReferrals(rpService, 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    const getAssessmentInformationSpy = stubAssessmentInformation(rpService)
    const getCaseNotesHistorySpy = stubCaseNotesHistory(rpService, 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    const getCaseNotesCreatorsSpy = stubCaseNotesCreators(rpService)
    const getPathwaySupportNeedsSummarySpy = stubPathwaySupportNeedsSummary(rpService)
    const getPathwaySupportNeedsUpdatesSpy = stubPathwaySupportNeedsUpdates(rpService)

    await request(app)
      .get(
        '/attitudes-thinking-and-behaviour?prisonerNumber=A1234DY&page=1&createdByUserId=2&supportNeedUpdateFilter=1456&supportNeedUpdateSort=createdDate,ASC',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('A1234DY', 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('A1234DY', 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      'A1234DY',
      'ATTITUDES_THINKING_AND_BEHAVIOUR',
      '2',
      '10',
      '1',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('A1234DY', 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    expect(getPathwaySupportNeedsSummarySpy).toHaveBeenCalledWith('A1234DY', 'ATTITUDES_THINKING_AND_BEHAVIOUR')
    expect(getPathwaySupportNeedsUpdatesSpy).toHaveBeenCalledWith(
      'A1234DY',
      'ATTITUDES_THINKING_AND_BEHAVIOUR',
      0,
      1000,
      'createdDate,ASC',
      '1456',
    )
  })

  it('Error case - invalid page parameter', async () => {
    await request(app)
      .get('/attitudes-thinking-and-behaviour?prisonerNumber=A1234DY&page=InvalidValue')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - invalid createdByUserId parameter', async () => {
    await request(app)
      .get('/attitudes-thinking-and-behaviour?prisonerNumber=A1234DY&page=1&createdByUserId=%2C9')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - missing prisonerNumber', async () => {
    await request(app)
      .get('/attitudes-thinking-and-behaviour')
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })

  it('Error case - error thrown from rpService', async () => {
    stubRpServiceThrowError(rpService, 'getCrsReferrals')
    await request(app)
      .get('/attitudes-thinking-and-behaviour?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
  })
})
