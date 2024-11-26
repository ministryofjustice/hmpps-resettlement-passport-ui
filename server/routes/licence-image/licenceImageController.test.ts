import request from 'supertest'
import type { Express } from 'express'
import Config from '../../s3Config'
import { expectSomethingWentWrongPage, stubPrisonerDetails } from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'

let app: Express
const { rpService } = mockedServices
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  configHelper(config)
  stubPrisonerDetails(rpService)

  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('getView', () => {
  it('Happy path', async () => {
    const rpServiceSpy = jest.spyOn(rpService, 'getLicenceConditionImage').mockResolvedValue(getMockBase64Image())
    const prisonerNumber = 'A1234DY'
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
    const prisonerNumber = 'A1234DY'
    const licenceId = '1'
    const conditionId = '2'

    await request(app)
      .get(`/licence-image/?licenceId=${licenceId}&conditionId=${conditionId}&prisonerNumber=${prisonerNumber}`)
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
  })
  it('Not found Error from RpService', async () => {
    const error = new Error('not found') as Error & { status?: number; customMessage?: string }
    error.status = 404

    jest.spyOn(rpService, 'getLicenceConditionImage').mockRejectedValue(error)
    const prisonerNumber = 'A1234DY'
    const licenceId = '1'
    const conditionId = '2'

    await request(app)
      .get(`/licence-image/?licenceId=${licenceId}&conditionId=${conditionId}&prisonerNumber=${prisonerNumber}`)
      .expect(404)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it.each([
    ['Missing licence id', { conditionId: '202' }],
    ['Missing condition id', { licenceId: '3' }],
    ['Path in licence id', { licenceId: '/something/we/dont/want', conditionId: '202' }],
    ['Path in condition id', { licenceId: '4', condition: '56/stuff' }],
  ])('bad request error case - %s', async (_, params) => {
    await request(app)
      .get('/licence-image')
      .query({ ...params, prisonerNumber: 'A1234DY' })
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })
})

function getMockBase64Image(): string {
  return (
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHx' +
    'gljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
  )
}
