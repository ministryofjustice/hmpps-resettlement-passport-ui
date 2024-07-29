import type { Express } from 'express'
import request from 'supertest'
import { PersonalDetails, PrisonerData } from '../../@types/express/index.d'
import { appWithAllRoutes } from '../testutils/appSetup'

import RpService from '../../services/rpService'
import { AssessmentStateService } from '../../data/assessmentStateService'
import { SubmittedInput } from '../../data/model/immediateNeedsReport'
import Config from '../../s3Config'
import { configHelper } from '../configHelperTest'

let app: Express
let rpService: jest.Mocked<RpService>
let assessmentStateService: jest.Mocked<AssessmentStateService>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>
  assessmentStateService = new AssessmentStateService(null) as jest.Mocked<AssessmentStateService>
  configHelper(config)

  app = appWithAllRoutes({
    services: {
      rpService,
      assessmentStateService,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('completeAssessment', () => {
  function stubPrisonerDetails() {
    jest.spyOn(rpService, 'getPrisonerDetails').mockResolvedValue({
      personalDetails: {
        prisonerNumber: '123',
        facialImageId: '456',
      } as unknown as PersonalDetails,
    } as unknown as PrisonerData)
  }

  it('should submit the assessment to the backend then redirect to the task list', async () => {
    stubPrisonerDetails()

    const submission: SubmittedInput = {
      questionsAndAnswers: [
        {
          question: '1',
          answer: { answer: 'YES', '@class': 'StringAnswer', displayText: 'Yes' },
          pageId: 'page1',
          questionTitle: 'question',
          questionType: 'RADIO',
        },
      ],
      version: null,
    }
    jest.spyOn(assessmentStateService, 'prepareSubmission').mockResolvedValue(submission)

    const completeAssessmentSpy = jest.spyOn(rpService, 'completeAssessment').mockResolvedValue({})
    jest.spyOn(assessmentStateService, 'onComplete').mockImplementation()

    await request(app)
      .post('/ImmediateNeedsReport/pathway/DRUGS_AND_ALCOHOL/complete?prisonerNumber=123')
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /assessment-task-list?prisonerNumber=123&type=BCST2')
      })

    expect(completeAssessmentSpy).toHaveBeenCalledWith('123', 'DRUGS_AND_ALCOHOL', submission, 'BCST2')
  })

  it('it should not submit the assessment if there is no submitted input', async () => {
    stubPrisonerDetails()

    jest
      .spyOn(assessmentStateService, 'prepareSubmission')
      .mockResolvedValue({ questionsAndAnswers: [], version: null })

    const completeAssessmentSpy = jest.spyOn(rpService, 'completeAssessment').mockResolvedValue({})

    await request(app)
      .post('/ImmediateNeedsReport/pathway/DRUGS_AND_ALCOHOL/complete?prisonerNumber=123')
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /assessment-task-list?prisonerNumber=123&type=BCST2')
      })

    expect(completeAssessmentSpy).toHaveBeenCalledTimes(0)
  })
})
