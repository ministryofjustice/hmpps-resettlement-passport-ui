import type { Express } from 'express'
import request from 'supertest'
import RpService from '../../services/rpService'
import { appWithAllRoutes } from '../testutils/appSetup'
import {
  stubPrisonerDetails,
  stubAssessmentInformation,
  stubCaseNotesCreators,
  stubCaseNotesHistory,
  stubCrsReferrals,
  stubFetchFinance,
  stubFetchId,
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

describe('getAddAnIdView', () => {
  it('Get add ID application', async () => {
    // Stub any calls to services
    await request(app)
      .get('/finance-and-id/add-an-id/?prisonerNumber=A8731DY&existingIdTypes=')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Validation error - submit empty ID application form', async () => {
    await request(app)
      .get(
        '/finance-and-id/add-an-id-further/?idType=&applicationSubmittedDay=&applicationSubmittedMonth=&applicationSubmittedYear=&prisonerNumber=A8731DY&isPriorityApplication=&costOfApplication=&driversLicenceApplicationMadeAt=&driversLicenceType=&courtDetails=&caseNumber=&isUkNationalBornOverseas=&countryBornIn=&haveGro=&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Validation error - submit ID application via birth certificate without a date', async () => {
    await request(app)
      .get(
        '/finance-and-id/add-an-id-further/?idType=Birth+certificate&applicationSubmittedDay=&applicationSubmittedMonth=&applicationSubmittedYear=&prisonerNumber=A8731DY&isPriorityApplication=&costOfApplication=&driversLicenceApplicationMadeAt=&driversLicenceType=&courtDetails=&caseNumber=&isUkNationalBornOverseas=&countryBornIn=&haveGro=&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Validation error - submit submit ID application via birth certificate with invalid date', async () => {
    await request(app)
      .get(
        '/finance-and-id/add-an-id-further/?idType=Birth+certificate&applicationSubmittedDay=13&applicationSubmittedMonth=13&applicationSubmittedYear=2000&prisonerNumber=A8731DY&isPriorityApplication=&costOfApplication=&driversLicenceApplicationMadeAt=&driversLicenceType=&courtDetails=&caseNumber=&isUkNationalBornOverseas=&countryBornIn=&haveGro=&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Error case - submit ID application without type or date', async () => {
    await request(app)
      .get('/finance-and-id/add-an-id-further/?prisonerNumber=A8731DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Confirm add an ID - birth certificate submit without cost or answers', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id/?countryBornIn=&costOfApplication=&applicationSubmittedYear=2000&applicationSubmittedMonth=12&applicationSubmittedDay=12&idType=Birth+certificate&prisonerNumber=A8731DY&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Confirm add an ID - birth certificate submit with cost below zero and no answers', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id/?countryBornIn=&costOfApplication=-100&applicationSubmittedYear=2000&applicationSubmittedMonth=12&applicationSubmittedDay=12&idType=Birth+certificate&prisonerNumber=A8731DY&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Confirm add an ID - birth certificate submit with cost above zero and no answers', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id/?countryBornIn=&costOfApplication=100&applicationSubmittedYear=2000&applicationSubmittedMonth=12&applicationSubmittedDay=12&idType=Birth+certificate&prisonerNumber=A8731DY&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Confirm add an ID - birth certificate submit with cost above zero and no gro number', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id/?haveGro=false&countryBornIn=&costOfApplication=100&applicationSubmittedYear=2000&applicationSubmittedMonth=12&applicationSubmittedDay=12&idType=Birth+certificate&prisonerNumber=A8731DY&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Confirm add an ID - birth certificate submit with cost above zero and gro number', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id/?haveGro=true&countryBornIn=&costOfApplication=100&applicationSubmittedYear=2000&applicationSubmittedMonth=12&applicationSubmittedDay=12&idType=Birth+certificate&prisonerNumber=A8731DY&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Confirm add an ID - birth certificate submit with cost above zero and gro number', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id/?haveGro=true&countryBornIn=&costOfApplication=100&applicationSubmittedYear=2000&applicationSubmittedMonth=12&applicationSubmittedDay=12&idType=Birth+certificate&prisonerNumber=A8731DY&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Confirm add an ID - birth certificate submit with cost above zero, gro number and country', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id/?haveGro=true&isUkNationalBornOverseas=true&countryBornIn=Argentina&costOfApplication=100&applicationSubmittedYear=2000&applicationSubmittedMonth=12&applicationSubmittedDay=12&idType=Birth+certificate&prisonerNumber=A8731DY&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Confirm add an ID - birth certificate submit with cost above zero, gro number and no country', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id/?haveGro=true&countryBornIn=Argentina&isUkNationalBornOverseas=false&costOfApplication=100&applicationSubmittedYear=2000&applicationSubmittedMonth=12&applicationSubmittedDay=12&idType=Birth+certificate&prisonerNumber=A8731DY&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Confirm add an ID - birth certificate submit with cost above zero, gro number, country and priority application', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id/?haveGro=true&isUkNationalBornOverseas=true&countryBornIn=Argentina&isPriorityApplication=true&costOfApplication=100&applicationSubmittedYear=2000&applicationSubmittedMonth=12&applicationSubmittedDay=12&idType=Birth+certificate&prisonerNumber=A8731DY&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Confirm add an ID - birth certificate submit with cost above zero, gro number, country and no priority application', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id/?haveGro=true&isUkNationalBornOverseas=true&countryBornIn=Argentina&isPriorityApplication=false&costOfApplication=100&applicationSubmittedYear=2000&applicationSubmittedMonth=12&applicationSubmittedDay=12&idType=Birth+certificate&prisonerNumber=A8731DY&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Confirm add an ID - birth certificate submit with cost above zero, no gro number, country and no priority application', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id/?haveGro=false&isUkNationalBornOverseas=true&countryBornIn=Argentina&isPriorityApplication=false&costOfApplication=100&applicationSubmittedYear=2000&applicationSubmittedMonth=12&applicationSubmittedDay=12&idType=Birth+certificate&prisonerNumber=A8731DY&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Confirm add an ID - birth certificate submit with cost above zero, no gro number, country and no priority application', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id/?haveGro=false&isUkNationalBornOverseas=true&countryBornIn=Argentina&isPriorityApplication=false&costOfApplication=100&applicationSubmittedYear=2000&applicationSubmittedMonth=12&applicationSubmittedDay=12&idType=Birth+certificate&prisonerNumber=A8731DY&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Get ID application status - birth certificate', async () => {
    await request(app)
      .get(
        '/finance-and-id/update-id-status/?prisonerNumber=A8731DY&applicationId=1&idType=Birth%20certificate&applicationSubmittedDate=2000-12-12T00:00:00',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Reject ID application status - birth certificate, no refund', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id-status/?updatedStatus=Rejected&dateIdReceivedDay=&dateIdReceivedMonth=&dateIdReceivedYear=&addedToPersonalItemsDateDay=&addedToPersonalItemsDateMonth=&addedToPersonalItemsDateYear=&refundAmount=&idType=Birth+certificate&applicationId=1&prisonerNumber=A8731DY',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Reject ID application status - birth certificate, refund', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id-status/?updatedStatus=Rejected&dateIdReceivedDay=&dateIdReceivedMonth=&dateIdReceivedYear=&addedToPersonalItemsDateDay=&addedToPersonalItemsDateMonth=&addedToPersonalItemsDateYear=&refundAmount=100&idType=Birth+certificate&applicationId=1&prisonerNumber=A8731DY',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Accept ID application status - birth certificate, no refund', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id-status/?updatedStatus=Accepted&dateIdReceivedDay=&dateIdReceivedMonth=&dateIdReceivedYear=&addedToPersonalItemsDateDay=&addedToPersonalItemsDateMonth=&addedToPersonalItemsDateYear=&refundAmount=&idType=Birth+certificate&applicationId=1&prisonerNumber=A8731DY',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Accept ID application status - birth certificate and refund', async () => {
    await request(app)
      .get(
        '/finance-and-id/confirm-add-an-id-status/?updatedStatus=Accepted&dateIdReceivedDay=&dateIdReceivedMonth=&dateIdReceivedYear=&addedToPersonalItemsDateDay=&addedToPersonalItemsDateMonth=&addedToPersonalItemsDateYear=&refundAmount=100&idType=Birth+certificate&applicationId=1&prisonerNumber=A8731DY',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Happy path - post ID submit birth certificate', async () => {
    const submitIdSpy = jest.spyOn(rpService, 'postIdApplication').mockImplementation()
    await request(app)
      .post('/finance-and-id/id-submit')
      .send({
        idType: 'Birth certificate',
        applicationSubmittedDate: '2000-10-12T00:00:00.000Z',
        haveGro: true,
        isUkNationalBornOverseas: false,
        countryBornIn: '',
        prisonerNumber: '123',
        isPriorityApplication: true,
        costOfApplication: '10',
      })
      .expect(302)
      .expect(res => expect(res.text).toMatchSnapshot())
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id/?prisonerNumber=123#id'))
    expect(submitIdSpy).toHaveBeenCalledWith('123', {
      applicationSubmittedDate: '2000-10-12T01:00:00',
      caseNumber: undefined,
      costOfApplication: 10,
      countryBornIn: '',
      courtDetails: undefined,
      driversLicenceApplicationMadeAt: undefined,
      driversLicenceType: undefined,
      haveGro: true,
      idType: 'Birth certificate',
      isPriorityApplication: true,
      isUkNationalBornOverseas: false,
    })
  })
  it('Happy path - post ID submit birth certificate - no gro, born overseas', async () => {
    const submitIdSpy = jest.spyOn(rpService, 'postIdApplication').mockImplementation()
    await request(app)
      .post('/finance-and-id/id-submit')
      .send({
        idType: 'Birth certificate',
        applicationSubmittedDate: '2000-10-12T00:00:00.000Z',
        haveGro: false,
        isUkNationalBornOverseas: true,
        countryBornIn: 'Belgium',
        prisonerNumber: '123',
        isPriorityApplication: false,
        costOfApplication: '10',
      })
      .expect(302)
      .expect(res => expect(res.text).toMatchSnapshot())
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id/?prisonerNumber=123#id'))
    expect(submitIdSpy).toHaveBeenCalledWith('123', {
      applicationSubmittedDate: '2000-10-12T01:00:00',
      caseNumber: undefined,
      costOfApplication: 10,
      countryBornIn: 'Belgium',
      courtDetails: undefined,
      driversLicenceApplicationMadeAt: undefined,
      driversLicenceType: undefined,
      haveGro: false,
      idType: 'Birth certificate',
      isPriorityApplication: false,
      isUkNationalBornOverseas: true,
    })
  })
  it('Happy path - post ID update birth certificate - accepted', async () => {
    const updateIdSpy = jest.spyOn(rpService, 'patchIdApplication').mockImplementation()
    await request(app)
      .post('/finance-and-id/id-update')
      .send({
        updatedStatus: 'Accepted',
        refundAmount: '10',
        prisonerNumber: '123',
        applicationId: '1',
        idType: 'Birth certificate',
      })
      .expect(302)
      .expect(res => expect(res.text).toMatchSnapshot())
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id/?prisonerNumber=123#id'))
    expect(updateIdSpy).toHaveBeenCalledWith('123', '1', {
      addedToPersonalItemsDate: null,
      dateIdReceived: null,
      isAddedToPersonalItems: undefined,
      refundAmount: 10,
      status: 'Accepted',
      statusUpdateDate: null,
    })
  })
  it('Happy path - post ID update birth certificate - rejected', async () => {
    const updateIdSpy = jest.spyOn(rpService, 'patchIdApplication').mockImplementation()
    await request(app)
      .post('/finance-and-id/id-update')
      .send({
        updatedStatus: 'Rejected',
        refundAmount: '10',
        prisonerNumber: '123',
        applicationId: '1',
        idType: 'Birth certificate',
      })
      .expect(302)
      .expect(res => expect(res.text).toMatchSnapshot())
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id/?prisonerNumber=123#id'))
    expect(updateIdSpy).toHaveBeenCalledWith('123', '1', {
      addedToPersonalItemsDate: null,
      dateIdReceived: null,
      isAddedToPersonalItems: undefined,
      refundAmount: 10,
      status: 'Rejected',
      statusUpdateDate: null,
    })
  })
  it('Error case - post ID submit without parameters', async () => {
    await request(app)
      .post('/finance-and-id/id-submit')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Error case - post ID submit without prisoner ID', async () => {
    const submitIdSpy = jest.spyOn(rpService, 'postIdApplication').mockRejectedValue(new Error('Some error'))
    await request(app)
      .post('/finance-and-id/id-submit')
      .send({
        idType: 'Birth certificate',
        applicationSubmittedDate: '2000-10-12T00:00:00.000Z',
        haveGro: true,
        isUkNationalBornOverseas: false,
        countryBornIn: '',
        isPriorityApplication: false,
        costOfApplication: '10',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Error case - post ID submit with empty prisoner ID', async () => {
    const submitIdSpy = jest.spyOn(rpService, 'postIdApplication').mockRejectedValue(new Error('Some error'))
    await request(app)
      .post('/finance-and-id/id-submit')
      .send({
        idType: 'Birth certificate',
        applicationSubmittedDate: '2000-10-12T00:00:00.000Z',
        haveGro: true,
        isUkNationalBornOverseas: false,
        countryBornIn: '',
        prisonerNumber: '',
        isPriorityApplication: false,
        costOfApplication: '10',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Error case - post ID submit with null prisoner ID', async () => {
    const submitIdSpy = jest.spyOn(rpService, 'postIdApplication').mockRejectedValue(new Error('Some error'))
    await request(app)
      .post('/finance-and-id/id-submit')
      .send({
        idType: 'Birth certificate',
        applicationSubmittedDate: '2000-10-12T00:00:00.000Z',
        haveGro: true,
        isUkNationalBornOverseas: false,
        countryBornIn: '',
        prisonerNumber: null,
        isPriorityApplication: false,
        costOfApplication: '10',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Error case - post ID submit with invalid prisoner ID', async () => {
    const submitIdSpy = jest.spyOn(rpService, 'postIdApplication').mockRejectedValue(new Error('Some error'))
    await request(app)
      .post('/finance-and-id/id-submit')
      .send({
        idType: 'Birth certificate',
        applicationSubmittedDate: '2000-10-12T00:00:00.000Z',
        haveGro: true,
        isUkNationalBornOverseas: false,
        countryBornIn: '',
        prisonerNumber: '!?@@?!',
        isPriorityApplication: false,
        costOfApplication: '10',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('error case - error from API', async () => {
    const submitIdSpy = jest.spyOn(rpService, 'postIdApplication').mockRejectedValue(new Error('Something went wrong'))
    await request(app)
      .post('/finance-and-id/id-submit')
      .send({
        idType: 'Birth certificate',
        applicationSubmittedDate: '2000-10-12T00:00:00.000Z',
        haveGro: true,
        isUkNationalBornOverseas: false,
        countryBornIn: '',
        prisonerNumber: '123',
        isPriorityApplication: true,
        costOfApplication: '10',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Happy path - post ID submit divorce decree absolute certificate', async () => {
    const submitIdSpy = jest.spyOn(rpService, 'postIdApplication').mockImplementation()
    await request(app)
      .post('/finance-and-id/id-submit')
      .send({
        idType: 'Divorce decree absolute certificate',
        applicationSubmittedDate: '2000-10-12T00:00:00.000Z',
        caseNumber: '123',
        courtDetails: '456',
        prisonerNumber: '789',
        isPriorityApplication: true,
        costOfApplication: '10',
      })
      .expect(302)
      .expect(res => expect(res.text).toMatchSnapshot())
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id/?prisonerNumber=789#id'))
    expect(submitIdSpy).toHaveBeenCalledWith('789', {
      applicationSubmittedDate: '2000-10-12T01:00:00',
      caseNumber: '123',
      costOfApplication: 10,
      countryBornIn: undefined,
      courtDetails: '456',
      driversLicenceApplicationMadeAt: undefined,
      driversLicenceType: undefined,
      haveGro: undefined,
      idType: 'Divorce decree absolute certificate',
      isPriorityApplication: true,
      isUkNationalBornOverseas: undefined,
    })
  })
  it('Happy path - post ID submit driving license', async () => {
    const submitIdSpy = jest.spyOn(rpService, 'postIdApplication').mockImplementation()
    await request(app)
      .post('/finance-and-id/id-submit')
      .send({
        idType: 'Driving licence',
        applicationSubmittedDate: '2000-10-12T00:00:00.000Z',
        driversLicenceType: 'Provisional',
        driversLicenceApplicationMadeAt: 'Online',
        prisonerNumber: '789',
        isPriorityApplication: true,
        costOfApplication: '10',
      })
      .expect(302)
      .expect(res => expect(res.text).toMatchSnapshot())
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id/?prisonerNumber=789#id'))
    expect(submitIdSpy).toHaveBeenCalledWith('789', {
      applicationSubmittedDate: '2000-10-12T01:00:00',
      caseNumber: undefined,
      costOfApplication: 10,
      countryBornIn: undefined,
      courtDetails: undefined,
      driversLicenceApplicationMadeAt: 'Online',
      driversLicenceType: 'Provisional',
      haveGro: undefined,
      idType: 'Driving licence',
      isPriorityApplication: true,
      isUkNationalBornOverseas: undefined,
    })
  })
  it('Happy path - post ID submit biometric residence permit', async () => {
    const submitIdSpy = jest.spyOn(rpService, 'postIdApplication').mockImplementation()
    await request(app)
      .post('/finance-and-id/id-submit')
      .send({
        idType: 'Biometric residence permit',
        applicationSubmittedDate: '2000-10-12T00:00:00.000Z',
        prisonerNumber: '789',
        isPriorityApplication: false,
        costOfApplication: '10',
      })
      .expect(302)
      .expect(res => expect(res.text).toMatchSnapshot())
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id/?prisonerNumber=789#id'))
    expect(submitIdSpy).toHaveBeenCalledWith('789', {
      applicationSubmittedDate: '2000-10-12T01:00:00',
      caseNumber: undefined,
      costOfApplication: 10,
      countryBornIn: undefined,
      courtDetails: undefined,
      driversLicenceApplicationMadeAt: undefined,
      driversLicenceType: undefined,
      haveGro: undefined,
      idType: 'Biometric residence permit',
      isPriorityApplication: false,
      isUkNationalBornOverseas: undefined,
    })
  })
  it('Happy path - post ID submit deed poll certificate', async () => {
    const submitIdSpy = jest.spyOn(rpService, 'postIdApplication').mockImplementation()
    await request(app)
      .post('/finance-and-id/id-submit')
      .send({
        idType: 'Deed poll certificate',
        applicationSubmittedDate: '2000-10-12T00:00:00.000Z',
        prisonerNumber: '789',
        isPriorityApplication: true,
        costOfApplication: '10',
      })
      .expect(302)
      .expect(res => expect(res.text).toMatchSnapshot())
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id/?prisonerNumber=789#id'))
    expect(submitIdSpy).toHaveBeenCalledWith('789', {
      applicationSubmittedDate: '2000-10-12T01:00:00',
      caseNumber: undefined,
      costOfApplication: 10,
      countryBornIn: undefined,
      courtDetails: undefined,
      driversLicenceApplicationMadeAt: undefined,
      driversLicenceType: undefined,
      haveGro: undefined,
      idType: 'Deed poll certificate',
      isPriorityApplication: true,
      isUkNationalBornOverseas: undefined,
    })
  })
  it('Happy path - post ID submit national insurance number letter', async () => {
    const submitIdSpy = jest.spyOn(rpService, 'postIdApplication').mockImplementation()
    await request(app)
      .post('/finance-and-id/id-submit')
      .send({
        idType: 'National Insurance Number letter',
        applicationSubmittedDate: '2000-10-12T00:00:00.000Z',
        prisonerNumber: '789',
        isPriorityApplication: true,
        costOfApplication: '10',
      })
      .expect(302)
      .expect(res => expect(res.text).toMatchSnapshot())
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id/?prisonerNumber=789#id'))
    expect(submitIdSpy).toHaveBeenCalledWith('789', {
      applicationSubmittedDate: '2000-10-12T01:00:00',
      caseNumber: undefined,
      costOfApplication: 10,
      countryBornIn: undefined,
      courtDetails: undefined,
      driversLicenceApplicationMadeAt: undefined,
      driversLicenceType: undefined,
      haveGro: undefined,
      idType: 'National Insurance Number letter',
      isPriorityApplication: true,
      isUkNationalBornOverseas: undefined,
    })
  })
  it('Happy path - post ID update marriage certificate - accepted', async () => {
    const updateIdSpy = jest.spyOn(rpService, 'patchIdApplication').mockImplementation()
    await request(app)
      .post('/finance-and-id/id-update')
      .send({
        updatedStatus: 'Accepted',
        dateIdReceived: '2000-12-01T00:00:00.000Z',
        addedToPersonalItemsDate: '2000-12-01T00:00:00.000Z',
        isAddedToPersonalItems: true,
        prisonerNumber: '123',
        applicationId: '1',
        idType: 'Marriage certificate',
      })
      .expect(302)
      .expect(res => expect(res.text).toMatchSnapshot())
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /finance-and-id/?prisonerNumber=123#id'))
    expect(updateIdSpy).toHaveBeenCalledWith('123', '1', {
      addedToPersonalItemsDate: '2000-12-01T00:00:00',
      dateIdReceived: '2000-12-01T00:00:00',
      isAddedToPersonalItems: true,
      refundAmount: NaN,
      status: 'Accepted',
      statusUpdateDate: null,
    })
  })
})
