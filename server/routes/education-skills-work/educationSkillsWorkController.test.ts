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
  stubEducationSkillsWork,
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
    const getCrsReferralsSpy = stubCrsReferrals(rpService, 'EDUCATION_SKILLS_AND_WORK')
    const getAssessmentInformationSpy = stubAssessmentInformation(rpService)
    const getCaseNotesHistorySpy = stubCaseNotesHistory(rpService, 'EDUCATION_SKILLS_AND_WORK')
    const getCaseNotesCreatorsSpy = stubCaseNotesCreators(rpService)
    const getEducationSkillsWorkSpy = stubEducationSkillsWork(rpService)
    const getPathwaySupportNeedsSummarySpy = stubPathwaySupportNeedsSummary(rpService)
    const getPathwaySupportNeedsUpdatesSpy = stubPathwaySupportNeedsUpdates(rpService)

    await request(app)
      .get('/education-skills-and-work?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('A1234DY', 'EDUCATION_SKILLS_AND_WORK')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('A1234DY', 'EDUCATION_SKILLS_AND_WORK')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      'A1234DY',
      'EDUCATION_SKILLS_AND_WORK',
      '0',
      '10',
      '0',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('A1234DY', 'EDUCATION_SKILLS_AND_WORK')
    expect(getEducationSkillsWorkSpy).toHaveBeenLastCalledWith('A1234DY')
    expect(getPathwaySupportNeedsSummarySpy).toHaveBeenCalledWith('A1234DY', 'EDUCATION_SKILLS_AND_WORK')
    expect(getPathwaySupportNeedsUpdatesSpy).toHaveBeenCalledWith(
      'A1234DY',
      'EDUCATION_SKILLS_AND_WORK',
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
    const getEducationSkillsWorkSpy = stubRpServiceNoData(rpService, 'getEducationSkillsWork')
    const getPathwaySupportNeedsSummarySpy = stubPathwaySupportNeedsSummaryNoData(rpService)
    const getPathwaySupportNeedsUpdatesSpy = stubPathwaySupportNeedsUpdatesNoData(rpService)

    await request(app)
      .get('/education-skills-and-work?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('A1234DY', 'EDUCATION_SKILLS_AND_WORK')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('A1234DY', 'EDUCATION_SKILLS_AND_WORK')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      'A1234DY',
      'EDUCATION_SKILLS_AND_WORK',
      '0',
      '10',
      '0',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('A1234DY', 'EDUCATION_SKILLS_AND_WORK')
    expect(getEducationSkillsWorkSpy).toHaveBeenLastCalledWith('A1234DY')
    expect(getPathwaySupportNeedsSummarySpy).toHaveBeenCalledWith('A1234DY', 'EDUCATION_SKILLS_AND_WORK')
    expect(getPathwaySupportNeedsUpdatesSpy).toHaveBeenCalledWith(
      'A1234DY',
      'EDUCATION_SKILLS_AND_WORK',
      0,
      10,
      'createdDate,DESC',
      '',
    )
  })

  it('Happy path with specified query params and data from endpoints', async () => {
    const getCrsReferralsSpy = stubCrsReferrals(rpService, 'EDUCATION_SKILLS_AND_WORK')
    const getAssessmentInformationSpy = stubAssessmentInformation(rpService)
    const getCaseNotesHistorySpy = stubCaseNotesHistory(rpService, 'EDUCATION_SKILLS_AND_WORK')
    const getCaseNotesCreatorsSpy = stubCaseNotesCreators(rpService)
    const getEducationSkillsWorkSpy = stubEducationSkillsWork(rpService)
    const getPathwaySupportNeedsSummarySpy = stubPathwaySupportNeedsSummary(rpService)
    const getPathwaySupportNeedsUpdatesSpy = stubPathwaySupportNeedsUpdates(rpService)

    await request(app)
      .get(
        '/education-skills-and-work?prisonerNumber=A1234DY&page=1&createdByUserId=2&supportNeedUpdateSort=createdDate,ASC&supportNeedsUpdatesPage=1',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('A1234DY', 'EDUCATION_SKILLS_AND_WORK')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('A1234DY', 'EDUCATION_SKILLS_AND_WORK')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      'A1234DY',
      'EDUCATION_SKILLS_AND_WORK',
      '2',
      '10',
      '1',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('A1234DY', 'EDUCATION_SKILLS_AND_WORK')
    expect(getEducationSkillsWorkSpy).toHaveBeenLastCalledWith('A1234DY')
    expect(getPathwaySupportNeedsSummarySpy).toHaveBeenCalledWith('A1234DY', 'EDUCATION_SKILLS_AND_WORK')
    expect(getPathwaySupportNeedsUpdatesSpy).toHaveBeenCalledWith(
      'A1234DY',
      'EDUCATION_SKILLS_AND_WORK',
      1,
      10,
      'createdDate,ASC',
      '',
    )
  })

  it('"Add a support need" button should be present when readOnlyMode = false', async () => {
    const getCrsReferralsSpy = stubCrsReferrals(rpService, 'EDUCATION_SKILLS_AND_WORK')
    const getAssessmentInformationSpy = stubAssessmentInformation(rpService)
    const getCaseNotesHistorySpy = stubCaseNotesHistory(rpService, 'EDUCATION_SKILLS_AND_WORK')
    const getCaseNotesCreatorsSpy = stubCaseNotesCreators(rpService)
    const getEducationSkillsWorkSpy = stubEducationSkillsWork(rpService)
    const getPathwaySupportNeedsSummarySpy = stubPathwaySupportNeedsSummary(rpService)
    const getPathwaySupportNeedsUpdatesSpy = stubPathwaySupportNeedsUpdates(rpService)

    await request(app)
      .get('/education-skills-and-work?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('"Add a support need" button should NOT be present when readOnlyMode = true', async () => {
    stubFeatureFlagToTrue(featureFlags, ['supportNeeds', 'readOnlyMode'])
    const getCrsReferralsSpy = stubCrsReferrals(rpService, 'EDUCATION_SKILLS_AND_WORK')
    const getAssessmentInformationSpy = stubAssessmentInformation(rpService)
    const getCaseNotesHistorySpy = stubCaseNotesHistory(rpService, 'EDUCATION_SKILLS_AND_WORK')
    const getCaseNotesCreatorsSpy = stubCaseNotesCreators(rpService)
    const getEducationSkillsWorkSpy = stubEducationSkillsWork(rpService)
    const getPathwaySupportNeedsSummarySpy = stubPathwaySupportNeedsSummary(rpService)
    const getPathwaySupportNeedsUpdatesSpy = stubPathwaySupportNeedsUpdates(rpService)

    await request(app)
      .get('/education-skills-and-work?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Error case - invalid page parameter', async () => {
    await request(app)
      .get('/education-skills-and-work?prisonerNumber=A1234DY&page=InvalidValue')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - invalid createdByUserId parameter', async () => {
    await request(app)
      .get('/education-skills-and-work?prisonerNumber=A1234DY&page=1&createdByUserId=%2C9')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - missing prisonerNumber', async () => {
    await request(app)
      .get('/education-skills-and-work')
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })

  it('Error case - error thrown from rpService', async () => {
    stubRpServiceThrowError(rpService, 'getCrsReferrals')
    await request(app)
      .get('/education-skills-and-work?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
  })
})
