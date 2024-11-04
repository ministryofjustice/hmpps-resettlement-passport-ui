import request from 'supertest'
import type { Express } from 'express'
import RpService from '../../services/rpService'
import Config from '../../s3Config'
import { stubPrisonerDetails } from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes } from '../testutils/appSetup'

let app: Express
let rpService: jest.Mocked<RpService>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>
  configHelper(config)
  stubPrisonerDetails(rpService)

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
  it('Happy path', async () => {
    const rpServiceSpy = jest.spyOn(rpService, 'getLicenceConditionImage').mockResolvedValue(getMockBase64Image())
    const prisonerNumber = '123'
    const licenceId = '1'
    const conditionId = '2'

    await request(app)
      .get(`/licence-image/?licenceId=${licenceId}&conditionId=${conditionId}&prisonerNumber=${prisonerNumber}`)
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(rpServiceSpy).toHaveBeenCalledWith(prisonerNumber, licenceId, conditionId)
  })
  it('Error from RpService', async () => {
    jest.spyOn(rpService, 'getLicenceConditionImage').mockRejectedValue(new Error('Something went wrong'))
    const prisonerNumber = '123'
    const licenceId = '1'
    const conditionId = '2'

    await request(app)
      .get(`/licence-image/?licenceId=${licenceId}&conditionId=${conditionId}&prisonerNumber=${prisonerNumber}`)
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
  it('Not found Error from RpService', async () => {
    const error = new Error('not found') as Error & { status?: number }
    error.status = 404
    jest.spyOn(rpService, 'getLicenceConditionImage').mockRejectedValue(error)
    const prisonerNumber = '123'
    const licenceId = '1'
    const conditionId = '2'

    await request(app)
      .get(`/licence-image/?licenceId=${licenceId}&conditionId=${conditionId}&prisonerNumber=${prisonerNumber}`)
      .expect(404)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})

function getMockBase64Image(): string {
  return (
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHx' +
    'gljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
  )
}
