import type { Express } from 'express'
import request from 'supertest'
import Config from '../../s3Config'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import {
  expectPrisonerNotFoundPage,
  expectSomethingWentWrongPage,
  stubFeatureFlagToFalse,
  stubFeatureFlagToTrue,
  stubPrisonerDetails,
} from '../testutils/testUtils'
import { Services } from '../../services'
import FeatureFlags from '../../featureFlag'

let app: Express
const { rpService, appInsightsService } = mockedServices as Services
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>

beforeEach(() => {
  jest.mock('applicationinsights', () => jest.fn())
  configHelper(config)

  app = appWithAllRoutes({})
  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)
  stubFeatureFlagToFalse(featureFlags)
  stubFeatureFlagToTrue(featureFlags, ['whatsNewBanner'])
  stubPrisonerDetails(rpService)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('getStatusUpdate', () => {
  it('happy path - render page', async () => {
    await request(app)
      .get('/status-update?prisonerNumber=A1234DY&selectedPathway=accommodation')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('error case - missing prisonerNumber', async () => {
    await request(app)
      .get('/status-update?selectedPathway=accommodation')
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })

  it('error case - missing selectedPathway', async () => {
    await request(app)
      .get('/status-update?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('error case - pathway does not exist', async () => {
    await request(app)
      .get('/status-update?prisonerNumber=A1234DY&selectedPathway=NOT_A_PATHWAY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('support needs flag is set to true - redirects to pathway page', async () => {
    stubFeatureFlagToTrue(featureFlags, ['supportNeeds'])

    await request(app)
      .get('/status-update?prisonerNumber=A1234DY&selectedPathway=accommodation')
      .expect(302)
      .expect('Location', '/accommodation/?prisonerNumber=A1234DY')
  })
})

describe('postStatusUpdate', () => {
  it('happy path - redirect back to overview', async () => {
    const patchStatusWithCaseNoteSpy = jest.spyOn(rpService, 'patchStatusWithCaseNote').mockImplementation()
    const trackEventSpy = jest.spyOn(appInsightsService, 'trackEvent').mockImplementation()
    await request(app)
      .post('/status-update')
      .send({
        prisonerNumber: 'A1234DY',
        selectedStatus: 'DONE',
        selectedPathway: 'accommodation',
        caseNoteInput_DONE: 'This is my case note text',
      })
      .expect(302)
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /accommodation?prisonerNumber=A1234DY#case-notes'))

    expect(patchStatusWithCaseNoteSpy).toHaveBeenCalledWith('A1234DY', {
      pathway: 'ACCOMMODATION',
      status: 'DONE',
      caseNoteText: 'Resettlement status set to: Done. This is my case note text',
    })
    expect(trackEventSpy).toHaveBeenCalledWith('PSFR_StatusUpdate', {
      newStatus: 'DONE',
      oldStatus: 'IN_PROGRESS',
      pathway: 'ACCOMMODATION',
      prisonerId: 'A1234DY',
      sessionId: 'sessionId',
      username: 'user1',
    })
  })

  it('error case - missing prisonerNumber', async () => {
    await request(app)
      .post('/status-update')
      .send({
        selectedStatus: 'DONE',
        selectedPathway: 'accommodation',
        caseNoteInput_DONE: 'This is my case note text',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Missing status redirects back to form', async () => {
    await request(app)
      .post('/status-update')
      .send({
        prisonerNumber: 'A1234DY',
        selectedPathway: 'accommodation',
        caseNoteInput_DONE: 'This is my case note text',
      })
      .expect(302)
      .expect(res =>
        expect(res.text).toEqual(
          'Found. Redirecting to /status-update?prisonerNumber=A1234DY&selectedPathway=accommodation',
        ),
      )
  })

  it('error case - invalid status', async () => {
    await request(app)
      .post('/status-update')
      .send({
        prisonerNumber: 'A1234DY',
        selectedStatus: 'NOT_A_STATUS',
        selectedPathway: 'accommodation',
        caseNoteInput_DONE: 'This is my case note text',
      })
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('error case - missing pathway', async () => {
    await request(app)
      .post('/status-update')
      .send({
        prisonerNumber: 'A1234DY',
        selectedStatus: 'DONE',
        caseNoteInput_DONE: 'This is my case note text',
      })
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('error case - invalid pathway', async () => {
    await request(app)
      .post('/status-update')
      .send({
        prisonerNumber: 'A1234DY',
        selectedStatus: 'DONE',
        selectedPathway: 'not a pathway',
        caseNoteInput_DONE: 'This is my case note text',
      })
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('error thrown during patch operation', async () => {
    const patchStatusWithCaseNoteSpy = jest
      .spyOn(rpService, 'patchStatusWithCaseNote')
      .mockRejectedValue(new Error('Something went wrong'))
    await request(app)
      .post('/status-update')
      .send({
        prisonerNumber: 'A1234DY',
        selectedStatus: 'DONE',
        selectedPathway: 'accommodation',
        caseNoteInput_DONE: 'This is my case note text',
      })
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))

    expect(patchStatusWithCaseNoteSpy).toHaveBeenCalledWith('A1234DY', {
      pathway: 'ACCOMMODATION',
      status: 'DONE',
      caseNoteText: 'Resettlement status set to: Done. This is my case note text',
    })
  })

  it('error thrown if support needs flag is set to true', async () => {
    stubFeatureFlagToTrue(featureFlags, ['supportNeeds'])

    await request(app)
      .post('/status-update')
      .send({
        prisonerNumber: 'A1234DY',
        selectedStatus: 'DONE',
        selectedPathway: 'accommodation',
        caseNoteInput_DONE: 'This is my case note text',
      })
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
  })
})
