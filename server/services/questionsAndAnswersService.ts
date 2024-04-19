import { AssessmentPage, SubmittedInput } from '../data/model/BCST2Form'
import AssessmentStore from '../data/assessmentStore'
import RpService from './rpService'
import GetAssessmentRequest from '../data/model/getAssessmentRequest'
import { getDisplayTextFromQandA } from '../utils/formatAssessmentResponse'

export default class QuestionAndAnswerService {
  private rpService: RpService

  private store: AssessmentStore

  constructor(rpService: RpService, store: AssessmentStore) {
    this.rpService = rpService
    this.store = store
  }

  async deleteQuestionsListWhenNotEditing(getAssessmentReq: GetAssessmentRequest) {
    if (!(getAssessmentReq.editMode || getAssessmentReq.assessmentType === 'RESETTLEMENT_PLAN')) {
      await this.store.deleteEditedQuestionList(
        getAssessmentReq.sessionId,
        `${getAssessmentReq.prisonerNumber}`,
        getAssessmentReq.pathway,
      )
    }
  }

  async resetCacheToCHECK_ANSWERSIfSubmitted(getAssessmentRequest: GetAssessmentRequest) {
    if (getAssessmentRequest.submitted) {
      await this.store.deleteEditedQuestionList(
        getAssessmentRequest.sessionId,
        `${getAssessmentRequest.prisonerNumber}`,
        getAssessmentRequest.pathway,
      )
      const assessmentPage = await this.rpService.getAssessmentPage(
        getAssessmentRequest.token,
        getAssessmentRequest.sessionId,
        getAssessmentRequest.prisonerNumber as string,
        getAssessmentRequest.pathway as string,
        'CHECK_ANSWERS',
        getAssessmentRequest.assessmentType,
      )
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
      await this.store.setAssessment(
        getAssessmentRequest.sessionId,
        `${getAssessmentRequest.prisonerNumber}`,
        getAssessmentRequest.pathway,
        questionsAndAnswers,
      )
    }
  }

  async getExistingAssessment(getAssessmentRequest: GetAssessmentRequest) {
    return JSON.parse(
      await this.store.getAssessment(
        getAssessmentRequest.sessionId,
        `${getAssessmentRequest.prisonerNumber}`,
        getAssessmentRequest.pathway,
      ),
    ) as SubmittedInput
  }

  async getAssessmentPage(getAssessmentRequest: GetAssessmentRequest) {
    return this.rpService.getAssessmentPage(
      getAssessmentRequest.token,
      getAssessmentRequest.sessionId,
      getAssessmentRequest.prisonerNumber as string,
      getAssessmentRequest.pathway as string,
      getAssessmentRequest.currentPageId,
      getAssessmentRequest.assessmentType,
    )
  }

  async setPageAndGetQuestions(getAssessmentRequest: GetAssessmentRequest, assessmentPage: AssessmentPage) {
    await this.store.setCurrentPage(
      getAssessmentRequest.sessionId,
      `${getAssessmentRequest.prisonerNumber}`,
      getAssessmentRequest.pathway,
      assessmentPage,
    )

    return JSON.parse(
      await this.store.getEditedQuestionList(
        getAssessmentRequest.sessionId,
        `${getAssessmentRequest.prisonerNumber}`,
        getAssessmentRequest.pathway,
      ),
    ) as string[]
  }

  async prepareQuestionsAndCache(
    getAssessmentRequest: GetAssessmentRequest,
    existingAssessment: SubmittedInput,
    assessmentPage: AssessmentPage,
    editedQuestionIds: string[],
  ) {
    const nextPageQuestionIds =
      assessmentPage.id !== 'CHECK_ANSWERS' ? assessmentPage.questionsAndAnswers.map(it => it.question.id) : []
    // Get all question ids currently in cache
    const allQuestionIdsInCache = existingAssessment?.questionsAndAnswers.map(it => it.question)
    // If all the questions on the next page are in the cache we have converged
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
      await this.store.setAssessment(
        getAssessmentRequest.sessionId,
        `${getAssessmentRequest.prisonerNumber}`,
        getAssessmentRequest.pathway,
        {
          questionsAndAnswers: newQuestionsAndAnswers,
        },
      )
      // Delete the edited question list from cache
      await this.store.deleteEditedQuestionList(
        getAssessmentRequest.sessionId,
        `${getAssessmentRequest.prisonerNumber}`,
        getAssessmentRequest.pathway,
      )
    }
  }
}
