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
              answer: { '@class': 'StringAnswer', answer: 'NO_ANSWER' },
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

        assessmentStateService.overwriteWith(aStateKey('EDUCATION_SKILLS_AND_WORK'), summaryPage)

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
              answer: { answer: 'NO_ANSWER', displayText: 'No answer provided', '@class': 'StringAnswer' },
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

  describe('checkIfEditAndHandle', () => {
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

      const reConverged = await assessmentStateService.checkIfEditAndHandle(
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

      const reConverged = await assessmentStateService.checkIfEditAndHandle(
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
