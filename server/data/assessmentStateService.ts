import AssessmentStore from './assessmentStore'
import { createRedisClient } from './redisClient'
import { AssessmentPage, SubmittedInput, SubmittedQuestionAndAnswer } from './model/BCST2Form'
import { getDisplayTextFromQandA } from '../utils/formatAssessmentResponse'
import { AssessmentType } from './model/assessmentInformation'

interface Request {
  prisonerData: {
    personalDetails: {
      prisonerNumber?: string
    }
  }
  session: {
    id: string
  }
}

export function createAssessmentStateService() {
  return new AssessmentStateService(new AssessmentStore(createRedisClient()))
}

export class AssessmentStateService {
  constructor(private readonly store: AssessmentStore) {
    // no-op
  }

  async reset(req: Request, pathway: string) {
    const { prisonerData } = req
    await this.store.deleteAssessment(req.session.id, prisonerData.personalDetails.prisonerNumber, pathway)
    await this.store.deleteEditedQuestionList(req.session.id, prisonerData.personalDetails.prisonerNumber, pathway)
    await this.store.setAssessment(req.session.id, prisonerData.personalDetails.prisonerNumber, pathway, {
      questionsAndAnswers: [],
    })
  }

  async answer(req: Request, pathway: string, answer: SubmittedInput) {
    const { prisonerNumber } = req.prisonerData.personalDetails
    // get previous Q&A's
    const allQuestionsAndAnswers = await this.store.getAssessment(req.session.id, prisonerNumber, pathway)

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

    await this.store.setAssessment(req.session.id, prisonerNumber, pathway, allQuestionsAndAnswers)
  }

  async overwriteWith(req: Request, pathway: string, assessmentPage: AssessmentPage) {
    const { prisonerNumber } = req.prisonerData.personalDetails
    const questionsAndAnswers = {
      questionsAndAnswers: assessmentPage.questionsAndAnswers.map(qAndA => ({
        question: qAndA.question.id,
        questionTitle: qAndA.question.title,
        pageId: qAndA.originalPageId,
        questionType: qAndA.question.type,
        answer: qAndA.answer
          ? {
              answer: qAndA.answer.answer,
              displayText: getDisplayTextFromQandA(qAndA),
              '@class': qAndA.answer['@class'],
            }
          : null,
      })),
    }
    await this.store.setAssessment(req.session.id, prisonerNumber, pathway, questionsAndAnswers)
  }

  async checkIfEditAndHandle(
    req: Request,
    pathway: string,
    assessmentPage: AssessmentPage,
    existingAssessment: SubmittedInput,
    edit: boolean,
    assessmentType: AssessmentType,
  ): Promise<boolean> {
    const { prisonerNumber } = req.prisonerData.personalDetails
    // Get any edited questions from cache
    const editedQuestionIds = await this.store.getEditedQuestionList(req.session.id, prisonerNumber, pathway)

    // If we have any edited questions, check if we have now re-converged to the logic tree - if so update cache and redirect to CHECK_ANSWERS
    if (editedQuestionIds) {
      const reConverged = await this.checkForConvergence(
        assessmentPage,
        existingAssessment,
        editedQuestionIds,
        req,
        pathway,
      )
      if (reConverged) {
        return true
      }
    }

    // If we are in edit mode (inc. a resettlement plan but not on CHECK_ANSWERS) add the current question id to the edited question list in cache
    if (
      (edit || assessmentType === 'RESETTLEMENT_PLAN' || editedQuestionIds) &&
      assessmentPage.id !== 'CHECK_ANSWERS'
    ) {
      const questionList = editedQuestionIds
        ? [...editedQuestionIds, ...assessmentPage.questionsAndAnswers.map(it => it.question.id)]
        : assessmentPage.questionsAndAnswers.map(it => it.question.id)
      await this.store.setEditedQuestionList(req.session.id, prisonerNumber, pathway, questionList)
    }
    return false
  }

  private async checkForConvergence(
    assessmentPage: AssessmentPage,
    existingAssessment: SubmittedInput,
    editedQuestionIds: string[],
    req: Request,
    pathway: string,
  ): Promise<boolean> {
    const { prisonerNumber } = req.prisonerData.personalDetails
    // Get the question ids for the next page (with workaround if next page is CHECK_ANSWER as this contains no new questions)
    const nextPageQuestionIds =
      assessmentPage.id !== 'CHECK_ANSWERS' ? assessmentPage.questionsAndAnswers.map(it => it.question.id) : []
    // Get all question ids currently in cache
    const allQuestionIdsInCache = existingAssessment?.questionsAndAnswers.map(it => it.question)
    // If all the questions on the page we are about to render are in the cache we have converged
    if (nextPageQuestionIds.every(it => allQuestionIdsInCache?.includes(it))) {
      // Get the start and end index of existingAssessment where we diverged and converged
      const editedQuestionsStartIndex = existingAssessment.questionsAndAnswers.findIndex(
        it => it.question === editedQuestionIds[0],
      )
      const editedQuestionsEndIndex = existingAssessment.questionsAndAnswers.findIndex(
        it => it.question === nextPageQuestionIds[0],
      )
      // Get the question ids from the indexes
      const questionIdsPreDivergence = existingAssessment.questionsAndAnswers
        .map(it => it.question)
        .slice(0, editedQuestionsStartIndex)
      // If editedQuestionsEndIndex === -1, it means the next page has no questions on it. In this case we can set the questionIdsPostConvergence to empty.
      const questionIdsPostConvergence =
        editedQuestionsEndIndex !== -1
          ? existingAssessment.questionsAndAnswers
              .map(it => it.question)
              .slice(editedQuestionsEndIndex, existingAssessment.questionsAndAnswers.length)
          : []

      // The new list of question ids is the pre-divergence, edited questions and post-convergence ids de-duped
      const newQuestionIds = [...questionIdsPreDivergence, ...editedQuestionIds, ...questionIdsPostConvergence].filter(
        (item, pos, arr) => {
          return arr.indexOf(item) === pos
        },
      )
      // Convert back to questionsAndAnswers and overwrite the assessment in the cache
      const newQuestionsAndAnswers = newQuestionIds.map(q =>
        existingAssessment.questionsAndAnswers.find(it => it.question === q),
      )
      await this.store.setAssessment(req.session.id, prisonerNumber, pathway, {
        questionsAndAnswers: newQuestionsAndAnswers,
      })
      // Delete the edited question list from cache
      await this.store.deleteEditedQuestionList(req.session.id, prisonerNumber, pathway)
      // Redirect to check answers page
      return true
    }
    return false
  }
}
