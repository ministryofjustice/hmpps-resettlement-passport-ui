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
  stubFeatureFlagToTrue,
  stubFeatureFlagToFalse,
} from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import Config from '../../s3Config'
import FeatureFlags from '../../featureFlag'

let app: Express
const { rpService } = mockedServices
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>

beforeEach(() => {
  stubPrisonerDetails(rpService)
  configHelper(config)

  app = appWithAllRoutes({})

  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)
  stubFeatureFlagToFalse(featureFlags)
  stubFeatureFlagToTrue(featureFlags, ['supportNeeds', 'whatsNewBanner'])
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
    const getPathwaySupportNeedsSummarySpy = stubPathwaySupportNeedsSummary(rpService)
    const getPathwaySupportNeedsUpdatesSpy = stubPathwaySupportNeedsUpdates(rpService)

    await request(app)
      .get('/children-families-and-communities?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('A1234DY', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('A1234DY', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      'A1234DY',
      'CHILDREN_FAMILIES_AND_COMMUNITY',
      '0',
      '10',
      '0',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('A1234DY', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getPathwaySupportNeedsSummarySpy).toHaveBeenCalledWith('A1234DY', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getPathwaySupportNeedsUpdatesSpy).toHaveBeenCalledWith(
      'A1234DY',
      'CHILDREN_FAMILIES_AND_COMMUNITY',
      0,
      10,
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
      .get('/children-families-and-communities?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('A1234DY', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('A1234DY', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      'A1234DY',
      'CHILDREN_FAMILIES_AND_COMMUNITY',
      '0',
      '10',
      '0',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('A1234DY', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getPathwaySupportNeedsSummarySpy).toHaveBeenCalledWith('A1234DY', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getPathwaySupportNeedsUpdatesSpy).toHaveBeenCalledWith(
      'A1234DY',
      'CHILDREN_FAMILIES_AND_COMMUNITY',
      0,
      10,
      'createdDate,DESC',
      '',
    )
  })

  it('Happy path with specified query params and data from endpoints', async () => {
    const getCrsReferralsSpy = stubCrsReferrals(rpService, 'CHILDREN_FAMILIES_AND_COMMUNITY')
    const getAssessmentInformationSpy = stubAssessmentInformation(rpService)
    const getCaseNotesHistorySpy = stubCaseNotesHistory(rpService, 'CHILDREN_FAMILIES_AND_COMMUNITY')
    const getCaseNotesCreatorsSpy = stubCaseNotesCreators(rpService)
    const getPathwaySupportNeedsSummarySpy = stubPathwaySupportNeedsSummary(rpService)
    const getPathwaySupportNeedsUpdatesSpy = stubPathwaySupportNeedsUpdates(rpService)

    await request(app)
      .get(
        '/children-families-and-communities?prisonerNumber=A1234DY&page=1&createdByUserId=2&supportNeedUpdateSort=createdDate,ASC&supportNeedsUpdatesPage=1',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('A1234DY', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('A1234DY', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      'A1234DY',
      'CHILDREN_FAMILIES_AND_COMMUNITY',
      '2',
      '10',
      '1',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('A1234DY', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getPathwaySupportNeedsSummarySpy).toHaveBeenCalledWith('A1234DY', 'CHILDREN_FAMILIES_AND_COMMUNITY')
    expect(getPathwaySupportNeedsUpdatesSpy).toHaveBeenCalledWith(
      'A1234DY',
      'CHILDREN_FAMILIES_AND_COMMUNITY',
      1,
      10,
      'createdDate,ASC',
      '',
    )
  })

  it('"Add a support need" button should be present when readOnlyMode = false', async () => {
    stubCrsReferrals(rpService, 'CHILDREN_FAMILIES_AND_COMMUNITY')
    stubAssessmentInformation(rpService)
    stubCaseNotesHistory(rpService, 'CHILDREN_FAMILIES_AND_COMMUNITY')
    stubCaseNotesCreators(rpService)
    stubPathwaySupportNeedsSummary(rpService)
    stubPathwaySupportNeedsUpdates(rpService)

    await request(app)
      .get('/children-families-and-communities?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('"Add a support need" button should NOT be present when readOnlyMode = true', async () => {
    stubFeatureFlagToTrue(featureFlags, ['supportNeeds', 'readOnlyMode'])
    stubCrsReferrals(rpService, 'CHILDREN_FAMILIES_AND_COMMUNITY')
    stubAssessmentInformation(rpService)
    stubCaseNotesHistory(rpService, 'CHILDREN_FAMILIES_AND_COMMUNITY')
    stubCaseNotesCreators(rpService)
    stubPathwaySupportNeedsSummary(rpService)
    stubPathwaySupportNeedsUpdates(rpService)

    await request(app)
      .get('/children-families-and-communities?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Error case - invalid page parameter', async () => {
    await request(app)
      .get('/children-families-and-communities?prisonerNumber=A1234DY&page=InvalidValue')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - invalid createdByUserId parameter', async () => {
    await request(app)
      .get('/children-families-and-communities?prisonerNumber=A1234DY&page=1&createdByUserId=%2C9')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - missing prisonerNumber', async () => {
    await request(app)
      .get('/children-families-and-communities')
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })

  it('Error case - error thrown from rpService', async () => {
    stubRpServiceThrowError(rpService, 'getCrsReferrals')
    await request(app)
      .get('/children-families-and-communities?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})
