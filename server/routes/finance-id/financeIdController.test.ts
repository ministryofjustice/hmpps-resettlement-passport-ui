import type { Express } from 'express'
import request from 'supertest'
import RpService from '../../services/rpService'
import { appWithAllRoutes } from '../testutils/appSetup'
import { stubPrisonerDetails } from '../testutils/testUtils'
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
})
