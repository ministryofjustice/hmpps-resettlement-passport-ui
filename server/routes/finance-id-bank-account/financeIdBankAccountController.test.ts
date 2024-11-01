import type { Express } from 'express'
import request from 'supertest'
import RpService from '../../services/rpService'
import Config from '../../s3Config'
import { sanitiseStackTrace, stubPrisonerDetails } from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes } from '../testutils/appSetup'

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

describe('getAddBankAccountView', () => {
  it('Happy path add bank account form renders', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account/?prisonerNumber=123')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('navigating via changing your answer', async () => {
    await request(app)
      .get(
        '/finance-and-id/add-a-bank-account?bankName=Barclays&applicationSubmittedDay=1&applicationSubmittedMonth=1&applicationSubmittedYear=2004&prisonerNumber=123&applicationId=&confirmationType=addAccount&applicationType=',
      )
      .expect(200)
      .expect(res => expect(sanitiseStackTrace(res.text)).toMatchSnapshot())
  })
  it('error, prisoner number blank', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account/?prisonerNumber=')
      .expect(500)
      .expect(res => expect(sanitiseStackTrace(res.text)).toMatchSnapshot())
  })
  it('error, prisoner number missing', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account/')
      .expect(500)
      .expect(res => expect(sanitiseStackTrace(res.text)).toMatchSnapshot())
  })
})
describe('getUpdateBankAccountStatusView', () => {
  it('Happy path update bank account', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account/?prisonerNumber=123&applicationId=123')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error, prisoner number blank', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account/?prisonerNumber=&applicationId=123')
      .expect(500)
      .expect(res => expect(sanitiseStackTrace(res.text)).toMatchSnapshot())
  })
  it('error, prisoner number missing', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account/&applicationId=123')
      .expect(404)
      .expect(res => expect(sanitiseStackTrace(res.text)).toMatchSnapshot())
  })
  it('error application ID blank', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account/?prisonerNumber=123&applicationId=')
      .expect(200)
      .expect(res => expect(sanitiseStackTrace(res.text)).toMatchSnapshot())
  })
  it('error application ID missing', async () => {
    await request(app)
      .get('/finance-and-id/add-a-bank-account/?prisonerNumber=123')
      .expect(200)
      .expect(res => expect(sanitiseStackTrace(res.text)).toMatchSnapshot())
  })
})
describe('getConfirmAddABankAccountView', () => {
  it('Happy path confirm add bank account', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-a-bank-account/?bankName=Lloyds&applicationSubmittedDay=01&applicationSubmittedMonth=01&applicationSubmittedYear=01&prisonerNumber=123&applicationId=&confirmationType=addAccount&applicationType=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error, prisoner number missing', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-a-bank-account/?bankName=Lloyds&applicationSubmittedDay=01&applicationSubmittedMonth=01&applicationSubmittedYear=01&applicationId=&confirmationType=addAccount&applicationType=',
      )
      .expect(500)
      .expect(res => expect(sanitiseStackTrace(res.text)).toMatchSnapshot())
  })
  it('only prisoner number, no day/month/year/bank name', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-a-bank-account/?prisonerNumber=123&applicationId=&confirmationType=addAccount&applicationType=',
      )
      .expect(200)
      .expect(res => expect(sanitiseStackTrace(res.text)).toMatchSnapshot())
  })
})
describe('postBankAccountSubmitView', () => {
  it('happy path - posting bank account', async () => {
    const postBankApplicationSpy = jest.spyOn(rpService, 'postBankApplication').mockImplementation()
    await request(app)
      .post('/finance-and-id/bank-account-submit')
      .send({
        prisonerNumber: '123',
        applicationDate: '01/01/2024',
        bankName: 'BARCLAYS',
      })
      .expect(302)
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id/?prisonerNumber=123#finance'))
    expect(postBankApplicationSpy).toHaveBeenCalledWith('123', {
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
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error - prisoner number missing', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-submit')
      .send({
        applicationDate: '01/01/2024',
        bankName: 'BARCLAYS',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error - bank Name blank', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-submit')
      .send({
        prisonerNumber: '123',
        applicationDate: '01/01/2024',
        bankName: '',
      })
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error - bank Name missing', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-submit')
      .send({
        prisonerNumber: '123',
        applicationDate: '01/01/2024',
      })
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error - bank application date blank', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-submit')
      .send({
        prisonerNumber: '123',
        applicationDate: '',
        bankName: 'BARCLAYS',
      })
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error - bank application date missing', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-submit')
      .send({
        prisonerNumber: '123',
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
        prisonerNumber: '123',
        applicationId: '1000',
        updatedStatus: 'Account opened',
        bankResponseDate: '01/01/2000',
        isAddedToPersonalItems: 'Yes',
        addedToPersonalItemsDate: '01/01/2000',
        resubmissionDate: '01/01/2000',
      })
      .expect(302)
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id/?prisonerNumber=123#finance'))
    expect(patchBankApplicationSpy).toHaveBeenCalledWith('123', '1000', {
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
      .expect(500)
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
      .expect(500)
  })
  it('error - updated status blank', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-update')
      .send({
        prisonerNumber: '123',
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
  it('error - updated status missing', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-update')
      .send({
        prisonerNumber: '123',
        applicationId: '1000',
        bankResponseDate: '01/01/2000',
        isAddedToPersonalItems: 'Yes',
        addedToPersonalItemsDate: '01/01/2000',
        resubmissionDate: '01/01/2000',
      })
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error - added to personal items blank', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-update')
      .send({
        prisonerNumber: '123',
        applicationId: '1000',
        updatedStatus: 'Account opened',
        bankResponseDate: '01/01/2000',
        isAddedToPersonalItems: 'No',
        addedToPersonalItemsDate: '',
        resubmissionDate: '01/01/2004',
      })
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error - added to personal items missing', async () => {
    await request(app)
      .post('/finance-and-id/bank-account-update')
      .send({
        prisonerNumber: '123',
        applicationId: '1000',
        updatedStatus: 'Account opened',
        bankResponseDate: '01/01/2000',
        isAddedToPersonalItems: 'No',
        resubmissionDate: '01/01/2004',
      })
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})
