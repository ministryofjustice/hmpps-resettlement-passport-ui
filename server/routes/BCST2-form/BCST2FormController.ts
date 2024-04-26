import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import BCST2FormView from './BCST2FormView'
import formatAssessmentResponse, { getDisplayTextFromQandA } from '../../utils/formatAssessmentResponse'
import { createRedisClient } from '../../data/redisClient'
import AssessmentStore from '../../data/assessmentStore'
import {
  AssessmentPage,
  SubmittedInput,
  SubmittedQuestionAndAnswer,
  ValidationErrors,
} from '../../data/model/BCST2Form'
import validateAssessmentResponse from '../../utils/validateAssessmentResponse'
import { getEnumValue, parseAssessmentType } from '../../utils/utils'
import { AssessmentStateService } from '../../data/assessmentStateService'

export function mergeQuestionsAndAnswers(
  assessmentPage: AssessmentPage,
  existingAssessment: SubmittedInput,
  edit: boolean,
): SubmittedQuestionAndAnswer[] {
  // If this is an edit and CHECK_ANSWERS then we need to use only the cache to define the questions as these may be different now
  if (!(assessmentPage.questionsAndAnswers.length !== 0 && !(edit && assessmentPage.id === 'CHECK_ANSWERS'))) {
    return existingAssessment.questionsAndAnswers
  }

  // Merge together answers from API and cache
  const mergedQuestionsAndAnswers: SubmittedQuestionAndAnswer[] = []
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

  return mergedQuestionsAndAnswers
}

export default class BCST2FormController {
  constructor(private readonly rpService: RpService, private readonly assessmentStateService: AssessmentStateService) {
    // no op
  }

  getFirstPage: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { token } = req.user
      const pathway = req.query.pathway as string
      const assessmentType = parseAssessmentType(req.query.type)

      // Reset the cache at the point as starting new journey through the form
      await this.assessmentStateService.reset(req, pathway)

      const nextPage = await this.rpService.fetchNextPage(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        {
          questionsAndAnswers: null,
        },
        null,
        assessmentType,
      )
      const { nextPageId } = nextPage

      res.redirect(
        `/BCST2/pathway/${pathway}/page/${nextPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&type=${assessmentType}`,
      )
    } catch (err) {
      next(err)
    }
  }

  saveAnswerAndGetNextPage: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { token } = req.user
      const assessmentType = parseAssessmentType(req.body.assessmentType)
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
      await this.assessmentStateService.answer(req, pathway, dataToSubmit)

      const nextPage = await this.rpService.fetchNextPage(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        dataToSubmit as SubmittedInput,
        currentPageId,
        assessmentType,
      )

      if (validationErrors) {
        const validationErrorsString = encodeURIComponent(JSON.stringify(validationErrors))
        return res.redirect(
          `/BCST2/pathway/${pathway}/page/${currentPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&validationErrors=${validationErrorsString}${editQueryString}&backButton=${backButton}&type=${assessmentType}`,
        )
      }

      if (!nextPage.error) {
        const { nextPageId } = nextPage

        return res.redirect(
          `/BCST2/pathway/${pathway}/page/${nextPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}${editQueryString}&backButton=${backButton}&type=${assessmentType}`,
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
      const assessmentType = parseAssessmentType(req.query.type)
      const edit = req.query.edit === 'true'
      const submitted = req.query.submitted === 'true'
      const backButton = req.query.backButton === 'true'
      const validationErrorsString = req.query.validationErrors as string
      const validationErrors: ValidationErrors = validationErrorsString
        ? JSON.parse(decodeURIComponent(validationErrorsString))
        : null

      const store = new AssessmentStore(createRedisClient())

      // If this is not an edit (inc. a resettlement plan), ensure there are nothing in the cache for editedQuestionList
      if (!(edit || assessmentType === 'RESETTLEMENT_PLAN')) {
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
          assessmentType,
        )
        await this.assessmentStateService.overwriteWith(req, pathway, assessmentPage)
      }

      const existingAssessment = await store.getAssessment(
        req.session.id,
        `${prisonerData.personalDetails.prisonerNumber}`,
        pathway,
      )

      // If there is nothing in the cache at this point, something has gone wrong so redirect back to the start of the form
      if (!existingAssessment) {
        return res.redirect(
          `/BCST2-next-page?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&pathway=${pathway}&type=${assessmentType}`,
        )
      }

      // Get the assessment page from the API and set in the cache
      const assessmentPage = await this.rpService.getAssessmentPage(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        currentPageId,
        assessmentType,
      )

      if (assessmentPage.error) {
        const view = new BCST2FormView(
          prisonerData,
          assessmentPage,
          pathway,
          {
            questionsAndAnswers: [],
          },
          validationErrors,
          edit,
          submitted,
          backButton,
          assessmentType,
        )
        return res.render('pages/BCST2-form', { ...view.renderArgs })
      }
      await store.setCurrentPage(
        req.session.id,
        `${prisonerData.personalDetails.prisonerNumber}`,
        pathway,
        assessmentPage,
      )
      let reConverged = false
      if (!validationErrors) {
        reConverged = await this.assessmentStateService.checkIfEditAndHandle(
          req,
          pathway,
          assessmentPage,
          existingAssessment,
          edit,
          assessmentType,
        )
      }

      if (reConverged) {
        return res.redirect(
          `/BCST2/pathway/${pathway}/page/CHECK_ANSWERS?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&edit=true&type=${assessmentType}`,
        )
      }

      const mergedQuestionsAndAnswers: SubmittedQuestionAndAnswer[] = mergeQuestionsAndAnswers(
        assessmentPage,
        existingAssessment,
        edit,
      )
      // If we are about to render the check answers page - update the cache with the current question/answer set
      if (currentPageId === 'CHECK_ANSWERS') {
        await store.setAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway, {
          questionsAndAnswers: mergedQuestionsAndAnswers,
        })
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
        assessmentType,
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
      const assessmentType = parseAssessmentType(req.body.assessmentType)
      const store = new AssessmentStore(createRedisClient())
      const isBcst2AlreadySubmitted = !prisonerData.assessmentRequired
      const isResettlementPlanAlreadySubmitted = !prisonerData.resettlementReviewAvailable

      const dataToSubmit = await store.getAssessment(
        req.session.id,
        `${prisonerData.personalDetails.prisonerNumber}`,
        pathway,
      )

      const completeAssessment = (await this.rpService.completeAssessment(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        dataToSubmit as SubmittedInput,
        assessmentType,
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
      } else if (
        (isBcst2AlreadySubmitted && assessmentType === 'BCST2') ||
        (isResettlementPlanAlreadySubmitted && assessmentType === 'RESETTLEMENT_PLAN')
      ) {
        const { url } = getEnumValue(pathway)
        res.redirect(`/${url}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`)
      } else {
        res.redirect(
          `/assessment-task-list?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&type=${assessmentType}`,
        )
      }
    } catch (err) {
      next(err)
    }
  }
}
