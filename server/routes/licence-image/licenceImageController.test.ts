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
      .expect(res => expect(res.text).toMatchSnapshot)

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
      .expect(res => expect(res.text).toMatchSnapshot)
  })
  // it('Not found Error from RpService', async () => {
  //   jest.spyOn(rpService, 'getLicenceConditionImage').mockRejectedValue(new Error('Something went wrong'))
  //   const prisonerNumber = '123'
  //   const licenceId = '1'
  //   const conditionId = '2'
  //
  //   await request(app)
  //     .get(`/licence-image/?licenceId=${licenceId}&conditionId=${conditionId}&prisonerNumber=${prisonerNumber}`)
  //     .expect(404)
  //     .expect(res => expect(res.text).toMatchSnapshot)
  // })
})

function getMockBase64Image(): string {
  return (
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHx' +
    'gljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
  )
}

// describe('submitForm', () => {
//   it('Happy path with default inputs', async () => {
//     const postAssessmentSkipSpy = jest.spyOn(rpService, 'postAssessmentSkip').mockImplementation()
//     const service = {
//       whySkipChoice: 'EARLY_RELEASE',
//       supportingInfo: 'Some Info',
//       prisonerNumber: '123',
//     }
//     await request(app)
//       .post('/assessment-skip?prisonerNumber=123')
//       .send(service)
//       .expect(302)
//       .expect(res =>
//         expect(res.headers.location).toEqual('/assessment-task-list?prisonerNumber=123&type=RESETTLEMENT_PLAN'),
//       )
//
//     expect(postAssessmentSkipSpy).toHaveBeenCalledWith('123', {
//       reason: 'EARLY_RELEASE',
//       moreInfo: 'Some Info',
//     })
//   })
// })
//
// describe('submitForm validation', () => {
//   it('Validates  input', async () => {
//     const service = {
//       supportingInfo: 'Some Info',
//       prisonerNumber: '123',
//     }
//     await request(app)
//       .post('/assessment-skip?prisonerNumber=123')
//       .send(service)
//       .expect(302)
//       .expect(res => expect(res.headers.location).toContain('validationErrors'))
//   })
// })
//
// describe('validateAssessmentSkipForm', () => {
//   it.each(['COMPLETED_IN_OASYS', 'COMPLETED_IN_ANOTHER_PRISON', 'EARLY_RELEASE', 'TRANSFER', 'OTHER'])(
//     'Returns null on a valid form where %s is chosen',
//     choice => {
//       expect(validateAssessmentSkipForm({ whySkipChoice: choice })).toBeNull()
//     },
//   )
// })
//
// it('gives an error for missing whySkipChoice', () => {
//   expect(validateAssessmentSkipForm({ somethingElse: 'earlyRelease' })).toEqual({
//     whySkipChoice: 'This field is required',
//   })
// })
//
// it('gives an error for unexpected whySkipChoice', () => {
//   expect(validateAssessmentSkipForm({ whySkipChoice: 'potato' })).toEqual({
//     whySkipChoice: 'This field is required',
//   })
// })
//
// it('gives an error for empty', () => {
//   expect(validateAssessmentSkipForm({})).toEqual({
//     whySkipChoice: 'This field is required',
//   })
// })
