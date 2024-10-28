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
  it('Submit empty ID application form', async () => {
    await request(app)
      .get(
        '/finance-and-id/add-an-id-further/?idType=&applicationSubmittedDay=&applicationSubmittedMonth=&applicationSubmittedYear=&prisonerNumber=A8731DY&isPriorityApplication=&costOfApplication=&driversLicenceApplicationMadeAt=&driversLicenceType=&courtDetails=&caseNumber=&isUkNationalBornOverseas=&countryBornIn=&haveGro=&existingIdTypes=',
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})
