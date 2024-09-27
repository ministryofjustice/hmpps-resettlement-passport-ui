import { AssessmentStateService } from './assessmentStateService'
import AssessmentStore, { StateKey } from './assessmentStore'
import { createRedisClient } from './redisClient'
import {
  ApiAssessmentPage,
  ApiQuestionsAndAnswer,
  BackupCachedAssessment,
  CachedAssessment,
  CachedQuestionAndAnswer,
  PageWithQuestions,
  WorkingCachedAssessment,
} from './model/immediateNeedsReport'

jest.mock('./assessmentStore')

const sessionId = 'sessionId'
const prisonerNumber = '123'
const assessmentType = 'BCST2'

describe('assessmentStateService', () => {
  let store: jest.Mocked<AssessmentStore>
  let assessmentStateService: AssessmentStateService
  let setWorkingAssessmentSpy: jest.SpyInstance
  let setBackupAssessmentSpy: jest.SpyInstance

  beforeEach(() => {
    store = new AssessmentStore(createRedisClient()) as jest.Mocked<AssessmentStore>
    assessmentStateService = new AssessmentStateService(store as AssessmentStore)
    setWorkingAssessmentSpy = jest.spyOn(store, 'setWorkingAssessment')
    setBackupAssessmentSpy = jest.spyOn(store, 'setBackupAssessment')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  function aStateKey(pathway: string): StateKey {
    return {
      assessmentType,
      prisonerNumber,
      userId: sessionId,
      pathway,
    }
  }

  describe('answer', () => {
    it('when no questions have been answered', async () => {
      const answer: CachedAssessment = {
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
        version: 2,
      }
      store.getWorkingAssessment.mockResolvedValueOnce({
        assessment: { questionsAndAnswers: [], version: 2 },
        pageLoadHistory: [{ pageId: 'WHERE_WILL_THEY_LIVE_2', questions: ['WHERE_WILL_THEY_LIVE_2'] }],
      })

      const apiAssessmentPage: ApiAssessmentPage = {
        id: 'WHERE_WILL_THEY_LIVE_2',
        questionsAndAnswers: [
          {
            question: {
              id: 'WHERE_WILL_THEY_LIVE_2',
              title: 'Where will the person in prison live when they are released?',
              type: 'RADIO',
              options: [
                {
                  id: 'PRIVATE_RENTED_HOUSING',
                  displayText: 'Private rented housing',
                },
                {
                  id: 'DOES_NOT_HAVE_ANYWHERE',
                  displayText: 'Does not have anywhere to live',
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                },
              ],
            },
            originalPageId: 'PAGE_1',
          },
        ],
      }

      await assessmentStateService.answer(aStateKey('ACCOMMODATION'), answer, apiAssessmentPage)

      expect(setWorkingAssessmentSpy).toHaveBeenCalledWith(aStateKey('ACCOMMODATION'), {
        assessment: answer,
        pageLoadHistory: [{ pageId: 'WHERE_WILL_THEY_LIVE_2', questions: ['WHERE_WILL_THEY_LIVE_2'] }],
      })
    })

    it('should add an answer to a question that has not been answered before', async () => {
      const answer: CachedAssessment = {
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
        version: 2,
      }

      const existing: WorkingCachedAssessment = {
        assessment: {
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
          version: 2,
        },
        pageLoadHistory: [
          { pageId: 'WHERE_DID_THEY_LIVE', questions: ['WHERE_DID_THEY_LIVE'] },
          { pageId: 'WHERE_WILL_THEY_LIVE_2', questions: ['WHERE_WILL_THEY_LIVE_2'] },
        ],
      }

      const apiAssessmentPage: ApiAssessmentPage = {
        id: 'WHERE_WILL_THEY_LIVE_2',
        questionsAndAnswers: [
          {
            question: {
              id: 'WHERE_WILL_THEY_LIVE_2',
              title: 'Where will the person in prison live when they are released?',
              type: 'RADIO',
              options: [
                {
                  id: 'PRIVATE_RENTED_HOUSING',
                  displayText: 'Private rented housing',
                },
                {
                  id: 'DOES_NOT_HAVE_ANYWHERE',
                  displayText: 'Does not have anywhere to live',
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                },
              ],
            },
            originalPageId: 'PAGE_1',
          },
        ],
      }

      store.getWorkingAssessment.mockResolvedValueOnce(existing)
      await assessmentStateService.answer(aStateKey('ACCOMMODATION'), answer, apiAssessmentPage)

      const expected: WorkingCachedAssessment = {
        assessment: {
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
          version: 2,
        },
        pageLoadHistory: [
          { pageId: 'WHERE_DID_THEY_LIVE', questions: ['WHERE_DID_THEY_LIVE'] },
          { pageId: 'WHERE_WILL_THEY_LIVE_2', questions: ['WHERE_WILL_THEY_LIVE_2'] },
        ],
      }

      expect(setWorkingAssessmentSpy).toHaveBeenCalledWith(aStateKey('ACCOMMODATION'), expected)
    })

    it('should replace an answer to a question that has been answered before', async () => {
      const answer: CachedAssessment = {
        questionsAndAnswers: [
          {
            question: 'WHERE_DID_THEY_LIVE',
            questionTitle: 'Where did the person in prison live before custody?',
            questionType: 'RADIO',
            pageId: 'WHERE_DID_THEY_LIVE',
            answer: {
              answer: 'HOMEOWNER',
              displayText: 'Homeowner',
              '@class': 'StringAnswer',
            },
          },
        ],
        version: 3,
      }

      const existing: WorkingCachedAssessment = {
        assessment: {
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
          version: 3,
        },
        pageLoadHistory: [
          { pageId: 'WHERE_DID_THEY_LIVE', questions: ['WHERE_DID_THEY_LIVE'] },
          { pageId: 'WHERE_WILL_THEY_LIVE_2', questions: ['WHERE_WILL_THEY_LIVE_2'] },
        ],
      }

      const apiAssessmentPage: ApiAssessmentPage = {
        id: 'WHERE_WILL_THEY_LIVE_2',
        questionsAndAnswers: [
          {
            question: {
              id: 'WHERE_WILL_THEY_LIVE_2',
              title: 'Where will the person in prison live when they are released?',
              type: 'RADIO',
              options: [
                {
                  id: 'PRIVATE_RENTED_HOUSING',
                  displayText: 'Private rented housing',
                },
                {
                  id: 'DOES_NOT_HAVE_ANYWHERE',
                  displayText: 'Does not have anywhere to live',
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                },
              ],
            },
            originalPageId: 'PAGE_1',
          },
        ],
      }

      store.getWorkingAssessment.mockResolvedValueOnce(existing)

      await assessmentStateService.answer(aStateKey('ACCOMMODATION'), answer, apiAssessmentPage)

      const expected: WorkingCachedAssessment = {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'WHERE_DID_THEY_LIVE',
              questionTitle: 'Where did the person in prison live before custody?',
              questionType: 'RADIO',
              pageId: 'WHERE_DID_THEY_LIVE',
              answer: {
                answer: 'HOMEOWNER',
                displayText: 'Homeowner',
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
          version: 3,
        },
        pageLoadHistory: [
          { pageId: 'WHERE_DID_THEY_LIVE', questions: ['WHERE_DID_THEY_LIVE'] },
          { pageId: 'WHERE_WILL_THEY_LIVE_2', questions: ['WHERE_WILL_THEY_LIVE_2'] },
        ],
      }

      expect(setWorkingAssessmentSpy).toHaveBeenCalledWith(aStateKey('ACCOMMODATION'), expected)
    })
  })

  describe('startEdit', () => {
    it('should setup backup cache and update working cache', async () => {
      const pathway = 'ACCOMMODATION'

      const workingAssessment: WorkingCachedAssessment = {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'WHERE_DID_THEY_LIVE',
              questionTitle: 'Where did the person in prison live before custody?',
              questionType: 'RADIO',
              pageId: 'WHERE_DID_THEY_LIVE',
              answer: {
                answer: 'HOMEOWNER',
                displayText: 'Homeowner',
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
          version: 3,
        },
        pageLoadHistory: [
          { pageId: 'WHERE_DID_THEY_LIVE', questions: ['WHERE_DID_THEY_LIVE'] },
          { pageId: 'WHERE_WILL_THEY_LIVE_2', questions: ['WHERE_WILL_THEY_LIVE_2'] },
        ],
      }

      const expectedBackupAssessment: BackupCachedAssessment = {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'WHERE_DID_THEY_LIVE',
              questionTitle: 'Where did the person in prison live before custody?',
              questionType: 'RADIO',
              pageId: 'WHERE_DID_THEY_LIVE',
              answer: {
                answer: 'HOMEOWNER',
                displayText: 'Homeowner',
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
          version: 3,
        },
        pageLoadHistory: [
          { pageId: 'WHERE_DID_THEY_LIVE', questions: ['WHERE_DID_THEY_LIVE'] },
          { pageId: 'WHERE_WILL_THEY_LIVE_2', questions: ['WHERE_WILL_THEY_LIVE_2'] },
        ],
        startEditPageId: 'WHERE_DID_THEY_LIVE',
      }

      const expectedWorkingAssessment: WorkingCachedAssessment = {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'WHERE_DID_THEY_LIVE',
              questionTitle: 'Where did the person in prison live before custody?',
              questionType: 'RADIO',
              pageId: 'WHERE_DID_THEY_LIVE',
              answer: {
                answer: 'HOMEOWNER',
                displayText: 'Homeowner',
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
          version: 3,
        },
        pageLoadHistory: [],
      }

      store.getWorkingAssessment.mockResolvedValueOnce(workingAssessment)

      await assessmentStateService.startEdit(aStateKey(pathway), 'WHERE_DID_THEY_LIVE')

      expect(setBackupAssessmentSpy).toHaveBeenCalledWith(aStateKey(pathway), expectedBackupAssessment)
      expect(setWorkingAssessmentSpy).toHaveBeenCalledWith(aStateKey(pathway), expectedWorkingAssessment)
    })
  })

  describe('checkForConvergence', () => {
    it('re-converge scenario', async () => {
      const pageWithQuestions: PageWithQuestions = {
        pageId: 'WHERE_WILL_THEY_LIVE_2',
        questions: ['WHERE_WILL_THEY_LIVE_2'],
      }

      const workingAssessment: WorkingCachedAssessment = {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'WHERE_DID_THEY_LIVE',
              questionTitle: 'Where did the person in prison live before custody?',
              questionType: 'RADIO',
              pageId: 'WHERE_DID_THEY_LIVE',
              answer: {
                answer: 'HOMEOWNER',
                displayText: 'Homeowner',
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
          version: 3,
        },
        pageLoadHistory: [{ pageId: 'WHERE_DID_THEY_LIVE', questions: ['WHERE_DID_THEY_LIVE'] }],
      }
      const backupAssessment: BackupCachedAssessment = {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'WHERE_DID_THEY_LIVE',
              questionTitle: 'Where did the person in prison live before custody?',
              questionType: 'RADIO',
              pageId: 'WHERE_DID_THEY_LIVE',
              answer: {
                answer: 'HOMEOWNER',
                displayText: 'Homeowner',
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
          version: 3,
        },
        pageLoadHistory: [
          { pageId: 'WHERE_DID_THEY_LIVE', questions: ['WHERE_DID_THEY_LIVE'] },
          { pageId: 'WHERE_WILL_THEY_LIVE_2', questions: ['WHERE_WILL_THEY_LIVE_2'] },
        ],
        startEditPageId: 'WHERE_DID_THEY_LIVE',
      }
      const expectedWorkingAssessment: WorkingCachedAssessment = {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'WHERE_DID_THEY_LIVE',
              questionTitle: 'Where did the person in prison live before custody?',
              questionType: 'RADIO',
              pageId: 'WHERE_DID_THEY_LIVE',
              answer: {
                answer: 'HOMEOWNER',
                displayText: 'Homeowner',
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
          version: 3,
        },
        pageLoadHistory: [
          { pageId: 'WHERE_DID_THEY_LIVE', questions: ['WHERE_DID_THEY_LIVE'] },
          { pageId: 'WHERE_WILL_THEY_LIVE_2', questions: ['WHERE_WILL_THEY_LIVE_2'] },
        ],
      }

      store.getWorkingAssessment.mockResolvedValueOnce(workingAssessment)
      store.getBackupAssessment.mockResolvedValueOnce(backupAssessment)

      const reConverged = await assessmentStateService.checkForConvergence(
        aStateKey('ACCOMMODATION'),
        pageWithQuestions,
      )

      expect(reConverged).toEqual(true)
      expect(setWorkingAssessmentSpy).toHaveBeenCalledWith(aStateKey('ACCOMMODATION'), expectedWorkingAssessment)
    })

    it('no re-converge scenario - new page', async () => {
      const pageWithQuestions: PageWithQuestions = {
        pageId: 'SUPPORT_NEEDS',
        questions: ['SUPPORT_NEEDS'],
      }

      const workingAssessment: WorkingCachedAssessment = {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'WHERE_DID_THEY_LIVE',
              questionTitle: 'Where did the person in prison live before custody?',
              questionType: 'RADIO',
              pageId: 'WHERE_DID_THEY_LIVE',
              answer: {
                answer: 'HOMEOWNER',
                displayText: 'Homeowner',
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
          version: 3,
        },
        pageLoadHistory: [{ pageId: 'WHERE_DID_THEY_LIVE', questions: ['WHERE_DID_THEY_LIVE'] }],
      }
      const backupAssessment: BackupCachedAssessment = {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'WHERE_DID_THEY_LIVE',
              questionTitle: 'Where did the person in prison live before custody?',
              questionType: 'RADIO',
              pageId: 'WHERE_DID_THEY_LIVE',
              answer: {
                answer: 'HOMEOWNER',
                displayText: 'Homeowner',
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
          version: 3,
        },
        pageLoadHistory: [
          { pageId: 'WHERE_DID_THEY_LIVE', questions: ['WHERE_DID_THEY_LIVE'] },
          { pageId: 'WHERE_WILL_THEY_LIVE_2', questions: ['WHERE_WILL_THEY_LIVE_2'] },
        ],
        startEditPageId: 'WHERE_DID_THEY_LIVE',
      }

      store.getWorkingAssessment.mockResolvedValueOnce(workingAssessment)
      store.getBackupAssessment.mockResolvedValueOnce(backupAssessment)

      const reConverged = await assessmentStateService.checkForConvergence(
        aStateKey('ACCOMMODATION'),
        pageWithQuestions,
      )

      expect(reConverged).toEqual(false)
      expect(setWorkingAssessmentSpy).toHaveBeenCalledTimes(0)
    })

    it('no re-converge scenario - not an edit', async () => {
      const pageWithQuestions: PageWithQuestions = {
        pageId: 'WHERE_WILL_THEY_LIVE_2',
        questions: ['WHERE_WILL_THEY_LIVE_2'],
      }

      const workingAssessment: WorkingCachedAssessment = {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'WHERE_DID_THEY_LIVE',
              questionTitle: 'Where did the person in prison live before custody?',
              questionType: 'RADIO',
              pageId: 'WHERE_DID_THEY_LIVE',
              answer: {
                answer: 'HOMEOWNER',
                displayText: 'Homeowner',
                '@class': 'StringAnswer',
              },
            },
          ],
          version: 3,
        },
        pageLoadHistory: [{ pageId: 'WHERE_DID_THEY_LIVE', questions: ['WHERE_DID_THEY_LIVE'] }],
      }

      store.getWorkingAssessment.mockResolvedValueOnce(workingAssessment)
      store.getBackupAssessment.mockResolvedValueOnce(null)

      const reConverged = await assessmentStateService.checkForConvergence(
        aStateKey('ACCOMMODATION'),
        pageWithQuestions,
      )

      expect(reConverged).toEqual(false)
      expect(setWorkingAssessmentSpy).toHaveBeenCalledTimes(0)
      expect(setBackupAssessmentSpy).toHaveBeenCalledTimes(0)
    })

    it('no re-converge scenario - editing first page', async () => {
      const pageWithQuestions: PageWithQuestions = {
        pageId: 'WHERE_DID_THEY_LIVE',
        questions: ['WHERE_DID_THEY_LIVE'],
      }

      const workingAssessment: WorkingCachedAssessment = {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'WHERE_DID_THEY_LIVE',
              questionTitle: 'Where did the person in prison live before custody?',
              questionType: 'RADIO',
              pageId: 'WHERE_DID_THEY_LIVE',
              answer: {
                answer: 'HOMEOWNER',
                displayText: 'Homeowner',
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
          version: 3,
        },
        pageLoadHistory: [],
      }
      const backupAssessment: BackupCachedAssessment = {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'WHERE_DID_THEY_LIVE',
              questionTitle: 'Where did the person in prison live before custody?',
              questionType: 'RADIO',
              pageId: 'WHERE_DID_THEY_LIVE',
              answer: {
                answer: 'HOMEOWNER',
                displayText: 'Homeowner',
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
          version: 3,
        },
        pageLoadHistory: [
          { pageId: 'WHERE_DID_THEY_LIVE', questions: ['WHERE_DID_THEY_LIVE'] },
          { pageId: 'WHERE_WILL_THEY_LIVE_2', questions: ['WHERE_WILL_THEY_LIVE_2'] },
        ],
        startEditPageId: 'WHERE_DID_THEY_LIVE',
      }

      store.getWorkingAssessment.mockResolvedValueOnce(workingAssessment)
      store.getBackupAssessment.mockResolvedValueOnce(backupAssessment)

      const reConverged = await assessmentStateService.checkForConvergence(
        aStateKey('ACCOMMODATION'),
        pageWithQuestions,
      )

      expect(reConverged).toEqual(false)
      expect(setWorkingAssessmentSpy).toHaveBeenCalledTimes(0)
      expect(setBackupAssessmentSpy).toHaveBeenCalledTimes(0)
    })
  })

  describe('getMergedQuestionsAndAnswers', () => {
    it('Should merge questions and answers favouring questions from the cache', async () => {
      const apiQAndA: ApiQuestionsAndAnswer[] = [aQuestionAndAnswer('1', 'API 1'), aQuestionAndAnswer('2', 'API 2')]

      const workingAssessment: WorkingCachedAssessment = {
        assessment: {
          questionsAndAnswers: [aSubmittedQAndA('1', 'Cache 1'), aSubmittedQAndA('3', 'Cache 3')],
          version: 1,
        },
        pageLoadHistory: [],
      }

      store.getWorkingAssessment.mockResolvedValueOnce(workingAssessment)

      const merged = await assessmentStateService.getMergedQuestionsAndAnswers(aStateKey('ACCOMMODATION'), apiQAndA)

      expect(merged).toHaveLength(3)
      const mergedItems = merged.map(i => {
        return { q: i.question, a: i.answer.answer }
      })
      expect(mergedItems).toContainEqual({ q: '1', a: 'Cache 1' })
      expect(mergedItems).toContainEqual({ q: '2', a: 'API 2' })
      expect(mergedItems).toContainEqual({ q: '3', a: 'Cache 3' })
    })
  })

  describe('initialiseCache', () => {
    it('If cache is empty, save and return empty assessment with config version', async () => {
      const configVersion = 2

      const apiQAndA: ApiQuestionsAndAnswer[] = []

      const assessment = await assessmentStateService.initialiseCache(
        aStateKey('ACCOMMODATION'),
        configVersion,
        apiQAndA,
      )

      const expectedAssessment: WorkingCachedAssessment = {
        assessment: {
          questionsAndAnswers: [],
          version: configVersion,
        },
        pageLoadHistory: [],
      }

      expect(assessment).toEqual(expectedAssessment)
      expect(setWorkingAssessmentSpy).toHaveBeenCalledWith(aStateKey('ACCOMMODATION'), expectedAssessment)
    })

    it('If cache is not empty, return assessment from cache', async () => {
      const configVersion = 4

      const apiQAndA: ApiQuestionsAndAnswer[] = []

      const workingAssessment: WorkingCachedAssessment = {
        assessment: {
          questionsAndAnswers: [
            {
              question: 'HELP_TO_MANAGE_ANGER',
              questionTitle: 'Does the person in prison want support managing their emotions?',
              pageId: 'HELP_TO_MANAGE_ANGER',
              questionType: 'RADIO',
              answer: { answer: 'NO', displayText: 'No', '@class': 'StringAnswer' },
            },
            {
              question: 'ISSUES_WITH_GAMBLING',
              questionTitle: 'Does the person in prison want support with gambling issues?',
              pageId: 'ISSUES_WITH_GAMBLING',
              questionType: 'RADIO',
              answer: { answer: 'NO_ANSWER', displayText: 'No answer provided', '@class': 'StringAnswer' },
            },
          ],
          version: configVersion,
        },
        pageLoadHistory: [
          { pageId: 'HELP_TO_MANAGE_ANGER', questions: ['HELP_TO_MANAGE_ANGER'] },
          { pageId: 'ISSUES_WITH_GAMBLING', questions: ['ISSUES_WITH_GAMBLING'] },
        ],
      }

      store.getWorkingAssessment.mockResolvedValue(workingAssessment)

      const assessment = await assessmentStateService.initialiseCache(
        aStateKey('ATTITUDES_THINKING_AND_BEHAVIOUR'),
        configVersion,
        apiQAndA,
      )

      expect(assessment).toEqual(workingAssessment)
      expect(setWorkingAssessmentSpy).toHaveBeenCalledTimes(0)
    })
  })
})

function aQuestionAndAnswer(id: string, answer: string): ApiQuestionsAndAnswer {
  return {
    question: {
      id,
    },
    answer: {
      answer,
    },
  } as ApiQuestionsAndAnswer
}

function aSubmittedQAndA(id: string, answer: string): CachedQuestionAndAnswer {
  return {
    question: id,
    answer: {
      answer,
    },
  } as CachedQuestionAndAnswer
}
