import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import BCST2FormView from './BCST2FormView'
import formatAssessmentResponse from '../../utils/formatAssessmentResponse'
import { createRedisClient } from '../../data/redisClient'
import AssessmentStore from '../../data/assessmentStore'
import { SubmittedInput, SubmittedQuestionAndAnswer, ValidationErrors } from '../../data/model/BCST2Form'
import validateAssessmentResponse from '../../utils/validateAssessmentResponse'
import { getEnumValue, parseAssessmentType } from '../../utils/utils'
import QuestionAndAnswerService from '../../services/questionAndAnswerService'
import GetAssessmentRequest from '../../data/model/getAssessmentRequest'

export default class BCST2FormController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getFirstPage: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { token } = req.user
      const pathway = req.query.pathway as string
      const assessmentType = parseAssessmentType(req.query.type)

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
      const getAssessmentRequest = new GetAssessmentRequest(req.query.validationErrors as string)

      getAssessmentRequest.prisonerNumber = req.prisonerData.personalDetails.prisonerNumber
      getAssessmentRequest.token = req.user.token
      getAssessmentRequest.pathway = req.params.pathway
      getAssessmentRequest.currentPageId = req.params.currentPageId
      getAssessmentRequest.assessmentType = parseAssessmentType(req.query.type)
      getAssessmentRequest.editMode = req.query.edit === 'true'
      getAssessmentRequest.submitted = req.query.submitted === 'true'
      getAssessmentRequest.backButton = req.query.backButton === 'true'
      getAssessmentRequest.sessionId = req.session.id

      const store = new AssessmentStore(createRedisClient())

      const qAndAService = new QuestionAndAnswerService(this.rpService, store)
      const assessmentResponse = await qAndAService.getAssessmentPage(getAssessmentRequest)

      if (assessmentResponse.redirect) {
        res.redirect(assessmentResponse.redirect)
      }

      const view = new BCST2FormView(
        req.prisonerData,
        assessmentResponse.assessment,
        getAssessmentRequest.pathway,
        {
          questionsAndAnswers: qAndAService.getMergedQAndAs(),
        },
        (req.query.validationErrors as string)
          ? JSON.parse(decodeURIComponent(req.query.validationErrors as string))
          : null,
        getAssessmentRequest.editMode,
        getAssessmentRequest.submitted,
        getAssessmentRequest.backButton,
        getAssessmentRequest.assessmentType,
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

      const dataToSubmit = JSON.parse(
        await store.getAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway),
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
