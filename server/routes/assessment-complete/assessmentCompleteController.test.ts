import type { Express } from 'express'
import request from 'supertest'
import NodeClient from 'applicationinsights/out/Library/NodeClient'
import RpService from '../../services/rpService'
import { appWithAllRoutes } from '../testutils/appSetup'
import { stubPrisonerDetails } from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import Config from '../../s3Config'
import { AssessmentStateService } from '../../data/assessmentStateService'
import { PATHWAY_DICTIONARY } from '../../utils/constants'
import { PrisonerData } from '../../@types/express'

let app: Express
let rpService: jest.Mocked<RpService>
let assessmentStateService: jest.Mocked<AssessmentStateService>
let appInsightsClient: jest.Mocked<NodeClient>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>
  assessmentStateService = new AssessmentStateService(null) as jest.Mocked<AssessmentStateService>
  appInsightsClient = new NodeClient('setupString') as jest.Mocked<NodeClient>
  stubPrisonerDetails(rpService)
  configHelper(config)

  app = appWithAllRoutes({
    services: {
      rpService,
      assessmentStateService,
      appInsightsClient,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('getView', () => {
  it('Happy path', async () => {
    await request(app)
      .get('/assessment-complete?prisonerNumber=A1234DY&type=BCST2')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Error case - missing prisonerNumber', async () => {
    await request(app)
      .get('/assessment-complete?type=BCST2')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Error case - missing type', async () => {
    await request(app)
      .get('/assessment-complete?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Error case - incorrect type', async () => {
    await request(app)
      .get('/assessment-complete?prisonerNumber=A1234DY&type=NOT_A_TYPE')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})

describe('postView', () => {
  it('Happy path - should redirect back to assessment complete page', async () => {
    jest.spyOn(rpService, 'getPrisonerDetails').mockResolvedValueOnce({
      personalDetails: {
        prisonerNumber: 'A1234DY',
        prisonId: 'MDI',
        facialImageId: '456',
        firstName: 'John',
        lastName: 'Smith',
        releaseDate: null,
        dateOfBirth: null,
      },
      pathways: [
        {
          pathway: 'ACCOMMODATION',
          status: 'IN_PROGRESS',
        },
        {
          pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
          status: 'IN_PROGRESS',
        },
        {
          pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
          status: 'IN_PROGRESS',
        },
        {
          pathway: 'DRUGS_AND_ALCOHOL',
          status: 'IN_PROGRESS',
        },
        {
          pathway: 'EDUCATION_SKILLS_AND_WORK',
          status: 'IN_PROGRESS',
        },
        {
          pathway: 'FINANCE_AND_ID',
          status: 'IN_PROGRESS',
        },
        {
          pathway: 'HEALTH',
          status: 'IN_PROGRESS',
        },
      ],
    } as PrisonerData)
    jest.spyOn(rpService, 'getPrisonerDetails').mockResolvedValueOnce({
      personalDetails: {
        prisonerNumber: 'A1234DY',
        prisonId: 'MDI',
        facialImageId: '456',
        firstName: 'John',
        lastName: 'Smith',
        releaseDate: null,
        dateOfBirth: null,
      },
      pathways: [
        {
          pathway: 'ACCOMMODATION',
          status: 'SUPPORT_REQUIRED',
        },
        {
          pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
          status: 'SUPPORT_REQUIRED',
        },
        {
          pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
          status: 'SUPPORT_REQUIRED',
        },
        {
          pathway: 'DRUGS_AND_ALCOHOL',
          status: 'SUPPORT_REQUIRED',
        },
        {
          pathway: 'EDUCATION_SKILLS_AND_WORK',
          status: 'SUPPORT_REQUIRED',
        },
        {
          pathway: 'FINANCE_AND_ID',
          status: 'SUPPORT_REQUIRED',
        },
        {
          pathway: 'HEALTH',
          status: 'SUPPORT_REQUIRED',
        },
      ],
    } as PrisonerData)
    const submitAssessmentSpy = jest.spyOn(rpService, 'submitAssessment').mockResolvedValue({})
    const onCompleteSpy = jest.spyOn(assessmentStateService, 'onComplete').mockImplementation()
    const trackEventSpy = jest.spyOn(appInsightsClient, 'trackEvent').mockImplementation()
    const flushSpy = jest.spyOn(appInsightsClient, 'flush').mockImplementation()

    await request(app)
      .post('/assessment-complete')
      .send({
        prisonerNumber: 'A1234DY',
        assessmentType: 'BCST2',
      })
      .expect(302)
      .expect(res =>
        expect(res.text).toEqual('Found. Redirecting to /assessment-complete?prisonerNumber=A1234DY&type=BCST2'),
      )
    expect(submitAssessmentSpy).toHaveBeenCalledWith('A1234DY', 'BCST2')
    expect(onCompleteSpy).toHaveBeenNthCalledWith(1, {
      assessmentType: 'BCST2',
      pathway: 'ACCOMMODATION',
      prisonerNumber: 'A1234DY',
      userId: 'user1',
    })
    expect(onCompleteSpy).toHaveBeenNthCalledWith(2, {
      assessmentType: 'BCST2',
      pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
      prisonerNumber: 'A1234DY',
      userId: 'user1',
    })
    expect(onCompleteSpy).toHaveBeenNthCalledWith(3, {
      assessmentType: 'BCST2',
      pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
      prisonerNumber: 'A1234DY',
      userId: 'user1',
    })
    expect(onCompleteSpy).toHaveBeenNthCalledWith(4, {
      assessmentType: 'BCST2',
      pathway: 'DRUGS_AND_ALCOHOL',
      prisonerNumber: 'A1234DY',
      userId: 'user1',
    })
    expect(onCompleteSpy).toHaveBeenNthCalledWith(5, {
      assessmentType: 'BCST2',
      pathway: 'EDUCATION_SKILLS_AND_WORK',
      prisonerNumber: 'A1234DY',
      userId: 'user1',
    })
    expect(onCompleteSpy).toHaveBeenNthCalledWith(6, {
      assessmentType: 'BCST2',
      pathway: 'FINANCE_AND_ID',
      prisonerNumber: 'A1234DY',
      userId: 'user1',
    })
    expect(onCompleteSpy).toHaveBeenNthCalledWith(7, {
      assessmentType: 'BCST2',
      pathway: 'HEALTH',
      prisonerNumber: 'A1234DY',
      userId: 'user1',
    })
    Object.entries(PATHWAY_DICTIONARY).forEach(([pathway]) => {
      expect(trackEventSpy).toHaveBeenCalledWith({
        name: 'PSFR_ReportSubmittedStatusUpdate',
        properties: {
          newStatus: 'SUPPORT_REQUIRED',
          oldStatus: 'IN_PROGRESS',
          pathway,
          prisonerId: 'A1234DY',
          sessionId: 'sessionId',
          username: 'user1',
        },
      })
    })
    expect(flushSpy).toHaveBeenCalledTimes(7)
  })

  it('Error case - missing prisonerNumber', async () => {
    const trackEventSpy = jest.spyOn(appInsightsClient, 'trackEvent').mockImplementation()
    const flushSpy = jest.spyOn(appInsightsClient, 'flush').mockImplementation()

    await request(app)
      .post('/assessment-complete')
      .send({
        assessmentType: 'BCST2',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(trackEventSpy).toHaveBeenCalledTimes(0)
    expect(flushSpy).toHaveBeenCalledTimes(0)
  })

  it('Error case - missing assessmentType', async () => {
    const trackEventSpy = jest.spyOn(appInsightsClient, 'trackEvent').mockImplementation()
    const flushSpy = jest.spyOn(appInsightsClient, 'flush').mockImplementation()

    await request(app)
      .post('/assessment-complete')
      .send({
        prisonerNumber: 'A1234DY',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(trackEventSpy).toHaveBeenCalledTimes(0)
    expect(flushSpy).toHaveBeenCalledTimes(0)
  })

  it('Error case - incorrect assessmentType', async () => {
    const trackEventSpy = jest.spyOn(appInsightsClient, 'trackEvent').mockImplementation()
    const flushSpy = jest.spyOn(appInsightsClient, 'flush').mockImplementation()

    await request(app)
      .post('/assessment-complete')
      .send({
        prisonerNumber: 'A1234DY',
        assessmentType: 'NOT_A_TYPE',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(trackEventSpy).toHaveBeenCalledTimes(0)
    expect(flushSpy).toHaveBeenCalledTimes(0)
  })

  it('Error case - error returned from API', async () => {
    const trackEventSpy = jest.spyOn(appInsightsClient, 'trackEvent').mockImplementation()
    const flushSpy = jest.spyOn(appInsightsClient, 'flush').mockImplementation()

    const submitAssessmentSpy = jest.spyOn(rpService, 'submitAssessment').mockResolvedValue({ error: true })
    await request(app)
      .post('/assessment-complete')
      .send({
        prisonerNumber: 'A1234DY',
        assessmentType: 'BCST2',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(submitAssessmentSpy).toHaveBeenCalledWith('A1234DY', 'BCST2')
    expect(trackEventSpy).toHaveBeenCalledTimes(0)
    expect(flushSpy).toHaveBeenCalledTimes(0)
  })

  it('Error case - error thrown from API call', async () => {
    const trackEventSpy = jest.spyOn(appInsightsClient, 'trackEvent').mockImplementation()
    const flushSpy = jest.spyOn(appInsightsClient, 'flush').mockImplementation()

    const submitAssessmentSpy = jest
      .spyOn(rpService, 'submitAssessment')
      .mockRejectedValue(new Error('Something went wrong'))
    await request(app)
      .post('/assessment-complete')
      .send({
        prisonerNumber: 'A1234DY',
        assessmentType: 'BCST2',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(submitAssessmentSpy).toHaveBeenCalledWith('A1234DY', 'BCST2')
    expect(trackEventSpy).toHaveBeenCalledTimes(0)
    expect(flushSpy).toHaveBeenCalledTimes(0)
  })
})
