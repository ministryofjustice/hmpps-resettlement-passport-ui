import { Request } from 'express'
import { AssessmentStateService } from './assessmentStateService'
import AssessmentStore from './assessmentStore'
import { createRedisClient } from './redisClient'
import { SubmittedInput } from './model/BCST2Form'

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

  describe('answer', () => {
    it('when no questions have been answered', async () => {
      const spy = jest.spyOn(store, 'setAssessment')
      const answer: SubmittedInput = {
        questionsAndAnswers: [
          {
            question: 'WHERE_WILL_THEY_LIVE_2',
            questionTitle: 'Where will the person in prison live when they are released?',
            questionType: 'RADIO',
            pageId: 'WHERE_WILL_THEY_LIVE_2',
            answer: {
              answer: 'DOES_NOT_HAVE_ANYWHERE',
              displayText: 'Does not have anywhere to live',
              '@class': 'StringAnswer',
            },
          },
        ],
      }
      store.getAssessment.mockResolvedValueOnce({ questionsAndAnswers: [] })

      await assessmentStateService.answer(aRequest(), 'ACCOMMODATION', answer)

      expect(spy).toHaveBeenCalledWith('sessionId', '123', 'ACCOMMODATION', answer)
    })

    it('should add an answer to a question that has not been answered before', async () => {
      const spy = jest.spyOn(store, 'setAssessment')
      const answer: SubmittedInput = {
        questionsAndAnswers: [
          {
            question: 'WHERE_WILL_THEY_LIVE_2',
            questionTitle: 'Where will the person in prison live when they are released?',
            questionType: 'RADIO',
            pageId: 'WHERE_WILL_THEY_LIVE_2',
            answer: {
              answer: 'DOES_NOT_HAVE_ANYWHERE',
              displayText: 'Does not have anywhere to live',
              '@class': 'StringAnswer',
            },
          },
        ],
      }

      const existing: SubmittedInput = {
        questionsAndAnswers: [
          {
            question: 'WHERE_DID_THEY_LIVE',
            questionTitle: 'Where did the person in prison live before custody?',
            questionType: 'RADIO',
            pageId: 'WHERE_DID_THEY_LIVE',
            answer: {
              answer: 'NO_PERMANENT_OR_FIXED',
              displayText: 'No permanent or fixed address',
              '@class': 'StringAnswer',
            },
          },
        ],
      }

      store.getAssessment.mockResolvedValueOnce(existing)

      await assessmentStateService.answer(aRequest(), 'ACCOMMODATION', answer)

      const expected = {
        questionsAndAnswers: [
          {
            question: 'WHERE_DID_THEY_LIVE',
            questionTitle: 'Where did the person in prison live before custody?',
            questionType: 'RADIO',
            pageId: 'WHERE_DID_THEY_LIVE',
            answer: {
              answer: 'NO_PERMANENT_OR_FIXED',
              displayText: 'No permanent or fixed address',
              '@class': 'StringAnswer',
            },
          },
          {
            question: 'WHERE_WILL_THEY_LIVE_2',
            questionTitle: 'Where will the person in prison live when they are released?',
            questionType: 'RADIO',
            pageId: 'WHERE_WILL_THEY_LIVE_2',
            answer: {
              answer: 'DOES_NOT_HAVE_ANYWHERE',
              displayText: 'Does not have anywhere to live',
              '@class': 'StringAnswer',
            },
          },
        ],
      }

      expect(spy).toHaveBeenCalledWith('sessionId', '123', 'ACCOMMODATION', expected)
    })

    it('should replace an answer to a question that has been answered before', async () => {
      const spy = jest.spyOn(store, 'setAssessment')
      const answer: SubmittedInput = {
        questionsAndAnswers: [
          {
            question: 'WHERE_WILL_THEY_LIVE_2',
            questionTitle: 'Where will the person in prison live when they are released?',
            questionType: 'RADIO',
            pageId: 'WHERE_WILL_THEY_LIVE_2',
            answer: {
              answer: 'MOVE_TO_NEW_ADDRESS',
              displayText: 'Move to a new address',
              '@class': 'StringAnswer',
            },
          },
        ],
      }

      const existing: SubmittedInput = {
        questionsAndAnswers: [
          {
            question: 'WHERE_DID_THEY_LIVE',
            questionTitle: 'Where did the person in prison live before custody?',
            questionType: 'RADIO',
            pageId: 'WHERE_DID_THEY_LIVE',
            answer: {
              answer: 'NO_PERMANENT_OR_FIXED',
              displayText: 'No permanent or fixed address',
              '@class': 'StringAnswer',
            },
          },
          {
            question: 'WHERE_WILL_THEY_LIVE_2',
            questionTitle: 'Where will the person in prison live when they are released?',
            questionType: 'RADIO',
            pageId: 'WHERE_WILL_THEY_LIVE_2',
            answer: {
              answer: 'DOES_NOT_HAVE_ANYWHERE',
              displayText: 'Does not have anywhere to live',
              '@class': 'StringAnswer',
            },
          },
        ],
      }

      store.getAssessment.mockResolvedValueOnce(existing)

      await assessmentStateService.answer(aRequest(), 'ACCOMMODATION', answer)

      const expected = {
        questionsAndAnswers: [
          {
            question: 'WHERE_DID_THEY_LIVE',
            questionTitle: 'Where did the person in prison live before custody?',
            questionType: 'RADIO',
            pageId: 'WHERE_DID_THEY_LIVE',
            answer: {
              answer: 'NO_PERMANENT_OR_FIXED',
              displayText: 'No permanent or fixed address',
              '@class': 'StringAnswer',
            },
          },
          {
            question: 'WHERE_WILL_THEY_LIVE_2',
            questionTitle: 'Where will the person in prison live when they are released?',
            questionType: 'RADIO',
            pageId: 'WHERE_WILL_THEY_LIVE_2',
            answer: {
              answer: 'MOVE_TO_NEW_ADDRESS',
              displayText: 'Move to a new address',
              '@class': 'StringAnswer',
            },
          },
        ],
      }

      expect(spy).toHaveBeenCalledWith('sessionId', '123', 'ACCOMMODATION', expected)
    })
  })
})
