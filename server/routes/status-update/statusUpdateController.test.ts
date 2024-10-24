import type { Express } from 'express'
import request from 'supertest'
import NodeClient from 'applicationinsights/out/Library/NodeClient'
import RpService from '../../services/rpService'
import Config from '../../s3Config'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes } from '../testutils/appSetup'
import { stubPrisonerDetails } from '../testutils/testUtils'

let app: Express
let rpService: jest.Mocked<RpService>
let appInsightsClient: jest.Mocked<NodeClient>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>
  jest.mock('applicationinsights', () => jest.fn())
  appInsightsClient = new NodeClient('setupString') as jest.Mocked<NodeClient>
  configHelper(config)

  app = appWithAllRoutes({
    services: {
      rpService,
      appInsightsClient,
    },
  })

  stubPrisonerDetails(rpService)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('getStatusUpdate', () => {
  it('happy path - render page', async () => {
    await request(app)
      .get('/status-update?prisonerNumber=123&selectedPathway=accommodation')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('error case - missing prisonerNumber', async () => {
    await request(app)
      .get('/status-update?selectedPathway=accommodation')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('error case - missing selectedPathway', async () => {
    await request(app)
      .get('/status-update?prisonerNumber=123')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('error case - pathway does not exist', async () => {
    await request(app)
      .get('/status-update?prisonerNumber=123&selectedPathway=NOT_A_PATHWAY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})

describe('postStatusUpdate', () => {
  it('happy path - redirect back to overview', async () => {
    const patchStatusWithCaseNoteSpy = jest.spyOn(rpService, 'patchStatusWithCaseNote').mockImplementation()
    const trackEventSpy = jest.spyOn(appInsightsClient, 'trackEvent').mockImplementation()
    const flushSpy = jest.spyOn(appInsightsClient, 'flush').mockImplementation()
    await request(app)
      .post('/status-update')
      .send({
        prisonerNumber: '123',
        selectedStatus: 'DONE',
        selectedPathway: 'accommodation',
        caseNoteInput_DONE: 'This is my case note text',
      })
      .expect(302)
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /accommodation?prisonerNumber=123#case-notes'))

    expect(patchStatusWithCaseNoteSpy).toHaveBeenCalledWith('123', {
      pathway: 'ACCOMMODATION',
      status: 'DONE',
      caseNoteText: 'Resettlement status set to: Done. This is my case note text',
    })
    expect(trackEventSpy).toHaveBeenCalledWith({
      name: 'PSFR_StatusUpdate',
      properties: {
        newStatus: 'DONE',
        oldStatus: 'IN_PROGRESS',
        pathway: 'ACCOMMODATION',
        prisonerId: '123',
        sessionId: 'sessionId',
        username: 'user1',
      },
    })
    expect(flushSpy).toHaveBeenCalled()
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
        prisonerNumber: '123',
        selectedPathway: 'accommodation',
        caseNoteInput_DONE: 'This is my case note text',
      })
      .expect(302)
      .expect(res =>
        expect(res.text).toEqual(
          'Found. Redirecting to /status-update?prisonerNumber=123&selectedPathway=accommodation',
        ),
      )
  })

  it('error case - invalid status', async () => {
    await request(app)
      .post('/status-update')
      .send({
        prisonerNumber: '123',
        selectedStatus: 'NOT_A_STATUS',
        selectedPathway: 'accommodation',
        caseNoteInput_DONE: 'This is my case note text',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('error case - missing pathway', async () => {
    await request(app)
      .post('/status-update')
      .send({
        prisonerNumber: '123',
        selectedStatus: 'DONE',
        caseNoteInput_DONE: 'This is my case note text',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('error case - invalid pathway', async () => {
    await request(app)
      .post('/status-update')
      .send({
        prisonerNumber: '123',
        selectedStatus: 'DONE',
        selectedPathway: 'not a pathway',
        caseNoteInput_DONE: 'This is my case note text',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('error thrown during patch operation', async () => {
    const patchStatusWithCaseNoteSpy = jest
      .spyOn(rpService, 'patchStatusWithCaseNote')
      .mockRejectedValue(new Error('Something went wrong'))
    await request(app)
      .post('/status-update')
      .send({
        prisonerNumber: '123',
        selectedStatus: 'DONE',
        selectedPathway: 'accommodation',
        caseNoteInput_DONE: 'This is my case note text',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(patchStatusWithCaseNoteSpy).toHaveBeenCalledWith('123', {
      pathway: 'ACCOMMODATION',
      status: 'DONE',
      caseNoteText: 'Resettlement status set to: Done. This is my case note text',
    })
  })
})
