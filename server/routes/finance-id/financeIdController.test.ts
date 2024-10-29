import type { Express } from 'express'
import request from 'supertest'
import RpService from '../../services/rpService'
import { appWithAllRoutes } from '../testutils/appSetup'
import {
  stubAssessmentInformation,
  stubCaseNotesCreators,
  stubCaseNotesHistory,
  stubCrsReferrals,
  stubFetchFinance,
  stubFetchId,
  stubPrisonerDetails,
  stubRpServiceNoData,
  stubRpServiceThrowError,
} from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import Config from '../../s3Config'

let app: Express
let rpService: jest.Mocked<RpService>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>
  stubPrisonerDetails(rpService)
  configHelper(config)

  app = appWithAllRoutes({
    services: {
      rpService,
    },
  })
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

    await request(app)
      .get('/finance-and-id?prisonerNumber=123')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('123', 'FINANCE_AND_ID')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('123', 'FINANCE_AND_ID')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      '123',
      'FINANCE_AND_ID',
      '0',
      '10',
      '0',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('123', 'FINANCE_AND_ID')
    expect(getFinanceSpy).toHaveBeenCalledWith('123')
    expect(getIdSpy).toHaveBeenCalledWith('123')
  })

  it('Happy path with default query params and no data from endpoints', async () => {
    const getCrsReferralsSpy = stubRpServiceNoData(rpService, 'getCrsReferrals')
    const getAssessmentInformationSpy = stubRpServiceNoData(rpService, 'getAssessmentInformation')
    const getCaseNotesHistorySpy = stubRpServiceNoData(rpService, 'getCaseNotesHistory')
    const getCaseNotesCreatorsSpy = stubRpServiceNoData(rpService, 'getCaseNotesCreators')
    const getFinanceSpy = stubRpServiceNoData(rpService, 'fetchFinance')
    const getIdSpy = stubRpServiceNoData(rpService, 'fetchId')

    await request(app)
      .get('/finance-and-id?prisonerNumber=123')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('123', 'FINANCE_AND_ID')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('123', 'FINANCE_AND_ID')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      '123',
      'FINANCE_AND_ID',
      '0',
      '10',
      '0',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('123', 'FINANCE_AND_ID')
    expect(getFinanceSpy).toHaveBeenCalledWith('123')
    expect(getIdSpy).toHaveBeenCalledWith('123')
  })

  it('Happy path with specified query params and data from endpoints', async () => {
    const getCrsReferralsSpy = stubCrsReferrals(rpService, 'FINANCE_AND_ID')
    const getAssessmentInformationSpy = stubAssessmentInformation(rpService)
    const getCaseNotesHistorySpy = stubCaseNotesHistory(rpService, 'FINANCE_AND_ID')
    const getCaseNotesCreatorsSpy = stubCaseNotesCreators(rpService)
    const getFinanceSpy = stubFetchFinance(rpService)
    const getIdSpy = stubFetchId(rpService)

    await request(app)
      .get(
        '/finance-and-id?prisonerNumber=123&page=1&pageSize=20&sort=occurenceDateTime%2CASC&days=30&createdByUserId=2',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('123', 'FINANCE_AND_ID')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('123', 'FINANCE_AND_ID')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      '123',
      'FINANCE_AND_ID',
      '2',
      '20',
      '1',
      'occurenceDateTime,ASC',
      '30',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('123', 'FINANCE_AND_ID')
    expect(getFinanceSpy).toHaveBeenCalledWith('123')
    expect(getIdSpy).toHaveBeenCalledWith('123')
  })

  it('Error case - missing prisonerNumber', async () => {
    await request(app)
      .get('/finance-and-id')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Error case - error thrown from rpService', async () => {
    stubRpServiceThrowError(rpService, 'getCrsReferrals')
    await request(app)
      .get('/finance-and-id?prisonerNumber=123')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})

describe('postBankAccountDelete', () => {
  it('Happy path', async () => {
    const deleteFinanceSpy = jest.spyOn(rpService, 'deleteFinance').mockImplementation()
    await request(app)
      .post('/finance-and-id/bank-account-delete')
      .send({
        prisonerNumber: '123',
        financeId: '56',
      })
      .expect(302)
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id?prisonerNumber=123#finance'))
    expect(deleteFinanceSpy).toHaveBeenCalledWith('123', '56')
  })

  it('error case - missing prisonerNumber', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-delete')
      .send({
        financeId: '56',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('error case - missing financeId', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-delete')
      .send({
        prisonerNumber: '123',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('error case - error from API', async () => {
    const deleteFinanceSpy = jest.spyOn(rpService, 'deleteFinance').mockRejectedValue(new Error('Something went wrong'))
    await request(app)
      .post('/finance-and-id/bank-account-delete')
      .send({
        prisonerNumber: '123',
        financeId: '56',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(deleteFinanceSpy).toHaveBeenCalledWith('123', '56')
  })
})

describe('postIdDelete', () => {
  it('Happy path', async () => {
    const deleteIdSpy = jest.spyOn(rpService, 'deleteId').mockImplementation()
    await request(app)
      .post('/finance-and-id/id-delete')
      .send({
        prisonerNumber: '123',
        idId: '56',
      })
      .expect(302)
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id?prisonerNumber=123#id'))
    expect(deleteIdSpy).toHaveBeenCalledWith('123', '56')
  })

  it('error case - missing prisonerNumber', async () => {
    await request(app)
      .post('/finance-and-id/id-delete')
      .send({
        idId: '56',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('error case - missing idId', async () => {
    await request(app)
      .post('/finance-and-id/id-delete')
      .send({
        prisonerNumber: '123',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('error case - error from API', async () => {
    const deleteIdSpy = jest.spyOn(rpService, 'deleteId').mockRejectedValue(new Error('Something went wrong'))
    await request(app)
      .post('/finance-and-id/id-delete')
      .send({
        prisonerNumber: '123',
        idId: '56',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(deleteIdSpy).toHaveBeenCalledWith('123', '56')
  })
})
