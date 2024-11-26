import type { Express } from 'express'
import request from 'supertest'
import Config from '../../s3Config'
import {
  expectPrisonerNotFoundPage,
  parseHtmlDocument,
  sanitiseStackTrace,
  stubPrisonerDetails,
} from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'

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

describe('getAddBankAccountView', () => {
  it('Happy path add bank account form renders', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account/?prisonerNumber=AA1234DY4DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('navigating via changing your answer', async () => {
    await request(app)
      .get(
        '/finance-and-id/add-a-bank-account?bankName=Barclays&applicationSubmittedDay=1&applicationSubmittedMonth=1&applicationSubmittedYear=2004&prisonerNumber=AA1234DY4DY&applicationId=&confirmationType=addAccount&applicationType=',
      )
      .expect(200)
      .expect(res => expect(sanitiseStackTrace(res.text)).toMatchSnapshot())
  })
  it('error, prisoner number blank', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account/?prisonerNumber=')
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })
  it('error, prisoner number missing', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account/')
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })
})
describe('getUpdateBankAccountStatusView', () => {
  it('Happy path update bank account', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account/?prisonerNumber=AA1234DY4DY&applicationId=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error, prisoner number blank', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account/?prisonerNumber=&applicationId=A1234DY')
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })
  it('error, prisoner number missing', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account?applicationId=AA1234DY4DY')
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })
  it('error application ID blank', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account?prisonerNumber=AA1234DY4DY&applicationId=')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error application ID missing', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account/?prisonerNumber=AA1234DY4DY')
      .expect(200)
      .expect(res => expect(sanitiseStackTrace(res.text)).toMatchSnapshot())
  })
})
describe('getConfirmAddABankAccountView', () => {
  it('Happy path confirm add bank account', async () => {
    await request(app)
      .get('/finance-and-id/confirm-add-a-bank-account')
      .query({
        bankName: 'Lloyds',
        applicationSubmittedDay: '01',
        applicationSubmittedMonth: '01',
        applicationSubmittedYear: 2025,
        prisonerNumber: 'AA1234DY4DY',
        applicationId: '',
        confirmationType: 'addAccount',
        applicationType: '',
      })
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Successfully update status and go to confirm page', async () => {
    // http://localhost:3000/finance-and-id/confirm-add-a-bank-account/?updatedStatus=Account+opened&accountOpenedDay=1&accountOpenedMonth=1&accountOpenedYear=2025&dateAddedDay=&dateAddedMonth=&dateAddedYear=&addedToPersonalItems=No&heardBackDay=&heardBackMonth=&heardBackYear=&prisonerNumber=A8731DY&applicationId=2&confirmationType=updateStatus
    await request(app)
      .get('/finance-and-id/confirm-add-a-bank-account')
      .expect(200)
      .query({
        accountOpenedDay: '1',
        accountOpenedMonth: '1',
        accountOpenedYear: 2025,
        addedToPersonalItems: 'No',
        prisonerNumber: 'AA1234DY4DY',
        confirmationType: 'updateStatus',
        applicationId: '2',
        applicationType: '',
        updatedStatus: 'Account opened',
      })
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(errorMessages(document)).toHaveLength(0)
        expect(document.querySelector('.govuk-heading-m').textContent).toContain(
          'Check your answers before adding a bank account application',
        )
      })
  })

  it('Happy path confirm resubmit bank account when account was declined', async () => {
    await request(app)
      .get('/finance-and-id/confirm-add-a-bank-account')
      .expect(200)
      .query({
        bankName: 'Lloyds',
        applicationResubmittedDay: '01',
        applicationResubmittedMonth: '01',
        applicationResubmittedYear: 2025,
        prisonerNumber: 'AA1234DY4DY',
        applicationId: '',
        confirmationType: 'resubmit',
        applicationType: '',
        status: 'Account declined',
        dateResubmittedHeardDay: 1,
        dateResubmittedHeardMonth: 1,
        dateResubmittedHeardYear: 2025,
      })
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(errorMessages(document)).toHaveLength(0)
        expect(document.querySelector('.govuk-heading-m').textContent).toContain(
          'Check your answers before adding a bank account application',
        )
      })
  })
  it('error, prisoner number missing', async () => {
    await request(app)
      .get('/finance-and-id/confirm-add-a-bank-account')
      .query({
        bankName: 'Lloyds',
        applicationSubmittedDay: '01',
        applicationSubmittedMonth: '01',
        applicationSubmittedYear: 2025,
        applicationId: '',
        confirmationType: 'addAccount',
        applicationType: '',
      })
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })
  it('only prisoner number, no day/month/year/bank name - adding a new account', async () => {
    await request(app)
      .get('/finance-and-id/confirm-add-a-bank-account')
      .query({
        prisonerNumber: 'AA1234DY4DY',
        applicationId: '',
        confirmationType: 'addAccount',
        applicationType: '',
      })
      .expect(200)
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(document.querySelector('h3').textContent).toContain('Apply for a bank account')
        expect(errorMessages(document)).toEqual([
          'The application must include a bank name',
          'The date must include a day',
          'The date must include a month',
          'The date must include a year',
          'The date must be a real date',
        ])
      })
  })

  it('Validation error on update status to declined', async () => {
    await request(app)
      .get('/finance-and-id/confirm-add-a-bank-account')
      .expect(200)
      .query({
        bankName: 'Lloyds',
        prisonerNumber: 'A1234DY',
        applicationId: '1',
        confirmationType: 'updateStatus',
        applicationType: '',
        updatedStatus: 'Account declined',
      })
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(document.querySelector('.govuk-heading-m').textContent).toContain('Apply for a bank account')
        expect(errorMessages(document)).toEqual([
          'The date must include a day',
          'The date must include a month',
          'The date must include a year',
          'The date must be a real date',
        ])
      })
  })

  it('Validation error on update status to opened', async () => {
    await request(app)
      .get('/finance-and-id/confirm-add-a-bank-account')
      .expect(200)
      .query({
        bankName: 'Lloyds',
        prisonerNumber: 'A1234DY',
        applicationId: '1',
        confirmationType: 'updateStatus',
        applicationType: '',
        updatedStatus: 'Account opened',
      })
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(document.querySelector('.govuk-heading-m').textContent).toContain('Apply for a bank account')
        expect(errorMessages(document)).toEqual([
          'The date must include a month',
          'The date must include a year',
          'The date must be a real date',
          'Select if it was added to personal items',
        ])
      })
  })

  it('Validation error on update status to opened with personalised items', async () => {
    await request(app)
      .get('/finance-and-id/confirm-add-a-bank-account')
      .expect(200)
      .query({
        bankName: 'Lloyds',
        prisonerNumber: 'A1234DY',
        applicationId: '1',
        confirmationType: 'updateStatus',
        applicationType: '',
        addedToPersonalItems: 'Yes',
        updatedStatus: 'Account opened',
      })
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(document.querySelector('.govuk-heading-m').textContent).toContain('Apply for a bank account')
        expect(errorMessages(document)).toEqual([
          'The date must include a month',
          'The date must include a year',
          'The date must be a real date',
          'The date must include a day',
          'The date must include a month',
          'The date must include a year',
          'The date must be a real date',
        ])
      })
  })

  it('Validation error on resubmit', async () => {
    await request(app)
      .get('/finance-and-id/confirm-add-a-bank-account')
      .expect(200)
      .query({
        bankName: 'Lloyds',
        prisonerNumber: 'A1234DY',
        applicationId: '',
        confirmationType: 'resubmit',
        applicationType: 'resubmit',
      })
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(document.querySelector('.govuk-heading-m').textContent).toContain('Apply for a bank account')
        expect(errorMessages(document)).toEqual([
          'The date must include a day',
          'The date must include a month',
          'The date must include a year',
          'The date must be a real date',
          'The application must include a status',
        ])
      })
  })
})

export function errorMessages(document: Document): string[] {
  return Array.from(document.querySelectorAll('.govuk-error-message')).map(message => message.textContent?.trim())
}

describe('postBankAccountSubmitView', () => {
  it('happy path - posting bank account', async () => {
    const postBankApplicationSpy = jest.spyOn(rpService, 'postBankApplication').mockImplementation()
    await request(app)
      .post('/finance-and-id/bank-account-submit')
      .send({
        prisonerNumber: 'A1234DY',
        applicationDate: '01/01/2024',
        bankName: 'BARCLAYS',
      })
      .expect(302)
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id/?prisonerNumber=A1234DY#finance'))
    expect(postBankApplicationSpy).toHaveBeenCalledWith('A1234DY', {
      applicationSubmittedDate: '2024-01-01T00:00:00',
      bankName: 'BARCLAYS',
    })
  })
  it('error - prisoner number blank', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-submit')
      .send({
        prisonerNumber: '',
        applicationDate: '01/01/2024',
        bankName: 'BARCLAYS',
      })
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })
  it('error - prisoner number missing', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-submit')
      .send({
        applicationDate: '01/01/2024',
        bankName: 'BARCLAYS',
      })
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })
  it('error - bank Name blank', async () => {
    rpService.postBankApplication = jest.fn().mockRejectedValue(new Error('bank name is required'))
    await request(app)
      .post('/finance-and-id/bank-account-submit')
      .send({
        prisonerNumber: 'A1234DY',
        applicationDate: '01/01/2024',
        bankName: '',
      })
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error - bank Name missing', async () => {
    rpService.postBankApplication = jest.fn().mockRejectedValue(new Error('bank name is required'))
    await request(app)
      .post('/finance-and-id/bank-account-submit')
      .send({
        prisonerNumber: 'A1234DY',
        applicationDate: '01/01/2024',
      })
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error - bank application date blank', async () => {
    rpService.postBankApplication = jest.fn().mockRejectedValue(new Error('bank application date is required'))
    await request(app)
      .post('/finance-and-id/bank-account-submit')
      .send({
        prisonerNumber: 'A1234DY',
        applicationDate: '',
        bankName: 'BARCLAYS',
      })
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error - bank application date missing', async () => {
    rpService.postBankApplication = jest.fn().mockRejectedValue(new Error('bank application date is required'))
    await request(app)
      .post('/finance-and-id/bank-account-submit')
      .send({
        prisonerNumber: 'A1234DY',
        bankName: 'BARCLAYS',
      })
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})
describe('postBankAccountUpdateView', () => {
  it('happy path - updating bank account', async () => {
    const patchBankApplicationSpy = jest.spyOn(rpService, 'patchBankApplication').mockResolvedValue({})
    await request(app)
      .post('/finance-and-id/bank-account-update')
      .send({
        prisonerNumber: 'A1234DY',
        applicationId: '1000',
        updatedStatus: 'Account opened',
        bankResponseDate: '01/01/2000',
        isAddedToPersonalItems: 'Yes',
        addedToPersonalItemsDate: '01/01/2000',
        resubmissionDate: '01/01/2000',
      })
      .expect(302)
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id/?prisonerNumber=A1234DY#finance'))
    expect(patchBankApplicationSpy).toHaveBeenCalledWith('A1234DY', '1000', {
      addedToPersonalItemsDate: '2000-01-01T00:00:00',
      bankResponseDate: '2000-01-01T00:00:00',
      isAddedToPersonalItems: true,
      resubmissionDate: '2000-01-01T00:00:00',
      status: 'Account opened',
    })
  })
  it('error - prisoner number blank', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-update')
      .send({
        prisonerNumber: '',
        applicationId: '1000',
        updatedStatus: 'Account opened',
        bankResponseDate: '01/01/2000',
        isAddedToPersonalItems: 'Yes',
        addedToPersonalItemsDate: '01/01/2000',
        resubmissionDate: '01/01/2000',
      })
      .expect(404)
  })
  it('error - prisoner number missing', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-update')
      .send({
        applicationId: '1000',
        updatedStatus: 'Account opened',
        bankResponseDate: '01/01/2000',
        isAddedToPersonalItems: 'Yes',
        addedToPersonalItemsDate: '01/01/2000',
        resubmissionDate: '01/01/2000',
      })
      .expect(404)
  })
  it('error - API rejects submission', async () => {
    rpService.patchBankApplication = jest.fn().mockRejectedValue(new Error('status is required'))
    await request(app)
      .post('/finance-and-id/bank-account-update')
      .send({
        prisonerNumber: 'A1234DY',
        applicationId: '1000',
        updatedStatus: '',
        bankResponseDate: '01/01/2000',
        isAddedToPersonalItems: 'Yes',
        addedToPersonalItemsDate: '01/01/2000',
        resubmissionDate: '01/01/2000',
      })
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})
