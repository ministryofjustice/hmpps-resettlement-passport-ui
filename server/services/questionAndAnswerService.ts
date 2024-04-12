import { SubmittedInput, SubmittedQuestionAndAnswer } from '../data/model/BCST2Form'
import AssessmentStore from '../data/assessmentStore'
import { getDisplayTextFromQandA } from '../utils/formatAssessmentResponse'
import RpService from './rpService'
import GetAssessmentRequest from '../data/model/getAssessmentRequest'
import GetAssessmentResponse from '../data/model/getAssessmentResponse'

export default class QuestionAndAnswerService {
  private rpService: RpService

  private store: AssessmentStore

  constructor(rpService: RpService, store: AssessmentStore) {
    this.rpService = rpService
    this.store = store
  }

  async getAssessmentPage(getAssessmentReq: GetAssessmentRequest): Promise<GetAssessmentResponse> {
    // If this is not an edit (inc. a resettlement plan), ensure there are nothing in the cache for editedQuestionList
    if (!(getAssessmentReq.editMode || getAssessmentReq.assessmentType === 'RESETTLEMENT_PLAN')) {
      await this.store.deleteEditedQuestionList(
        getAssessmentReq.sessionId,
        `${getAssessmentReq.prisonerNumber}`,
        getAssessmentReq.pathway,
      )
    }

    // If it's already submitted, reset the cache at this point to the CHECK_ANSWERS
    if (getAssessmentReq.submitted) {
      await this.#isSubmittedPath(getAssessmentReq)
    }

    const existingAssessment = JSON.parse(
      await this.store.getAssessment(
        getAssessmentReq.sessionId,
        `${getAssessmentReq.prisonerNumber}`,
        getAssessmentReq.pathway,
      ),
    ) as SubmittedInput

    // Get the assessment page from the API and set in the cache
    const assessmentPage = await this.rpService.getAssessmentPage(
      getAssessmentReq.token,
      getAssessmentReq.sessionId,
      getAssessmentReq.prisonerNumber as string,
      getAssessmentReq.pathway as string,
      getAssessmentReq.currentPageId,
      getAssessmentReq.assessmentType,
    )
    const mergedQuestionsAndAnswers: SubmittedQuestionAndAnswer[] = []

    if (!assessmentPage.error) {
      await this.store.setCurrentPage(
        getAssessmentReq.sessionId,
        `${getAssessmentReq.prisonerNumber}`,
        getAssessmentReq.pathway,
        assessmentPage,
      )

      // Get any edited questions from cache
      const editedQuestionIds = JSON.parse(
        await this.store.getEditedQuestionList(
          getAssessmentReq.sessionId,
          `${getAssessmentReq.prisonerNumber}`,
          getAssessmentReq.pathway,
        ),
      ) as string[]

      if (!existingAssessment) {
        return this.#noExistingAssessmentPath(getAssessmentReq)
      }

      let nextPageQuestionIds: string[]
      let allQuestionIdsInCache: string[]

      if (editedQuestionIds && !getAssessmentReq.validationErrors) {
        nextPageQuestionIds =
          assessmentPage.id !== 'CHECK_ANSWERS' ? assessmentPage.questionsAndAnswers.map(it => it.question.id) : []
        // Get all question ids currently in cache
        allQuestionIdsInCache = existingAssessment?.questionsAndAnswers.map(it => it.question)
        const res = await this.#editedQuestionsPath(
          editedQuestionIds,
          getAssessmentReq,
          nextPageQuestionIds,
          allQuestionIdsInCache,
          existingAssessment,
        )
        if (res.redirect) {
          return res
        }
      }

      // If we are in edit mode (inc. a resettlement plan but not on CHECK_ANSWERS) add the current question id to the edited question list in cache
      if (
        (getAssessmentReq.editMode || getAssessmentReq.assessmentType === 'RESETTLEMENT_PLAN' || editedQuestionIds) &&
        assessmentPage.id !== 'CHECK_ANSWERS'
      ) {
        const questionList = editedQuestionIds
          ? [...editedQuestionIds, ...assessmentPage.questionsAndAnswers.map(it => it.question.id)]
          : assessmentPage.questionsAndAnswers.map(it => it.question.id)
        await this.store.setEditedQuestionList(
          getAssessmentReq.sessionId,
          `${getAssessmentReq.prisonerNumber}`,
          getAssessmentReq.pathway,
          questionList,
        )
      }

      // Merge together answers from API and cache
      // If this is an edit and CHECK_ANSWERS then we need to use only the cache to define the questions as these may be different now
      assessmentPage.questionsAndAnswers.forEach(qAndA => {
        const questionAndAnswerFromCache = existingAssessment?.questionsAndAnswers?.find(
          it => it?.question === qAndA.question.id,
        )
        // Cache always takes precedence
        if (questionAndAnswerFromCache) {
          mergedQuestionsAndAnswers.push(questionAndAnswerFromCache)
        } else {
          mergedQuestionsAndAnswers.push({
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
          })
        }
      })

      // If we are about to render the check answers page - update the cache with the current question/answer set
      if (getAssessmentReq.currentPageId === 'CHECK_ANSWERS') {
        await this.store.setAssessment(
          getAssessmentReq.sessionId,
          `${getAssessmentReq.prisonerNumber}`,
          getAssessmentReq.pathway,
          {
            questionsAndAnswers: mergedQuestionsAndAnswers,
          },
        )
      }
      return null
    }
    const res = new GetAssessmentResponse()
    res.assessment = assessmentPage
    return res
  }

  getMergedQAndAs(): SubmittedQuestionAndAnswer[] {
    return null
  }

  async #isSubmittedPath(getAssessmentReq: GetAssessmentRequest): Promise<void> {
    await this.store.deleteEditedQuestionList(
      getAssessmentReq.sessionId,
      `${getAssessmentReq.prisonerNumber}`,
      getAssessmentReq.pathway,
    )
    const assessmentPage = await this.rpService.getAssessmentPage(
      getAssessmentReq.token,
      getAssessmentReq.sessionId,
      getAssessmentReq.prisonerNumber as string,
      getAssessmentReq.pathway as string,
      'CHECK_ANSWERS',
      getAssessmentReq.assessmentType,
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
      getAssessmentReq.sessionId,
      `${getAssessmentReq.prisonerNumber}`,
      getAssessmentReq.pathway,
      questionsAndAnswers,
    )
  }

  #noExistingAssessmentPath(getAssessmentReq: GetAssessmentRequest): GetAssessmentResponse {
    const res = new GetAssessmentResponse()
    res.redirect = `/BCST2-next-page?prisonerNumber=${getAssessmentReq.prisonerNumber}&pathway=${
      getAssessmentReq.pathway
    }&type=${getAssessmentReq.assessmentType.toString()}`
    return res
  }

  // TODO: this is still horribly complex and should be further broken down
  async #editedQuestionsPath(
    editedQuestionIds: string[],
    getAssessmentReq: GetAssessmentRequest,
    nextPageQuestionIds: string[],
    allQuestionIdsInCache: string[],
    existingAssessment: SubmittedInput,
  ): Promise<GetAssessmentResponse | null> {
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
        getAssessmentReq.sessionId,
        `${getAssessmentReq.prisonerNumber}`,
        getAssessmentReq.pathway,
        {
          questionsAndAnswers: newQuestionsAndAnswers,
        },
      )
      // Delete the edited question list from cache
      await this.store.deleteEditedQuestionList(
        getAssessmentReq.sessionId,
        `${getAssessmentReq.prisonerNumber}`,
        getAssessmentReq.pathway,
      )
      // Redirect to check answers page
      const res = new GetAssessmentResponse()
      res.redirect = `/BCST2/pathway/${getAssessmentReq.pathway}/page/CHECK_ANSWERS?prisonerNumber=${getAssessmentReq.prisonerNumber}&edit=true&type=${getAssessmentReq.assessmentType}`
      return res
    }
    return null
  }
}
