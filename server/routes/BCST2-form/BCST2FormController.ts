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

  getFirstPage: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { token } = req.user
      const pathway = req.query.pathway as string

      // Reset the cache at the point as starting new journey through the form
      const store = new AssessmentStore(createRedisClient())
      await store.deleteAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway)
      await store.deleteEditedQuestionList(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway)
      await store.setAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway, {
        questionsAndAnswers: [],
      })

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
      const edit = req.body.edit === 'true'
      const backButton = req.query.backButton === 'true'

      const store = new AssessmentStore(createRedisClient())
      const currentPage = await store.getCurrentPage(
        req.session.id,
        `${prisonerData.personalDetails.prisonerNumber}`,
        pathway,
      )

      const editQueryString = edit ? '&edit=true' : ''

      const validationErrors: ValidationErrors = validateAssessmentResponse(JSON.parse(currentPage), req.body)

      // prepare current Q&A's from req body for post request
      const dataToSubmit: SubmittedInput = formatAssessmentResponse(currentPage, req.body)

      // get previous Q&A's
      const allQuestionsAndAnswers = JSON.parse(
        await store.getAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway),
      ) as SubmittedInput

      dataToSubmit.questionsAndAnswers.forEach((newQandA: SubmittedQuestionAndAnswer) => {
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

      await store.setAssessment(
        req.session.id,
        `${prisonerData.personalDetails.prisonerNumber}`,
        pathway,
        allQuestionsAndAnswers,
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
          `/BCST2/pathway/${pathway}/page/${currentPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&validationErrors=${validationErrorsString}${editQueryString}&backButton=${backButton}`,
        )
      }

      if (!nextPage.error) {
        const { nextPageId } = nextPage

        return res.redirect(
          `/BCST2/pathway/${pathway}/page/${nextPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}${editQueryString}&backButton=${backButton}`,
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
      const edit = req.query.edit === 'true'
      const submitted = req.query.submitted === 'true'
      const backButton = req.query.backButton === 'true'
      const validationErrorsString = req.query.validationErrors as string
      const validationErrors: ValidationErrors = validationErrorsString
        ? JSON.parse(decodeURIComponent(validationErrorsString))
        : null

      const store = new AssessmentStore(createRedisClient())

      // If this is not an edit, ensure there are nothing in the cache for editedQuestionList
      if (!edit) {
        await store.deleteEditedQuestionList(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway)
      }

      // If it's already submitted, reset the cache at this point to the CHECK_ANSWERS
      if (submitted) {
        await store.deleteEditedQuestionList(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway)
        const assessmentPage = await this.rpService.getAssessmentPage(
          token,
          req.sessionID,
          prisonerData.personalDetails.prisonerNumber as string,
          pathway as string,
          'CHECK_ANSWERS',
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
        await store.setAssessment(
          req.session.id,
          `${prisonerData.personalDetails.prisonerNumber}`,
          pathway,
          questionsAndAnswers,
        )
      }

      const existingAssessment = JSON.parse(
        await store.getAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway),
      ) as SubmittedInput

      // If there is nothing in the cache at this point, something has gone wrong so redirect back to the start of the form
      if (!existingAssessment) {
        return res.redirect(
          `/BCST2-next-page?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&pathway=${pathway}`,
        )
      }

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
        )

        // Get any edited questions from cache
        const editedQuestionIds = JSON.parse(
          await store.getEditedQuestionList(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway),
        ) as string[]

        // If we have any edited questions, check if we have now re-converged to the logic tree - if so update cache and redirect to CHECK_ANSWERS
        if (editedQuestionIds && !validationErrors) {
          // Get the question ids for the next page (with workaround if next page is CHECK_ANSWER as this contains no new questions)
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
            const questionIdsPostConvergence = existingAssessment.questionsAndAnswers
              .map(it => it.question)
              .slice(editedQuestionsEndIndex, existingAssessment.questionsAndAnswers.length)
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
              existingAssessment.questionsAndAnswers.find(it => it.question === q),
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
              `/BCST2/pathway/${pathway}/page/CHECK_ANSWERS?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&edit=true`,
            )
          }
        }

        // If we are in edit mode (but not on CHECK_ANSWERS add the current question id to the edited question list in cache
        if ((edit || editedQuestionIds) && assessmentPage.id !== 'CHECK_ANSWERS') {
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
        // If this is an edit and CHECK_ANSWERS then we need to use only the cache to define the questions as these may be different now
        if (assessmentPage.questionsAndAnswers.length !== 0 && !(edit && assessmentPage.id === 'CHECK_ANSWERS')) {
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
        } else {
          mergedQuestionsAndAnswers.push(...existingAssessment.questionsAndAnswers)
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
        edit,
        submitted,
        backButton,
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

      // Clear cache for a completed assessment
      await store.deleteAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway)
      await store.deleteEditedQuestionList(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway)

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
