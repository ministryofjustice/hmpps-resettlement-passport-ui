import request from 'supertest'
import type { Express } from 'express'
import { validateAssessmentSkipForm } from './assessmentSkipController'
import Config from '../../s3Config'
import { stubPrisonerDetails } from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'

let app: Express
const { rpService } = mockedServices
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  jest.mock('applicationinsights', () => jest.fn())
  configHelper(config)

  app = appWithAllRoutes({})
  stubPrisonerDetails(rpService)
})
afterEach(() => {
  jest.resetAllMocks()
})
describe('getView', () => {
  it('Happy path with default query params', async () => {
    await request(app)
      .get('/assessment-skip?prisonerNumber=123')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})

describe('submitForm', () => {
  it('Happy path with default inputs', async () => {
    const postAssessmentSkipSpy = jest.spyOn(rpService, 'postAssessmentSkip').mockImplementation()
    const service = {
      whySkipChoice: 'EARLY_RELEASE',
      supportingInfo: 'Some Info',
      prisonerNumber: '123',
    }
    await request(app)
      .post('/assessment-skip?prisonerNumber=123')
      .send(service)
      .expect(302)
      .expect(res =>
        expect(res.headers.location).toEqual('/assessment-task-list?prisonerNumber=123&type=RESETTLEMENT_PLAN'),
      )

    expect(postAssessmentSkipSpy).toHaveBeenCalledWith('123', {
      reason: 'EARLY_RELEASE',
      moreInfo: 'Some Info',
    })
  })
})

describe('submitForm validation', () => {
  it('Validates  input', async () => {
    const service = {
      supportingInfo: 'Some Info',
      prisonerNumber: '123',
    }
    await request(app)
      .post('/assessment-skip?prisonerNumber=123')
      .send(service)
      .expect(302)
      .expect(res => expect(res.headers.location).toContain('validationErrors'))
  })
})

describe('validateAssessmentSkipForm', () => {
  it.each(['COMPLETED_IN_OASYS', 'COMPLETED_IN_ANOTHER_PRISON', 'EARLY_RELEASE', 'TRANSFER', 'OTHER'])(
    'Returns null on a valid form where %s is chosen',
    choice => {
      expect(validateAssessmentSkipForm({ whySkipChoice: choice })).toBeNull()
    },
  )
})

it('gives an error for missing whySkipChoice', () => {
  expect(validateAssessmentSkipForm({ somethingElse: 'earlyRelease' })).toEqual({
    whySkipChoice: 'This field is required',
  })
})

it('gives an error for unexpected whySkipChoice', () => {
  expect(validateAssessmentSkipForm({ whySkipChoice: 'potato' })).toEqual({
    whySkipChoice: 'This field is required',
  })
})

it('gives an error for empty', () => {
  expect(validateAssessmentSkipForm({})).toEqual({
    whySkipChoice: 'This field is required',
  })
})
