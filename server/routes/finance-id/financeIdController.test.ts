import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import {
  pageHeading,
  parseHtmlDocument,
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
    const getCrsReferralsSpy = stubCrsReferrals(rpService, 'FINANCE_AND_ID')
    const getAssessmentInformationSpy = stubAssessmentInformation(rpService)
    const getCaseNotesHistorySpy = stubCaseNotesHistory(rpService, 'FINANCE_AND_ID')
    const getCaseNotesCreatorsSpy = stubCaseNotesCreators(rpService)
    const getFinanceSpy = stubFetchFinance(rpService)
    const getIdSpy = stubFetchId(rpService)

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
  })

  it('Happy path with default query params and no data from endpoints', async () => {
    const getCrsReferralsSpy = stubRpServiceNoData(rpService, 'getCrsReferrals')
    const getAssessmentInformationSpy = stubRpServiceNoData(rpService, 'getAssessmentInformation')
    const getCaseNotesHistorySpy = stubRpServiceNoData(rpService, 'getCaseNotesHistory')
    const getCaseNotesCreatorsSpy = stubRpServiceNoData(rpService, 'getCaseNotesCreators')
    const getFinanceSpy = stubRpServiceNoData(rpService, 'fetchFinance')
    const getIdSpy = stubRpServiceNoData(rpService, 'fetchId')

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
        '/finance-and-id?prisonerNumber=A1234DY&page=1&pageSize=20&sort=occurenceDateTime%2CASC&days=30&createdByUserId=2',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      'A1234DY',
      'FINANCE_AND_ID',
      '2',
      '20',
      '1',
      'occurenceDateTime,ASC',
      '30',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('A1234DY', 'FINANCE_AND_ID')
    expect(getFinanceSpy).toHaveBeenCalledWith('A1234DY')
    expect(getIdSpy).toHaveBeenCalledWith('A1234DY')
  })

  it('Error case - missing prisonerNumber', async () => {
    await request(app)
      .get('/finance-and-id')
      .expect(404)
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(pageHeading(document)).toEqual('No data found for prisoner')
      })
  })

  it('Error case - error thrown from rpService', async () => {
    stubRpServiceThrowError(rpService, 'getCrsReferrals')
    await request(app)
      .get('/finance-and-id?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(pageHeading(document)).toEqual('Something went wrong')
      })
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

  it('error case - missing prisonerNumber', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-delete')
      .send({
        financeId: '56',
      })
      .expect(400)
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(pageHeading(document)).toEqual('Something went wrong')
      })
  })

  it('error case - missing financeId', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-delete')
      .send({
        prisonerNumber: 'A1234DY',
      })
      .expect(400)
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(pageHeading(document)).toEqual('Something went wrong')
      })
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
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(pageHeading(document)).toEqual('Something went wrong')
      })
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

  it('error case - missing prisonerNumber', async () => {
    await request(app)
      .post('/finance-and-id/id-delete')
      .send({
        idId: '56',
      })
      .expect(400)
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(pageHeading(document)).toEqual('Something went wrong')
      })
  })

  it('error case - missing idId', async () => {
    await request(app)
      .post('/finance-and-id/id-delete')
      .send({
        prisonerNumber: 'A1234DY',
      })
      .expect(400)
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(pageHeading(document)).toEqual('Something went wrong')
      })
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
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(pageHeading(document)).toEqual('Something went wrong')
      })
    expect(deleteIdSpy).toHaveBeenCalledWith('A1234DY', '56')
  })
})
