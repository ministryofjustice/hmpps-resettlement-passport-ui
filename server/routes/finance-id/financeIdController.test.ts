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
  stubFetchFinance,
  stubFetchId,
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
import { Services } from '../../services'
import FeatureFlags from '../../featureFlag'

let app: Express
const { rpService } = mockedServices as Services
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
    const getCrsReferralsSpy = stubCrsReferrals(rpService, 'FINANCE_AND_ID')
    const getAssessmentInformationSpy = stubAssessmentInformation(rpService)
    const getCaseNotesHistorySpy = stubCaseNotesHistory(rpService, 'FINANCE_AND_ID')
    const getCaseNotesCreatorsSpy = stubCaseNotesCreators(rpService)
    const getFinanceSpy = stubFetchFinance(rpService)
    const getIdSpy = stubFetchId(rpService)
    const getPathwaySupportNeedsSummarySpy = stubPathwaySupportNeedsSummary(rpService)
    const getPathwaySupportNeedsUpdatesSpy = stubPathwaySupportNeedsUpdates(rpService)

    await request(app)
      .get('/finance-and-id?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      'A1234DY',
      'FINANCE_AND_ID',
      '0',
      '10',
      '0',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getFinanceSpy).toHaveBeenCalledWith('A1234DY')
    expect(getIdSpy).toHaveBeenCalledWith('A1234DY')
    expect(getPathwaySupportNeedsSummarySpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getPathwaySupportNeedsUpdatesSpy).toHaveBeenCalledWith(
      'A1234DY',
      'FINANCE_AND_ID',
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
    const getFinanceSpy = stubRpServiceNoData(rpService, 'fetchFinance')
    const getIdSpy = stubRpServiceNoData(rpService, 'fetchId')
    const getPathwaySupportNeedsSummarySpy = stubPathwaySupportNeedsSummaryNoData(rpService)
    const getPathwaySupportNeedsUpdatesSpy = stubPathwaySupportNeedsUpdatesNoData(rpService)

    await request(app)
      .get('/finance-and-id?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      'A1234DY',
      'FINANCE_AND_ID',
      '0',
      '10',
      '0',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getFinanceSpy).toHaveBeenCalledWith('A1234DY')
    expect(getIdSpy).toHaveBeenCalledWith('A1234DY')
    expect(getPathwaySupportNeedsSummarySpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getPathwaySupportNeedsUpdatesSpy).toHaveBeenCalledWith(
      'A1234DY',
      'FINANCE_AND_ID',
      0,
      10,
      'createdDate,DESC',
      '',
    )
  })

  it('Happy path with specified query params and data from endpoints', async () => {
    const getCrsReferralsSpy = stubCrsReferrals(rpService, 'FINANCE_AND_ID')
    const getAssessmentInformationSpy = stubAssessmentInformation(rpService)
    const getCaseNotesHistorySpy = stubCaseNotesHistory(rpService, 'FINANCE_AND_ID')
    const getCaseNotesCreatorsSpy = stubCaseNotesCreators(rpService)
    const getFinanceSpy = stubFetchFinance(rpService)
    const getIdSpy = stubFetchId(rpService)
    const getPathwaySupportNeedsSummarySpy = stubPathwaySupportNeedsSummaryNoData(rpService)
    const getPathwaySupportNeedsUpdatesSpy = stubPathwaySupportNeedsUpdates(rpService)

    await request(app)
      .get(
        '/finance-and-id?prisonerNumber=A1234DY&page=1&createdByUserId=2&supportNeedUpdateSort=createdDate,ASC&supportNeedsUpdatesPage=1',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      'A1234DY',
      'FINANCE_AND_ID',
      '2',
      '10',
      '1',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getFinanceSpy).toHaveBeenCalledWith('A1234DY')
    expect(getIdSpy).toHaveBeenCalledWith('A1234DY')
    expect(getPathwaySupportNeedsSummarySpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getPathwaySupportNeedsUpdatesSpy).toHaveBeenCalledWith(
      'A1234DY',
      'FINANCE_AND_ID',
      1,
      10,
      'createdDate,ASC',
      '',
    )
  })

  it('"Add a support need" button should be present when readOnlyMode = false', async () => {
    stubCrsReferrals(rpService, 'FINANCE_AND_ID')
    stubAssessmentInformation(rpService)
    stubCaseNotesHistory(rpService, 'FINANCE_AND_ID')
    stubCaseNotesCreators(rpService)
    stubFetchFinance(rpService)
    stubFetchId(rpService)
    stubPathwaySupportNeedsSummaryNoData(rpService)
    stubPathwaySupportNeedsUpdates(rpService)

    await request(app)
      .get('/finance-and-id?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('"Add a support need" button should NOT be present when readOnlyMode = true', async () => {
    stubFeatureFlagToTrue(featureFlags, ['supportNeeds', 'readOnlyMode'])
    stubCrsReferrals(rpService, 'FINANCE_AND_ID')
    stubAssessmentInformation(rpService)
    stubCaseNotesHistory(rpService, 'FINANCE_AND_ID')
    stubCaseNotesCreators(rpService)
    stubFetchFinance(rpService)
    stubFetchId(rpService)
    stubPathwaySupportNeedsSummaryNoData(rpService)
    stubPathwaySupportNeedsUpdates(rpService)

    await request(app)
      .get('/finance-and-id?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Error case - invalid page parameter', async () => {
    await request(app)
      .get('/finance-and-id?prisonerNumber=A1234DY&page=InvalidValue')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - invalid createdByUserId parameter', async () => {
    await request(app)
      .get('/finance-and-id?prisonerNumber=A1234DY&page=1&createdByUserId=%2C9')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - missing prisonerNumber', async () => {
    await request(app)
      .get('/finance-and-id')
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })

  it('Error case - error thrown from rpService', async () => {
    stubRpServiceThrowError(rpService, 'getCrsReferrals')
    await request(app)
      .get('/finance-and-id?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
  })
})

describe('postBankAccountDelete', () => {
  it('Happy path', async () => {
    const deleteFinanceSpy = jest.spyOn(rpService, 'deleteFinance').mockImplementation()
    await request(app)
      .post('/finance-and-id/bank-account-delete')
      .send({
        prisonerNumber: 'A1234DY',
        financeId: '56',
      })
      .expect(302)
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id?prisonerNumber=A1234DY#finance'))
    expect(deleteFinanceSpy).toHaveBeenCalledWith('A1234DY', '56')
  })

  it.each([
    ['Missing prisoner number', { financeId: '56' }],
    ['Missing financeId', { prisonerNumber: 'A1234DY' }],
    ['Path in prisonerNumber', { prisonerNumber: 'A1234DY/potato', financeId: '56' }],
    ['Path in financeId', { prisonerNumber: 'A1234DY', financeId: '56/onion' }],
  ])('bad request error case - %s', async (_, requestBody) => {
    await request(app)
      .post('/finance-and-id/bank-account-delete')
      .send(requestBody)
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('error case - error from API', async () => {
    const deleteFinanceSpy = jest.spyOn(rpService, 'deleteFinance').mockRejectedValue(new Error('Something went wrong'))
    await request(app)
      .post('/finance-and-id/bank-account-delete')
      .send({
        prisonerNumber: 'A1234DY',
        financeId: '56',
      })
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
    expect(deleteFinanceSpy).toHaveBeenCalledWith('A1234DY', '56')
  })
})

describe('postIdDelete', () => {
  it('Happy path', async () => {
    const deleteIdSpy = jest.spyOn(rpService, 'deleteId').mockImplementation()
    await request(app)
      .post('/finance-and-id/id-delete')
      .send({
        prisonerNumber: 'A1234DY',
        idId: '56',
      })
      .expect(302)
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id?prisonerNumber=A1234DY#id'))
    expect(deleteIdSpy).toHaveBeenCalledWith('A1234DY', '56')
  })

  it.each([
    ['Missing prisoner number', { idId: '56' }],
    ['Missing idId', { prisonerNumber: 'A1234DY' }],
    ['Path in prisonerNumber', { prisonerNumber: 'A1234DY/potato', idId: '56' }],
    ['Path in idId', { prisonerNumber: 'A1234DY', idId: '56/onion' }],
  ])('bad request error case - %s', async (_, requestBody) => {
    await request(app)
      .post('/finance-and-id/id-delete')
      .send(requestBody)
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('error case - error from API', async () => {
    const deleteIdSpy = jest.spyOn(rpService, 'deleteId').mockRejectedValue(new Error('Something went wrong'))
    await request(app)
      .post('/finance-and-id/id-delete')
      .send({
        prisonerNumber: 'A1234DY',
        idId: '56',
      })
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
    expect(deleteIdSpy).toHaveBeenCalledWith('A1234DY', '56')
  })
})
