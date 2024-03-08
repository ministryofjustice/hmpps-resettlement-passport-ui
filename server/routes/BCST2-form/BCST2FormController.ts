import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import BCST2FormView from './BCST2FormView'
import formatAssessmentResponse, { getDisplayTextFromQandA } from '../../utils/formatAssessmentResponse'
import { createRedisClient } from '../../data/redisClient'
import AssessmentStore from '../../data/assessmentStore'
import { SubmittedInput, SubmittedQuestionAndAnswer, ValidationErrors } from '../../data/model/BCST2Form'
import validateAssessmentResponse from '../../utils/validateAssessmentResponse'
import { getEnumValue } from '../../utils/utils'

export default class BCST2FormController {
  constructor(private readonly rpService: RpService) {}

  getNextPage: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { token } = req.user
      const { pathway } = req.query

      const nextPage = await this.rpService.fetchNextPage(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        {
          questionsAndAnswers: null,
        },
        null,
      )
      const { nextPageId } = nextPage

      res.redirect(
        `/BCST2/pathway/${pathway}/page/${nextPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`,
      )
    } catch (err) {
      next(err)
    }
  }

  saveAnswerAndGetNextPage: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { token } = req.user
      const { pathway, currentPageId } = req.body
      const store = new AssessmentStore(createRedisClient())
      const currentPage = await store.getCurrentPage(
        req.session.id,
        `${prisonerData.personalDetails.prisonerNumber}`,
        pathway,
      )

      const validationErrors: ValidationErrors = validateAssessmentResponse(JSON.parse(currentPage), req.body)

      // prepare current Q&A's from req body for post request
      const dataToSubmit: SubmittedInput = formatAssessmentResponse(currentPage, req.body)

      // get previous Q&A's
      const allQuestionsAndAnswers = JSON.parse(
        await store.getAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway),
      )

      if (allQuestionsAndAnswers) {
        dataToSubmit.questionsAndAnswers.forEach((newQandA: SubmittedQuestionAndAnswer) => {
          const index = allQuestionsAndAnswers.questionsAndAnswers.findIndex(
            (existingQandA: SubmittedQuestionAndAnswer) => {
              return existingQandA.question === newQandA.question
            },
          )

          if (index !== -1) {
            // Replace the existing question with the new one
            allQuestionsAndAnswers.questionsAndAnswers[index] = newQandA
          } else {
            // Add the new question if it doesn't exist
            allQuestionsAndAnswers.questionsAndAnswers.push(newQandA)
          }
        })
      }

      await store.setAssessment(
        req.session.id,
        `${prisonerData.personalDetails.prisonerNumber}`,
        pathway,
        allQuestionsAndAnswers || dataToSubmit,
      )

      const nextPage = await this.rpService.fetchNextPage(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        dataToSubmit as SubmittedInput,
        currentPageId,
      )

      if (validationErrors) {
        const validationErrorsString = encodeURIComponent(JSON.stringify(validationErrors))
        return res.redirect(
          `/BCST2/pathway/${pathway}/page/${currentPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&validationErrors=${validationErrorsString}`,
        )
      }

      if (!nextPage.error) {
        const { nextPageId } = nextPage

        return res.redirect(
          `/BCST2/pathway/${pathway}/page/${nextPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`,
        )
      }
      return next(new Error(nextPage.error))
    } catch (err) {
      return next(err)
    }
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { token } = req.user
      const { pathway, currentPageId } = req.params
      const edit = (req.query.edit || false) as boolean
      const validationErrorsString = req.query.validationErrors as string
      const validationErrors: ValidationErrors = validationErrorsString
        ? JSON.parse(decodeURIComponent(validationErrorsString))
        : null

      const store = new AssessmentStore(createRedisClient())

      // Get the assessment page from the API and set in the cache
      const assessmentPage = await this.rpService.getAssessmentPage(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        currentPageId,
      )
      const mergedQuestionsAndAnswers: SubmittedQuestionAndAnswer[] = []

      if (!assessmentPage.error) {
        await store.setCurrentPage(
          req.session.id,
          `${prisonerData.personalDetails.prisonerNumber}`,
          pathway,
          assessmentPage,
          3600,
        )

        // get all Q&A's currently in cache
        const questionsAndAnswersFromCache = JSON.parse(
          await store.getAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway),
        ) as SubmittedInput

        // Get any edited questions from cache
        const editedQuestionIds = JSON.parse(
          await store.getEditedQuestionList(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway),
        ) as string[]

        // If we have any edited questions, check if we have now re-converged to the logic tree - if so update cache and redirect to CHECK_ANSWERS
        if (editedQuestionIds) {
          // Get the question ids for the next page
          const nextPageQuestionIds = assessmentPage.questionsAndAnswers.map(it => it.question.id)
          // Get all question ids currently in cache
          const allQuestionIdsInCache = questionsAndAnswersFromCache?.questionsAndAnswers.map(it => it.question)
          // If all the questions on the next page are in the cache we have converged
          if (nextPageQuestionIds.every(it => allQuestionIdsInCache?.includes(it))) {
            // Get the start and end index of questionsAndAnswersFromCache where we diverged and converged
            const editedQuestionsStartIndex = questionsAndAnswersFromCache.questionsAndAnswers.findIndex(
              it => it.question === editedQuestionIds[0],
            )
            const editedQuestionsEndIndex = questionsAndAnswersFromCache.questionsAndAnswers.findIndex(
              it => it.question === nextPageQuestionIds[0],
            )
            // Get the question ids from the indexes
            const questionIdsPreDivergence = questionsAndAnswersFromCache.questionsAndAnswers
              .map(it => it.question)
              .slice(0, editedQuestionsStartIndex)
            const questionIdsPostConvergence = questionsAndAnswersFromCache.questionsAndAnswers
              .map(it => it.question)
              .slice(editedQuestionsEndIndex, questionsAndAnswersFromCache.questionsAndAnswers.length)
            // The new list of question ids is the pre-divergence, edited questions and post-convergence ids de-duped
            const newQuestionIds = [
              ...questionIdsPreDivergence,
              ...editedQuestionIds,
              ...questionIdsPostConvergence,
            ].filter((item, pos, arr) => {
              return arr.indexOf(item) === pos
            })
            // Convert back to questionsAndAnswers and overwrite the assessment in the cache
            const newQuestionsAndAnswers = newQuestionIds.map(q =>
              questionsAndAnswersFromCache.questionsAndAnswers.find(it => it.question === q),
            )
            await store.setAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway, {
              questionsAndAnswers: newQuestionsAndAnswers,
            })
            // Delete the edited question list from cache
            await store.deleteEditedQuestionList(
              req.session.id,
              `${prisonerData.personalDetails.prisonerNumber}`,
              pathway,
            )
            // Redirect to check answers page
            return res.redirect(
              `/BCST2/pathway/${pathway}/page/CHECK_ANSWERS?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`,
            )
          }
        }

        // If we are in edit mode add the current question id to the edited question list in cache
        if (edit || editedQuestionIds) {
          const questionList = editedQuestionIds
            ? [...editedQuestionIds, ...assessmentPage.questionsAndAnswers.map(it => it.question.id)]
            : assessmentPage.questionsAndAnswers.map(it => it.question.id)
          await store.setEditedQuestionList(
            req.session.id,
            `${prisonerData.personalDetails.prisonerNumber}`,
            pathway,
            questionList,
          )
        }

        // Merge together answers from API and cache
        if (assessmentPage.questionsAndAnswers.length !== 0) {
          assessmentPage.questionsAndAnswers.forEach(qAndA => {
            const questionAndAnswerFromCache = questionsAndAnswersFromCache?.questionsAndAnswers.find(
              it => it.question === qAndA.question.id,
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
        } else {
          mergedQuestionsAndAnswers.push(...questionsAndAnswersFromCache.questionsAndAnswers)
        }

        // If we are about to render the check answers page - update the cache with the current question/answer set
        if (currentPageId === 'CHECK_ANSWERS') {
          await store.setAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway, {
            questionsAndAnswers: mergedQuestionsAndAnswers,
          })
        }
      }

      const view = new BCST2FormView(
        prisonerData,
        assessmentPage,
        pathway,
        {
          questionsAndAnswers: mergedQuestionsAndAnswers,
        },
        validationErrors,
      )
      return res.render('pages/BCST2-form', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }

  completeAssessment: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { token } = req.user
      const { pathway } = req.params
      const store = new AssessmentStore(createRedisClient())
      const isAlreadySubmitted = !prisonerData.assessmentRequired

      const dataToSubmit = JSON.parse(
        await store.getAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway),
      )

      const completeAssessment = (await this.rpService.completeAssessment(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        dataToSubmit as SubmittedInput,
      )) as { error?: string }

      if (completeAssessment.error) {
        next(
          new Error(
            `Error completing assessment for prisoner ${prisonerData.personalDetails.prisonerNumber} pathway ${pathway}`,
          ),
        )
      } else if (isAlreadySubmitted) {
        const { url } = getEnumValue(pathway)
        res.redirect(`/${url}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`)
      } else {
        res.redirect(`/assessment-task-list?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`)
      }
    } catch (err) {
      next(err)
    }
  }
}
