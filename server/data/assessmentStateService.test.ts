import { AssessmentStateService, StateKey } from './assessmentStateService'
import AssessmentStore from './assessmentStore'
import { createRedisClient } from './redisClient'
import {
  AssessmentPage,
  QuestionsAndAnswers,
  SubmittedInput,
  SubmittedQuestionAndAnswer,
} from './model/immediateNeedsReport'

jest.mock('./assessmentStore')

const sessionId = 'sessionId'
const prisonerNumber = '123'

describe('assessmentStateService', () => {
  let store: jest.Mocked<AssessmentStore>
  let assessmentStateService: AssessmentStateService
  let setAssessmentSpy: jest.SpyInstance
  let setAnsweredQuestionSpy: jest.SpyInstance
  let getAnsweredQuestionsSpy: jest.SpyInstance
  let getAssessmentSpy: jest.SpyInstance

  beforeEach(() => {
    store = new AssessmentStore(createRedisClient()) as jest.Mocked<AssessmentStore>
    assessmentStateService = new AssessmentStateService(store as AssessmentStore)
    setAssessmentSpy = jest.spyOn(store, 'setAssessment')
    setAnsweredQuestionSpy = jest.spyOn(store, 'setAnsweredQuestions')
    getAnsweredQuestionsSpy = jest.spyOn(store, 'getAnsweredQuestions')
    getAssessmentSpy = jest.spyOn(store, 'getAssessment')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  function aStateKey(pathway: string): StateKey {
    return {
      prisonerNumber,
      userId: sessionId,
      pathway,
    }
  }

  describe('answer', () => {
    it('when no questions have been answered', async () => {
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
        version: 2,
      }
      store.getAssessment.mockResolvedValueOnce({ questionsAndAnswers: [], version: 2 })
      store.getAnsweredQuestions.mockResolvedValueOnce([])

      await assessmentStateService.answer(aStateKey('ACCOMMODATION'), answer)

      expect(setAssessmentSpy).toHaveBeenCalledWith('sessionId', '123', 'ACCOMMODATION', answer)
      expect(setAnsweredQuestionSpy).toHaveBeenCalledWith('sessionId', '123', 'ACCOMMODATION', [
        'WHERE_WILL_THEY_LIVE_2',
      ])
    })

    it('should add an answer to a question that has not been answered before', async () => {
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
        version: 2,
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
        version: 2,
      }

      store.getAssessment.mockResolvedValueOnce(existing)
      store.getAnsweredQuestions.mockResolvedValueOnce(['WHERE_DID_THEY_LIVE'])
      await assessmentStateService.answer(aStateKey('ACCOMMODATION'), answer)

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
        version: 2,
      } as SubmittedInput

      expect(setAssessmentSpy).toHaveBeenCalledWith('sessionId', '123', 'ACCOMMODATION', expected)
      expect(setAnsweredQuestionSpy).toHaveBeenCalledWith('sessionId', '123', 'ACCOMMODATION', [
        'WHERE_DID_THEY_LIVE',
        'WHERE_WILL_THEY_LIVE_2',
      ])
    })

    it('should replace an answer to a question that has been answered before', async () => {
      const answer: SubmittedInput = {
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
        version: 3,
      }

      store.getAssessment.mockResolvedValueOnce(existing)
      store.getAnsweredQuestions.mockResolvedValueOnce(['WHERE_DID_THEY_LIVE', 'WHERE_WILL_THEY_LIVE_2'])

      await assessmentStateService.answer(aStateKey('ACCOMMODATION'), answer)

      const expected = {
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
      } as SubmittedInput

      expect(setAssessmentSpy).toHaveBeenCalledWith('sessionId', '123', 'ACCOMMODATION', expected)
      expect(setAnsweredQuestionSpy).toHaveBeenCalledWith('sessionId', '123', 'ACCOMMODATION', ['WHERE_DID_THEY_LIVE'])
    })

    describe('startEdit', () => {
      it('should overwrite the contents of the cache with the given summary page info', async () => {
        const summaryPage: AssessmentPage = {
          id: 'CHECK_ANSWERS',
          questionsAndAnswers: [
            {
              answer: {
                '@class': 'StringAnswer',
                answer: 'NO',
              },
              originalPageId: 'HELP_TO_MANAGE_ANGER',
              question: {
                '@class': 'AttitudesThinkingAndBehaviourResettlementAssessmentQuestion',
                id: 'HELP_TO_MANAGE_ANGER',
                options: [
                  {
                    description: null,
                    displayText: 'Yes',
                    exclusive: false,
                    id: 'YES',
                  },
                  {
                    description: null,
                    displayText: 'No',
                    exclusive: false,
                    id: 'NO',
                  },
                  {
                    description: null,
                    displayText: 'No answer provided',
                    exclusive: false,
                    id: 'NO_ANSWER',
                  },
                ],
                subTitle: null,
                title: 'Does the person in prison want support managing their emotions?',
                type: 'RADIO',
                validationType: 'MANDATORY',
              },
            },
            {
              answer: {
                '@class': 'StringAnswer',
                answer: 'NO_ANSWER',
              },
              originalPageId: 'ISSUES_WITH_GAMBLING',
              question: {
                '@class': 'AttitudesThinkingAndBehaviourResettlementAssessmentQuestion',
                id: 'ISSUES_WITH_GAMBLING',
                options: [
                  {
                    description: null,
                    displayText: 'Yes',
                    exclusive: false,
                    id: 'YES',
                  },
                  {
                    description: null,
                    displayText: 'No',
                    exclusive: false,
                    id: 'NO',
                  },
                  {
                    description: null,
                    displayText: 'No answer provided',
                    exclusive: false,
                    id: 'NO_ANSWER',
                  },
                ],
                subTitle: null,
                title: 'Does the person in prison want support with gambling issues?',
                type: 'RADIO',
                validationType: 'MANDATORY',
              },
            },
            {
              answer: {
                '@class': 'StringAnswer',
                answer: 'SUPPORT_DECLINED',
              },
              originalPageId: 'PRERELEASE_ASSESSMENT_SUMMARY',
              question: {
                '@class': 'GenericResettlementAssessmentQuestion',
                id: 'SUPPORT_NEEDS_PRERELEASE',
                options: [
                  {
                    description: 'a need for support has been identified and is accepted',
                    displayText: 'Support required',
                    exclusive: false,
                    id: 'SUPPORT_REQUIRED',
                  },
                  {
                    description: 'no need was identified',
                    displayText: 'Support not required',
                    exclusive: false,
                    id: 'SUPPORT_NOT_REQUIRED',
                  },
                  {
                    description: 'a need has been identified but support is declined',
                    displayText: 'Support declined',
                    exclusive: false,
                    id: 'SUPPORT_DECLINED',
                  },
                  {
                    description: 'work is ongoing',
                    displayText: 'In progress',
                    exclusive: false,
                    id: 'IN_PROGRESS',
                  },
                  {
                    description: 'all required work has been completed successfully',
                    displayText: 'Done',
                    exclusive: false,
                    id: 'DONE',
                  },
                ],
                subTitle: null,
                title: '',
                type: 'RADIO',
                validationType: 'MANDATORY',
              },
            },
          ],
          title: null,
        } as unknown as AssessmentPage

        const pathway = 'ATTITUDES_THINKING_AND_BEHAVIOUR'
        await assessmentStateService.startEdit(aStateKey(pathway), summaryPage, 2)

        expect(setAssessmentSpy).toHaveBeenCalledWith('sessionId', '123', pathway, {
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
            {
              question: 'SUPPORT_NEEDS_PRERELEASE',
              questionTitle: '',
              pageId: 'PRERELEASE_ASSESSMENT_SUMMARY',
              questionType: 'RADIO',
              answer: { answer: 'SUPPORT_DECLINED', displayText: 'Support declined', '@class': 'StringAnswer' },
            },
          ],
          version: 2,
        })
        expect(setAnsweredQuestionSpy).toHaveBeenCalledWith(sessionId, prisonerNumber, pathway, [
          'HELP_TO_MANAGE_ANGER',
          'ISSUES_WITH_GAMBLING',
          'SUPPORT_NEEDS_PRERELEASE',
        ])
      })
    })
  })

  describe('checkForConvergence', () => {
    it('re-converge scenario', async () => {
      const deleteEditedQuestionListSpy = jest.spyOn(store, 'deleteEditedQuestionList')
      const questionEditList = ['JOB_BEFORE_CUSTODY']
      store.getEditedQuestionList.mockResolvedValueOnce(questionEditList)
      const questionAnswerList = ['JOB_BEFORE_CUSTODY', 'A.N.OTHER', 'HAVE_A_JOB_AFTER_RELEASE']
      store.getAnsweredQuestions.mockResolvedValueOnce(questionAnswerList)

      const page: AssessmentPage = {
        id: 'HAVE_A_JOB_AFTER_RELEASE',
        questionsAndAnswers: [
          {
            question: {
              id: 'HAVE_A_JOB_AFTER_RELEASE',
              title: 'Does the person in prison have a job when they are released?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null },
                { id: 'NO', displayText: 'No', description: null },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null },
              ],
              validationType: 'MANDATORY',
            },
            answer: { '@class': 'StringAnswer', answer: 'YES' },
            originalPageId: 'HAVE_A_JOB_AFTER_RELEASE',
          },
        ],
      }

      const reConverged = await assessmentStateService.checkForConvergence(
        aStateKey('EDUCATION_SKILLS_AND_WORK'),
        page,
        true,
      )

      expect(reConverged).toEqual(true)
      expect(setAnsweredQuestionSpy).toHaveBeenCalledWith(sessionId, prisonerNumber, 'EDUCATION_SKILLS_AND_WORK', [
        'JOB_BEFORE_CUSTODY',
        'HAVE_A_JOB_AFTER_RELEASE',
      ])
      expect(deleteEditedQuestionListSpy).toHaveBeenCalledTimes(1)
    })

    it('no re-converge scenario', async () => {
      const deleteQuestionListSpy = jest.spyOn(store, 'deleteEditedQuestionList')
      const questionEditList = ['JOB_BEFORE_CUSTODY']
      store.getEditedQuestionList.mockResolvedValueOnce(questionEditList)
      const answeredQuestionList = ['JOB_BEFORE_CUSTODY', 'SUPPORT_NEEDS']
      store.getAnsweredQuestions.mockResolvedValueOnce(answeredQuestionList)

      const page: AssessmentPage = {
        id: 'HAVE_A_JOB_AFTER_RELEASE',
        questionsAndAnswers: [
          {
            question: {
              id: 'HAVE_A_JOB_AFTER_RELEASE',
              title: 'Does the person in prison have a job when they are released?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null },
                { id: 'NO', displayText: 'No', description: null },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null },
              ],
              validationType: 'MANDATORY',
            },
            answer: { '@class': 'StringAnswer', answer: 'YES' },
            originalPageId: 'HAVE_A_JOB_AFTER_RELEASE',
          },
        ],
      }

      const reConverged = await assessmentStateService.checkForConvergence(
        aStateKey('EDUCATION_SKILLS_AND_WORK'),
        page,
        true,
      )

      expect(reConverged).toEqual(false)
      expect(setAssessmentSpy).toHaveBeenCalledTimes(0)
      expect(deleteQuestionListSpy).toHaveBeenCalledTimes(0)
    })
  })

  describe('mergeQuestionsAndAnswers', () => {
    it('Should merge questions and answers favouring questions from the cache', () => {
      const apiQAndA: AssessmentPage = {
        questionsAndAnswers: [aQuestionAndAnswer('1', 'API 1'), aQuestionAndAnswer('2', 'API 2')],
      } as AssessmentPage

      const cacheQAndA: SubmittedInput = {
        questionsAndAnswers: [aSubmittedQAndA('1', 'Cache 1'), aSubmittedQAndA('3', 'Cache 3')],
      } as SubmittedInput

      const merged = assessmentStateService.mergeQuestionsAndAnswers(apiQAndA, cacheQAndA)

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
      const stateKey = {
        prisonerNumber: 'ABC1234',
        userId: 'D126HJ',
        pathway: 'ACCOMMODATION',
      }
      const configVersion = 2

      const assessment = await assessmentStateService.initialiseCache(stateKey, configVersion)

      const expectedAssessment = {
        questionsAndAnswers: [],
        version: configVersion,
      } as SubmittedInput

      expect(assessment).toEqual(expectedAssessment)
      expect(setAssessmentSpy).toHaveBeenCalledWith(
        stateKey.userId,
        stateKey.prisonerNumber,
        stateKey.pathway,
        expectedAssessment,
      )
    })

    it('If cache is not empty, return assessment from cache filtered to only answered questions', async () => {
      const stateKey = {
        prisonerNumber: 'ABC1234',
        userId: 'D126HJ',
        pathway: 'ACCOMMODATION',
      }
      const configVersion = 4

      store.getAssessment.mockResolvedValue({
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
      })

      store.getAnsweredQuestions.mockResolvedValueOnce(['HELP_TO_MANAGE_ANGER'])

      const assessment = await assessmentStateService.initialiseCache(stateKey, configVersion)

      const expectedAssessment = {
        questionsAndAnswers: [
          {
            question: 'HELP_TO_MANAGE_ANGER',
            questionTitle: 'Does the person in prison want support managing their emotions?',
            pageId: 'HELP_TO_MANAGE_ANGER',
            questionType: 'RADIO',
            answer: { answer: 'NO', displayText: 'No', '@class': 'StringAnswer' },
          },
        ],
        version: configVersion,
      } as SubmittedInput

      expect(assessment).toEqual(expectedAssessment)
    })
  })

  describe('getExistingAssessmentAnsweredQuestions', () => {
    it('If cache does not contain version, return default version 1', async () => {
      const stateKey = {
        prisonerNumber: 'ABC1234',
        userId: 'D126HJ',
        pathway: 'ACCOMMODATION',
      }

      store.getAssessment.mockResolvedValue({
        questionsAndAnswers: [
          {
            question: 'HELP_TO_MANAGE_ANGER',
            questionTitle: 'Does the person in prison want support managing their emotions?',
            pageId: 'HELP_TO_MANAGE_ANGER',
            questionType: 'RADIO',
            answer: { answer: 'NO', displayText: 'No', '@class': 'StringAnswer' },
          },
        ],
        version: undefined,
      })

      store.getAnsweredQuestions.mockResolvedValueOnce(['HELP_TO_MANAGE_ANGER'])

      const assessment = await assessmentStateService.getExistingAssessmentAnsweredQuestions(stateKey)

      const expectedAssessment = {
        questionsAndAnswers: [
          {
            question: 'HELP_TO_MANAGE_ANGER',
            questionTitle: 'Does the person in prison want support managing their emotions?',
            pageId: 'HELP_TO_MANAGE_ANGER',
            questionType: 'RADIO',
            answer: { answer: 'NO', displayText: 'No', '@class': 'StringAnswer' },
          },
        ],
        version: 1,
      } as SubmittedInput

      expect(getAssessmentSpy).toHaveBeenCalledWith(stateKey.userId, stateKey.prisonerNumber, stateKey.pathway)
      expect(getAnsweredQuestionsSpy).toHaveBeenCalledWith(stateKey.userId, stateKey.prisonerNumber, stateKey.pathway)
      expect(assessment).toEqual(expectedAssessment)
    })
  })
})

function aQuestionAndAnswer(id: string, answer: string): QuestionsAndAnswers {
  return {
    question: {
      id,
    },
    answer: {
      answer,
    },
  } as QuestionsAndAnswers
}

function aSubmittedQAndA(id: string, answer: string): SubmittedQuestionAndAnswer {
  return {
    question: id,
    answer: {
      answer,
    },
  } as SubmittedQuestionAndAnswer
}
