import {
  AssessmentPage,
  QuestionsAndAnswers,
  SubmittedInput,
  SubmittedQuestionAndAnswer,
} from '../../data/model/BCST2Form'
import { mergeQuestionsAndAnswers } from './BCST2FormController'

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

describe('BCST2FormController', () => {
  describe('mergeQuestionsAndAnswers', () => {
    it('Should merge questions and answers favouring questions from the cache', () => {
      const apiQAndA: AssessmentPage = {
        questionsAndAnswers: [aQuestionAndAnswer('1', 'API 1'), aQuestionAndAnswer('2', 'API 2')],
      } as AssessmentPage

      const cacheQAndA: SubmittedInput = {
        questionsAndAnswers: [aSubmittedQAndA('1', 'Cache 1'), aSubmittedQAndA('3', 'Cache 3')],
      } as SubmittedInput

      const merged = mergeQuestionsAndAnswers(apiQAndA, cacheQAndA, false)

      expect(merged).toHaveLength(2)
      expect(merged[0]).toMatchObject(aSubmittedQAndA('1', 'Cache 1'))
      expect(merged[1]).toMatchObject(aSubmittedQAndA('2', 'API 2'))
    })

    it('Just gives the contents of the cache when it is an edit and on the check answers page', () => {
      const apiQAndA: AssessmentPage = {
        id: 'CHECK_ANSWERS',
        questionsAndAnswers: [aQuestionAndAnswer('1', 'API 1'), aQuestionAndAnswer('2', 'API 2')],
      } as AssessmentPage

      const cacheQAndA: SubmittedInput = {
        questionsAndAnswers: [aSubmittedQAndA('1', 'Cache 1'), aSubmittedQAndA('3', 'Cache 3')],
      } as SubmittedInput

      const merged = mergeQuestionsAndAnswers(apiQAndA, cacheQAndA, true)

      expect(merged).toEqual(cacheQAndA.questionsAndAnswers)
    })
  })
})
