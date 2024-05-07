import AssessmentStore from './assessmentStore'
import { createRedisClient } from './redisClient'
import { AssessmentPage, SubmittedInput, SubmittedQuestionAndAnswer } from './model/BCST2Form'
import { getDisplayTextFromQandA, toSubmittedQuestionAndAnswer } from '../utils/formatAssessmentResponse'
import logger from '../../logger'

export interface StateKey {
  prisonerNumber?: string
  sessionId: string
  pathway: string
}

export function createAssessmentStateService() {
  return new AssessmentStateService(new AssessmentStore(createRedisClient()))
}

export class AssessmentStateService {
  constructor(private readonly store: AssessmentStore) {
    // no-op
  }

  async getAssessment(key: StateKey): Promise<SubmittedInput> {
    return this.store.getAssessment(key.sessionId, key.prisonerNumber, key.pathway)
  }

  async deleteEditedQuestionList(key: StateKey, pathway: string) {
    await this.store.deleteEditedQuestionList(key.sessionId, key.prisonerNumber, pathway)
  }

  async reset(key: StateKey, pathway: string) {
    await this.store.deleteAssessment(key.sessionId, key.prisonerNumber, pathway)
    await this.store.deleteEditedQuestionList(key.sessionId, key.prisonerNumber, pathway)
    await this.store.setAssessment(key.sessionId, key.prisonerNumber, pathway, {
      questionsAndAnswers: [],
    })
  }

  async answer(key: StateKey, answer: SubmittedInput, edit: boolean = false) {
    // get previous Q&A's
    const allQuestionsAndAnswers = await this.store.getAssessment(key.sessionId, key.prisonerNumber, key.pathway)
    await this.updateAnsweredQuestionIds(key, answer, edit)

    answer.questionsAndAnswers.forEach((newQandA: SubmittedQuestionAndAnswer) => {
      const index = allQuestionsAndAnswers?.questionsAndAnswers
        ? allQuestionsAndAnswers.questionsAndAnswers.findIndex((existingQandA: SubmittedQuestionAndAnswer) => {
            return existingQandA.question === newQandA.question
          })
        : -1

      if (index !== -1) {
        // Replace the existing question with the new one
        allQuestionsAndAnswers.questionsAndAnswers[index] = newQandA
      } else {
        // Add the new question if it doesn't exist
        allQuestionsAndAnswers.questionsAndAnswers.push(newQandA)
      }
    })

    await this.store.setAssessment(key.sessionId, key.prisonerNumber, key.pathway, allQuestionsAndAnswers)
  }

  private async updateAnsweredQuestionIds(key: StateKey, answer: SubmittedInput, edit: boolean) {
    let answeredQuestionIds: string[]
    if (edit) {
      answeredQuestionIds = await this.store.getEditedQuestionList(key.sessionId, key.prisonerNumber, key.pathway)
    } else {
      answeredQuestionIds = await this.store.getAnsweredQuestions(key.sessionId, key.prisonerNumber, key.pathway)
    }

    answer.questionsAndAnswers.forEach(q => {
      const questionId = q.question
      const questionIndex = answeredQuestionIds.indexOf(questionId)
      if (questionIndex === -1) {
        // Not currently answered, just add to the end
        answeredQuestionIds.push(questionId)
      } else {
        // Remove any answers that come after the question
        answeredQuestionIds = answeredQuestionIds.slice(0, questionIndex + 1)
      }
    })

    if (edit) {
      await this.store.setEditedQuestionList(key.sessionId, key.prisonerNumber, key.pathway, answeredQuestionIds)
    } else {
      await this.store.setAnsweredQuestions(key.sessionId, key.prisonerNumber, key.pathway, answeredQuestionIds)
    }
  }

  async checkForConvergence(key: StateKey, assessmentPage: AssessmentPage, edit: boolean): Promise<boolean> {
    // Get any edited questions from cache
    const editedQuestionIds = await this.store.getEditedQuestionList(key.sessionId, key.prisonerNumber, key.pathway)
    const answeredQuestionIds = await this.store.getAnsweredQuestions(key.sessionId, key.prisonerNumber, key.pathway)

    if (editedQuestionIds.length === 0 || !edit) {
      return false
    }
    // If we have any edited questions, check if we have now re-converged to the logic tree - if so update cache and redirect to CHECK_ANSWERS

    // Get the question ids for the next page (with workaround if next page is CHECK_ANSWER as this contains no new questions)
    const nextPageQuestionIds =
      assessmentPage.id !== 'CHECK_ANSWERS' ? assessmentPage.questionsAndAnswers.map(it => it.question.id) : []

    // If all the questions on the page we are about to render are in the cache we have converged
    if (nextPageQuestionIds.every(it => answeredQuestionIds?.includes(it))) {
      // Get the start and end index of existingAssessment where we diverged and converged
      const editedQuestionsStartIndex = answeredQuestionIds.indexOf(editedQuestionIds[0])
      const editedQuestionsEndIndex = answeredQuestionIds.indexOf(nextPageQuestionIds[0])
      // Get the question ids from the indexes
      const questionIdsPreDivergence = answeredQuestionIds.slice(0, editedQuestionsStartIndex)
      // If editedQuestionsEndIndex === -1, it means the next page has no questions on it. In this case we can set the questionIdsPostConvergence to empty.
      const questionIdsPostConvergence =
        editedQuestionsEndIndex === -1
          ? []
          : answeredQuestionIds.slice(editedQuestionsEndIndex, answeredQuestionIds.length)

      // The new list of question ids is the pre-divergence, edited questions and post-convergence ids de-duped
      const newQuestionIds = [...questionIdsPreDivergence, ...editedQuestionIds, ...questionIdsPostConvergence].filter(
        (item, pos, arr) => {
          return arr.indexOf(item) === pos
        },
      )

      await this.store.setAnsweredQuestions(key.sessionId, key.prisonerNumber, key.pathway, newQuestionIds)
      // Delete the edited question list from cache
      await this.store.deleteEditedQuestionList(key.sessionId, key.prisonerNumber, key.pathway)
      // Redirect to check answers page
      return true
    }
    return false
  }

  async onComplete(key: StateKey) {
    await this.store.deleteAssessment(key.sessionId, key.prisonerNumber, key.pathway)
    await this.store.deleteEditedQuestionList(key.sessionId, key.prisonerNumber, key.pathway)
  }

  async getCurrentPage(key: StateKey): Promise<AssessmentPage> {
    return JSON.parse(await this.store.getCurrentPage(key.sessionId, key.prisonerNumber, key.pathway))
  }

  async setCurrentPage(key: StateKey, assessmentPage: AssessmentPage) {
    await this.store.setCurrentPage(key.sessionId, key.prisonerNumber, key.pathway, assessmentPage)
  }

  async prepareSubmission(stateKey: StateKey): Promise<SubmittedInput> {
    const assessment = await this.getAssessment(stateKey)
    const answeredQuestions = await this.store.getAnsweredQuestions(
      stateKey.sessionId,
      stateKey.prisonerNumber,
      stateKey.pathway,
    )
    return {
      questionsAndAnswers: answeredQuestions.map(id => assessment.questionsAndAnswers.find(it => it.question === id)),
    }
  }

  async startEdit(key: StateKey, assessmentPage: AssessmentPage | undefined) {
    await this.store.setEditedQuestionList(key.sessionId, key.prisonerNumber, key.pathway, [])
    if (!assessmentPage) {
      return
    }
    const questionsAndAnswers = {
      questionsAndAnswers: assessmentPage.questionsAndAnswers.map(qAndA => toSubmittedQuestionAndAnswer(qAndA)),
    }
    await this.store.setAssessment(key.sessionId, key.prisonerNumber, key.pathway, questionsAndAnswers)
    const questionIds = questionsAndAnswers.questionsAndAnswers.map(qAndA => qAndA.question)
    await this.store.setAnsweredQuestions(key.sessionId, key.prisonerNumber, key.pathway, questionIds)
  }

  mergeQuestionsAndAnswers(
    assessmentPage: AssessmentPage,
    existingAssessment: SubmittedInput,
  ): SubmittedQuestionAndAnswer[] {
    // Merge together answers from API and cache
    const mergedQuestionsAndAnswers: SubmittedQuestionAndAnswer[] = [...existingAssessment.questionsAndAnswers]
    assessmentPage.questionsAndAnswers.forEach(qAndA => {
      const questionAndAnswerFromCache = existingAssessment?.questionsAndAnswers?.find(
        it => it?.question === qAndA.question.id,
      )
      // Only add if not present in cache
      if (!questionAndAnswerFromCache) {
        mergedQuestionsAndAnswers.push(toSubmittedQuestionAndAnswer(qAndA))
      }
    })

    return mergedQuestionsAndAnswers
  }

  async buildCheckYourAnswers(
    stateKey: StateKey,
    apiAssessment: AssessmentPage,
    cacheInput: SubmittedInput,
  ): Promise<SubmittedQuestionAndAnswer[]> {
    const answeredQuestions = await this.store.getAnsweredQuestions(
      stateKey.sessionId,
      stateKey.prisonerNumber,
      stateKey.pathway,
    )
    if (answeredQuestions.length === 0) {
      // We're just checking previously submitted answers
      return apiAssessment.questionsAndAnswers.map(q => toSubmittedQuestionAndAnswer(q))
    }

    const submission = this.mergeQuestionsAndAnswers(apiAssessment, cacheInput)

    function find(id: string) {
      const questionAndAnswer = submission.find(qAndA => qAndA.question === id)
      if (!questionAndAnswer) {
        logger.info(
          'Missing question id: %s in submission for session %s on %s pathway',
          id,
          stateKey.sessionId,
          stateKey.pathway,
        )
      }
      return questionAndAnswer
    }

    return answeredQuestions.map(id => find(id))
  }
}
