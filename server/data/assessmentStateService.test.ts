import { Request } from 'express'
import { AssessmentStateService } from './assessmentStateService'
import AssessmentStore from './assessmentStore'
import { createRedisClient } from './redisClient'

jest.mock('./assessmentStore')

const sessionId = 'sessionId'
const prisonerNumber = '123'

describe('assessmentStateService', () => {
  let store: jest.Mocked<AssessmentStore>
  let assessmentStateService: AssessmentStateService

  beforeEach(() => {
    store = new AssessmentStore(createRedisClient()) as jest.Mocked<AssessmentStore>
    assessmentStateService = new AssessmentStateService(store as AssessmentStore)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  function aRequest(): Request {
    return {
      prisonerData: {
        personalDetails: {
          prisonerNumber,
        },
      },
      session: {
        id: sessionId,
      },
    } as Request
  }

  it('should reset state for a pathway', async () => {
    const pathway = 'HEALTH'
    await assessmentStateService.reset(aRequest(), pathway)

    expect(store.deleteAssessment).toHaveBeenCalledWith(sessionId, prisonerNumber, pathway)
    expect(store.deleteEditedQuestionList).toHaveBeenCalledWith(sessionId, prisonerNumber, pathway)
    expect(store.setAssessment).toHaveBeenCalledWith(sessionId, prisonerNumber, pathway, { questionsAndAnswers: [] })
  })
})
