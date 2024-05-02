import { AssessmentStateService, StateKey } from './assessmentStateService'
import AssessmentStore from './assessmentStore'
import { createRedisClient } from './redisClient'
import { AssessmentPage, SubmittedInput } from './model/BCST2Form'

jest.mock('./assessmentStore')

const sessionId = 'sessionId'
const prisonerNumber = '123'

describe('assessmentStateService', () => {
  let store: jest.Mocked<AssessmentStore>
  let assessmentStateService: AssessmentStateService
  let setAssessmentSpy: jest.SpyInstance
  let setAnsweredQuestionSpy: jest.SpyInstance

  beforeEach(() => {
    store = new AssessmentStore(createRedisClient()) as jest.Mocked<AssessmentStore>
    assessmentStateService = new AssessmentStateService(store as AssessmentStore)
    setAssessmentSpy = jest.spyOn(store, 'setAssessment')
    setAnsweredQuestionSpy = jest.spyOn(store, 'setAnsweredQuestions')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  function aStateKey(pathway: string): StateKey {
    return {
      prisonerNumber,
      sessionId,
      pathway,
    }
  }

  it('should reset state for a pathway', async () => {
    const pathway = 'HEALTH'
    await assessmentStateService.reset(aStateKey(pathway), pathway)

    expect(store.deleteAssessment).toHaveBeenCalledWith(sessionId, prisonerNumber, pathway)
    expect(store.deleteEditedQuestionList).toHaveBeenCalledWith(sessionId, prisonerNumber, pathway)
    expect(store.setAssessment).toHaveBeenCalledWith(sessionId, prisonerNumber, pathway, { questionsAndAnswers: [] })
  })

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
      }
      store.getAssessment.mockResolvedValueOnce({ questionsAndAnswers: [] })
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
      }

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
      }

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
        await assessmentStateService.startEdit(aStateKey(pathway), summaryPage)

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
        })
        expect(setAnsweredQuestionSpy).toHaveBeenCalledWith(sessionId, prisonerNumber, pathway, [
          'HELP_TO_MANAGE_ANGER',
          'ISSUES_WITH_GAMBLING',
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
})
