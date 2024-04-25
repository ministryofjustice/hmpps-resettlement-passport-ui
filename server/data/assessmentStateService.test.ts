import { Request } from 'express'
import { AssessmentStateService } from './assessmentStateService'
import AssessmentStore from './assessmentStore'
import { createRedisClient } from './redisClient'
import { AssessmentPage, QuestionsAndAnswers, SubmittedInput } from './model/BCST2Form'

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

    describe('overwriteWith', () => {
      it('should overwrite the contents of the cache with the given summary page info', () => {
        const spy = jest.spyOn(store, 'setAssessment')
        const summaryPage: AssessmentPage = {
          id: 'CHECK_ANSWERS',
          title: null,
          questionsAndAnswers: [
            {
              question: {
                '@class': 'EducationSkillsAndWorkResettlementAssessmentQuestion',
                id: 'JOB_BEFORE_CUSTODY',
                title: 'Did the person in prison have a job before custody?',
                subTitle: null,
                type: 'RADIO',
                options: [
                  { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                  { id: 'NO', displayText: 'No', description: null, exclusive: false },
                  { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
                ],
                validationType: 'MANDATORY',
              },
              answer: { '@class': 'StringAnswer', answer: 'NO' },
              originalPageId: 'JOB_BEFORE_CUSTODY',
            },
            {
              question: {
                '@class': 'EducationSkillsAndWorkResettlementAssessmentQuestion',
                id: 'HAVE_A_JOB_AFTER_RELEASE',
                title: 'Does the person in prison have a job when they are released?',
                subTitle: null,
                type: 'RADIO',
                options: [
                  { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                  { id: 'NO', displayText: 'No', description: null, exclusive: false },
                  { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
                ],
                validationType: 'MANDATORY',
              },
              answer: { '@class': 'StringAnswer', answer: 'NO' },
              originalPageId: 'HAVE_A_JOB_AFTER_RELEASE',
            },
            {
              question: {
                '@class': 'EducationSkillsAndWorkResettlementAssessmentQuestion',
                id: 'SUPPORT_TO_FIND_JOB',
                title: 'Does the person in prison want support to find a job when they are released?',
                subTitle: null,
                type: 'RADIO',
                options: [
                  { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                  { id: 'NO', displayText: 'No', description: null, exclusive: false },
                  { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
                ],
                validationType: 'MANDATORY',
              },
              answer: { '@class': 'StringAnswer', answer: 'YES' },
              originalPageId: 'SUPPORT_TO_FIND_JOB',
            },
            {
              question: {
                '@class': 'EducationSkillsAndWorkResettlementAssessmentQuestion',
                id: 'IN_EDUCATION_OR_TRAINING_BEFORE_CUSTODY',
                title: 'Was the person in prison in education or training before custody?',
                subTitle: null,
                type: 'RADIO',
                options: [
                  { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                  { id: 'NO', displayText: 'No', description: null, exclusive: false },
                  { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
                ],
                validationType: 'MANDATORY',
              },
              answer: { '@class': 'StringAnswer', answer: 'NO' },
              originalPageId: 'IN_EDUCATION_OR_TRAINING_BEFORE_CUSTODY',
            },
            {
              question: {
                '@class': 'EducationSkillsAndWorkResettlementAssessmentQuestion',
                id: 'WANT_TO_START_EDUCATION_OR_TRAINING_AFTER_RELEASE',
                title: 'Does the person in prison want to start education or training after release?',
                subTitle: null,
                type: 'RADIO',
                options: [
                  { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                  { id: 'NO', displayText: 'No', description: null, exclusive: false },
                  { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
                ],
                validationType: 'MANDATORY',
              },
              answer: { '@class': 'StringAnswer', answer: 'NO' },
              originalPageId: 'WANT_TO_START_EDUCATION_OR_TRAINING_AFTER_RELEASE',
            },
          ],
        } as unknown as AssessmentPage

        assessmentStateService.overwriteWith(aRequest(), 'EDUCATION_SKILLS_AND_WORK', summaryPage)

        expect(spy).toHaveBeenCalledWith('sessionId', '123', 'EDUCATION_SKILLS_AND_WORK', {
          questionsAndAnswers: [
            {
              question: 'JOB_BEFORE_CUSTODY',
              questionTitle: 'Did the person in prison have a job before custody?',
              pageId: 'JOB_BEFORE_CUSTODY',
              questionType: 'RADIO',
              answer: { answer: 'NO', displayText: 'No', '@class': 'StringAnswer' },
            },
            {
              question: 'HAVE_A_JOB_AFTER_RELEASE',
              questionTitle: 'Does the person in prison have a job when they are released?',
              pageId: 'HAVE_A_JOB_AFTER_RELEASE',
              questionType: 'RADIO',
              answer: { answer: 'NO', displayText: 'No', '@class': 'StringAnswer' },
            },
            {
              question: 'SUPPORT_TO_FIND_JOB',
              questionTitle: 'Does the person in prison want support to find a job when they are released?',
              pageId: 'SUPPORT_TO_FIND_JOB',
              questionType: 'RADIO',
              answer: { answer: 'YES', displayText: 'Yes', '@class': 'StringAnswer' },
            },
            {
              question: 'IN_EDUCATION_OR_TRAINING_BEFORE_CUSTODY',
              questionTitle: 'Was the person in prison in education or training before custody?',
              pageId: 'IN_EDUCATION_OR_TRAINING_BEFORE_CUSTODY',
              questionType: 'RADIO',
              answer: { answer: 'NO', displayText: 'No', '@class': 'StringAnswer' },
            },
            {
              question: 'WANT_TO_START_EDUCATION_OR_TRAINING_AFTER_RELEASE',
              questionTitle: 'Does the person in prison want to start education or training after release?',
              pageId: 'WANT_TO_START_EDUCATION_OR_TRAINING_AFTER_RELEASE',
              questionType: 'RADIO',
              answer: { answer: 'NO', displayText: 'No', '@class': 'StringAnswer' },
            },
          ],
        })
      })
    })
  })
})
