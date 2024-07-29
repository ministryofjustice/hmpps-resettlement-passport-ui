import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import { formatAssessmentResponse } from '../../utils/formatAssessmentResponse'
import {
  AssessmentPage,
  SubmittedInput,
  SubmittedQuestionAndAnswer,
  ValidationErrors,
} from '../../data/model/immediateNeedsReport'
import validateAssessmentResponse from '../../utils/validateAssessmentResponse'
import { getEnumValue, parseAssessmentType } from '../../utils/utils'
import { AssessmentStateService } from '../../data/assessmentStateService'
import ImmediateNeedsReportView from './immediateNeedsReportView'
import logger from '../../../logger'
import { processReportRequestBody } from '../../utils/processReportRequestBody'
import { Pathway } from '../../@types/express'

export default class ImmediateNeedsReportController {
  constructor(private readonly rpService: RpService, private readonly assessmentStateService: AssessmentStateService) {
    // no op
  }

  getFirstPage: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData, config } = req
      const { type } = req.query
      const pathway = req.query.pathway as Pathway
      const assessmentType = parseAssessmentType(type)
      const reportType = assessmentType === 'BCST2' ? 'immediateNeedsVersion' : 'preReleaseVersion'
      const configVersion = config.reports[reportType][pathway]

      // TODO: Check for version in database

      const stateKey = {
        prisonerNumber: prisonerData.personalDetails.prisonerNumber,
        userId: req.user.username,
        pathway,
      }

      const existingInput = await this.assessmentStateService.prepareSubmission(stateKey, configVersion)
      const { questionsAndAnswers } = existingInput
      let currentPageId = null

      if (questionsAndAnswers?.length > 0) {
        const lastAnsweredQ = questionsAndAnswers[questionsAndAnswers.length - 1]
        currentPageId = lastAnsweredQ.pageId
      }

      const nextPage = await this.rpService.fetchNextPage(
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        existingInput,
        currentPageId,
        assessmentType,
        existingInput.version,
      )

      const { nextPageId } = nextPage
      const submitted = nextPageId === 'CHECK_ANSWERS' ? '&submitted=true' : ''

      res.redirect(
        `/ImmediateNeedsReport/pathway/${pathway}/page/${nextPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&type=${assessmentType}${submitted}`,
      )
    } catch (err) {
      next(err)
    }
  }

  saveAnswerAndGetNextPage: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const assessmentType = parseAssessmentType(req.body.assessmentType)
      const { pathway, currentPageId } = req.body
      const edit = req.body.edit === 'true'
      const backButton = req.query.backButton === 'true'
      const stateKey = {
        prisonerNumber: prisonerData.personalDetails.prisonerNumber,
        userId: req.user.username,
        pathway,
      }
      const currentPage = await this.assessmentStateService.getCurrentPage(stateKey)

      const editQueryString = edit ? '&edit=true' : ''

      const answeredQuestions = processReportRequestBody(currentPage, req.body)

      const validationErrors: ValidationErrors = validateAssessmentResponse(answeredQuestions)

      // prepare current Q&A's from req body for post request
      const dataToSubmit: SubmittedInput = formatAssessmentResponse(answeredQuestions)
      await this.assessmentStateService.answer(stateKey, dataToSubmit, edit)

      const existingAssessment = await this.assessmentStateService.getAssessment(stateKey)

      const nextPage = await this.rpService.fetchNextPage(
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        dataToSubmit as SubmittedInput,
        currentPageId,
        assessmentType,
        existingAssessment.version,
      )

      if (validationErrors) {
        const validationErrorsString = encodeURIComponent(JSON.stringify(validationErrors))
        return res.redirect(
          `/ImmediateNeedsReport/pathway/${pathway}/page/${currentPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&validationErrors=${validationErrorsString}${editQueryString}&backButton=${backButton}&type=${assessmentType}`,
        )
      }

      if (!nextPage.error) {
        const { nextPageId } = nextPage

        return res.redirect(
          `/ImmediateNeedsReport/pathway/${pathway}/page/${nextPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}${editQueryString}&backButton=${backButton}&type=${assessmentType}`,
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
      const { pathway, currentPageId } = req.params
      const assessmentType = parseAssessmentType(req.query.type)
      const edit = req.query.edit === 'true'
      const submitted = req.query.submitted === 'true'
      const backButton = req.query.backButton === 'true'
      const validationErrorsString = req.query.validationErrors as string
      const validationErrors: ValidationErrors = validationErrorsString
        ? JSON.parse(decodeURIComponent(validationErrorsString))
        : null
      const stateKey = {
        prisonerNumber: prisonerData.personalDetails.prisonerNumber,
        userId: req.user.username,
        pathway,
      }

      // If this is not an edit (inc. a resettlement plan), ensure there are nothing in the cache for editedQuestionList
      if (!(edit || assessmentType === 'RESETTLEMENT_PLAN')) {
        await this.assessmentStateService.deleteEditedQuestionList(stateKey, pathway)
      }

      const existingAssessment = await this.assessmentStateService.getAssessment(stateKey)

      // Get the assessment page from the API and set in the cache
      const assessmentPage: AssessmentPage = await this.rpService.getAssessmentPage(
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        currentPageId,
        assessmentType,
        Number(existingAssessment.version),
      )

      if (assessmentPage.error) {
        const view = new ImmediateNeedsReportView(
          prisonerData,
          assessmentPage,
          pathway,
          {
            questionsAndAnswers: [],
            version: null,
          },
          validationErrors,
          edit,
          submitted,
          backButton,
          assessmentType,
        )
        return res.render('pages/immediate-needs-report', { ...view.renderArgs })
      }
      await this.assessmentStateService.setCurrentPage(stateKey, assessmentPage)

      let reConverged = false
      if (!validationErrors) {
        reConverged = await this.assessmentStateService.checkForConvergence(stateKey, assessmentPage, edit)
      }

      if (reConverged) {
        return res.redirect(
          `/ImmediateNeedsReport/pathway/${pathway}/page/CHECK_ANSWERS?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&edit=true&type=${assessmentType}`,
        )
      }

      let mergedQuestionsAndAnswers: SubmittedQuestionAndAnswer[]

      if (currentPageId === 'CHECK_ANSWERS') {
        // If we are about to render the check answers page - make sure we only show answered questions
        mergedQuestionsAndAnswers = await this.assessmentStateService.buildCheckYourAnswers(
          stateKey,
          assessmentPage,
          existingAssessment,
        )
      } else {
        mergedQuestionsAndAnswers = this.assessmentStateService.mergeQuestionsAndAnswers(
          assessmentPage,
          existingAssessment,
        )
      }

      const view = new ImmediateNeedsReportView(
        prisonerData,
        assessmentPage,
        pathway,
        {
          questionsAndAnswers: mergedQuestionsAndAnswers,
          version: null,
        },
        validationErrors,
        edit,
        submitted,
        backButton,
        assessmentType,
      )
      return res.render('pages/immediate-needs-report', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }

  completeAssessment: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { pathway } = req.params
      const assessmentType = parseAssessmentType(req.body.assessmentType)

      const stateKey = {
        prisonerNumber: prisonerData.personalDetails.prisonerNumber,
        userId: req.user.username,
        pathway,
      }

      const dataToSubmit = await this.assessmentStateService.prepareSubmission(stateKey)
      if (dataToSubmit.questionsAndAnswers.length === 0) {
        logger.warn('Nothing entered on submit, returning to task list page. session id: %s', req.sessionID)
        return res.redirect(
          `/assessment-task-list?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&type=${assessmentType}`,
        )
      }

      const completeAssessment = (await this.rpService.completeAssessment(
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        dataToSubmit as SubmittedInput,
        assessmentType,
      )) as { error?: string }

      if (completeAssessment.error) {
        return next(
          new Error(
            `Error completing assessment for prisoner ${prisonerData.personalDetails.prisonerNumber} pathway ${pathway}`,
          ),
        )
      }
      // Clear cache for a completed assessment
      await this.assessmentStateService.onComplete(stateKey)

      if (
        (prisonerData.immediateNeedsSubmitted && assessmentType === 'BCST2') ||
        (prisonerData.preReleaseSubmitted && assessmentType === 'RESETTLEMENT_PLAN')
      ) {
        const { url } = getEnumValue(pathway)
        return res.redirect(`/${url}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`)
      }
      return res.redirect(
        `/assessment-task-list?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&type=${assessmentType}`,
      )
    } catch (err) {
      return next(err)
    }
  }

  startEdit: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { pathway, pageId } = req.params
    const submitted = req.query.submitted === 'true'
    const assessmentType = parseAssessmentType(req.query.type)
    const { prisonerNumber } = prisonerData.personalDetails
    const stateKey = {
      prisonerNumber,
      userId: req.user.username,
      pathway,
    }

    try {
      // If it's already submitted, we may reset the cache at this point to the CHECK_ANSWERS
      let assessmentPage: AssessmentPage
      const existingAssessment = await this.assessmentStateService.getAssessment(stateKey)
      const { version } = existingAssessment
      if (submitted) {
        assessmentPage = await this.rpService.getAssessmentPage(
          prisonerData.personalDetails.prisonerNumber as string,
          pathway as string,
          'CHECK_ANSWERS',
          assessmentType,
          version,
        )
      }
      await this.assessmentStateService.startEdit(stateKey, assessmentPage, version)
      const submittedParam = submitted ? '&submitted=true' : ''
      res.redirect(
        `/ImmediateNeedsReport/pathway/${pathway}/page/${pageId}?prisonerNumber=${prisonerNumber}&edit=true&type=${assessmentType}${submittedParam}`,
      )
    } catch (error) {
      next(error)
    }
  }
}
