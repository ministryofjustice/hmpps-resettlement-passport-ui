import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import { formatAssessmentResponse } from '../../utils/formatAssessmentResponse'
import { CachedAssessment, CachedQuestionAndAnswer, ValidationErrors } from '../../data/model/immediateNeedsReport'
import validateAssessmentResponse from '../../utils/validateAssessmentResponse'
import { convertApiQuestionAndAnswersToPageWithQuestions, getEnumValue, parseAssessmentType } from '../../utils/utils'
import { AssessmentStateService } from '../../data/assessmentStateService'
import ImmediateNeedsReportView from './immediateNeedsReportView'
import { processReportRequestBody } from '../../utils/processReportRequestBody'
import { Pathway } from '../../@types/express'
import { CHECK_ANSWERS_PAGE_ID } from '../../utils/constants'

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

      const existingAssessmentVersion = await this.rpService.getLatestAssessmentVersion(
        prisonerData.personalDetails.prisonerNumber,
        assessmentType,
        pathway,
      )

      // The default version of the assessment to use in the cache is the version from the existing assessment
      // from the API, or if this is a new assessment from the config
      const defaultVersion = existingAssessmentVersion || configVersion

      // Get the check answers page to check if there's anything to pre-populate the cache with
      const apiAssessmentPage = await this.rpService.getAssessmentPage(
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        CHECK_ANSWERS_PAGE_ID,
        assessmentType,
        defaultVersion,
      )

      const stateKey = {
        prisonerNumber: prisonerData.personalDetails.prisonerNumber,
        userId: req.user.username,
        pathway,
        assessmentType,
      }

      const workingCachedAssessment = await this.assessmentStateService.initialiseCache(
        stateKey,
        defaultVersion,
        apiAssessmentPage.questionsAndAnswers,
      )

      let nextPageId: string

      // If there's an in progress
      const currentPageId =
        workingCachedAssessment.pageLoadHistory[workingCachedAssessment.pageLoadHistory.length - 1]?.pageId

      if (!currentPageId) {
        const nextPage = await this.rpService.fetchNextPage(
          prisonerData.personalDetails.prisonerNumber as string,
          pathway as string,
          workingCachedAssessment.assessment,
          currentPageId,
          assessmentType,
          workingCachedAssessment.assessment.version || 1,
        )

        if (nextPage.error) {
          return next(new Error(`Can't fetch next page - ${nextPage.error}`))
        }

        nextPageId = nextPage.nextPageId
      } else {
        nextPageId = currentPageId
      }

      const submitted = nextPageId === CHECK_ANSWERS_PAGE_ID ? '&submitted=true' : ''

      return res.redirect(
        `/ImmediateNeedsReport/pathway/${pathway}/page/${nextPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&type=${assessmentType}${submitted}`,
      )
    } catch (err) {
      return next(err)
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
        assessmentType,
      }

      const existingWorkingAssessmentVersion = await this.assessmentStateService.getWorkingAssessmentVersion(stateKey)
      const currentApiAssessmentPage = await this.rpService.getAssessmentPage(
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        currentPageId,
        assessmentType,
        existingWorkingAssessmentVersion || 1,
      )

      const editQueryString = edit ? '&edit=true' : ''

      const answeredQuestions = processReportRequestBody(currentApiAssessmentPage, req.body)

      const validationErrors = validateAssessmentResponse(answeredQuestions)

      // prepare current Q&A's from req body for post request
      const dataToSubmit = formatAssessmentResponse(answeredQuestions)

      await this.assessmentStateService.answer(stateKey, dataToSubmit, currentApiAssessmentPage)

      if (validationErrors) {
        const validationErrorsString = encodeURIComponent(JSON.stringify(validationErrors))
        return res.redirect(
          `/ImmediateNeedsReport/pathway/${pathway}/page/${currentPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&validationErrors=${validationErrorsString}${editQueryString}&backButton=${backButton}&type=${assessmentType}`,
        )
      }

      const assessmentFromCache = await this.assessmentStateService.getWorkingAssessment(stateKey)

      const nextPage = await this.rpService.fetchNextPage(
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        dataToSubmit as CachedAssessment,
        currentPageId,
        assessmentType,
        assessmentFromCache.assessment.version || 1,
      )

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
      const redirectAsInvalid = req.query.redirectAsInvalid === 'true'
      const validationErrorsString = req.query.validationErrors as string
      const validationErrors: ValidationErrors = validationErrorsString
        ? JSON.parse(decodeURIComponent(validationErrorsString))
        : null
      const stateKey = {
        prisonerNumber: prisonerData.personalDetails.prisonerNumber,
        userId: req.user.username,
        pathway,
        assessmentType,
      }

      const existingWorkingAssessmentVersion = await this.assessmentStateService.getWorkingAssessmentVersion(stateKey)

      // Get the assessment page from the API
      const apiAssessmentPage = await this.rpService.getAssessmentPage(
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        currentPageId,
        assessmentType,
        existingWorkingAssessmentVersion || 1,
      )

      if (apiAssessmentPage.error) {
        const view = new ImmediateNeedsReportView(
          prisonerData,
          apiAssessmentPage,
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
          redirectAsInvalid,
        )
        return res.render('pages/immediate-needs-report', { ...view.renderArgs })
      }

      // Get the current page with questions
      const pageWithQuestions = convertApiQuestionAndAnswersToPageWithQuestions(apiAssessmentPage)

      // If we're in an edit - check for convergence and skip straight to check your answers if appropriate
      const reConverged = await this.assessmentStateService.checkForConvergence(stateKey, pageWithQuestions)

      if (reConverged) {
        return res.redirect(
          `/ImmediateNeedsReport/pathway/${pathway}/page/${CHECK_ANSWERS_PAGE_ID}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&edit=true&type=${assessmentType}`,
        )
      }

      let mergedQuestionsAndAnswers: CachedQuestionAndAnswer[]

      if (currentPageId === CHECK_ANSWERS_PAGE_ID) {
        // If we are about to render the check answers page we need to either
        // - Clear down the working cache to the answered pages if a valid journey has been made
        // - Reset to the backup cache if we are in an abandoned edit journey
        // - Validate the answers with the backend and error if required
        let invalidAssessment = false
        const workingAssessmentAnsweredQuestions = await this.assessmentStateService.getAllAnsweredQuestionsFromCache(
          stateKey,
          'working',
        )
        const validateWorkingAssessment = await this.rpService.validateAssessment(
          prisonerData.personalDetails.prisonerNumber as string,
          pathway as string,
          workingAssessmentAnsweredQuestions,
          assessmentType,
        )
        if (validateWorkingAssessment.valid) {
          mergedQuestionsAndAnswers = workingAssessmentAnsweredQuestions.questionsAndAnswers
        } else {
          const backupAssessmentAnsweredQuestions = await this.assessmentStateService.getAllAnsweredQuestionsFromCache(
            stateKey,
            'backup',
          )
          if (backupAssessmentAnsweredQuestions) {
            const validateBackupAssessment = await this.rpService.validateAssessment(
              prisonerData.personalDetails.prisonerNumber as string,
              pathway as string,
              backupAssessmentAnsweredQuestions,
              assessmentType,
            )
            if (validateBackupAssessment.valid) {
              // Replace working cache with backup cache
              await this.assessmentStateService.resetWorkingCacheToBackupCache(stateKey)
              mergedQuestionsAndAnswers = backupAssessmentAnsweredQuestions.questionsAndAnswers
            } else {
              invalidAssessment = true
            }
          } else {
            invalidAssessment = true
          }
        }
        // Delete the backup cache and reset the pageLoadHistory in the working cache
        await this.assessmentStateService.updateCachesOnCheckYourAnswers(stateKey, mergedQuestionsAndAnswers)

        // If the assessment is not valid, remove the page load history and redirect to first page (if possible)
        if (invalidAssessment) {
          const firstPage = await this.assessmentStateService.getFirstPageAndResetPageLoadHistory(stateKey)
          if (firstPage) {
            return res.redirect(
              `/ImmediateNeedsReport/pathway/${pathway}/page/${firstPage}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}&backButton=false&type=${assessmentType}&redirectAsInvalid=true`,
            )
          }
          return next(new Error('Cannot find the first page to redirect to after validation of assessment failed'))
        }
      } else {
        // For any other page, update page load history
        await this.assessmentStateService.updatePageLoadHistory(stateKey, pageWithQuestions)
        // Merge the cache and api assessment answers together
        mergedQuestionsAndAnswers = await this.assessmentStateService.getMergedQuestionsAndAnswers(
          stateKey,
          apiAssessmentPage.questionsAndAnswers,
        )
      }

      const view = new ImmediateNeedsReportView(
        prisonerData,
        apiAssessmentPage,
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
        redirectAsInvalid,
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
        assessmentType,
      }

      const assessmentFromCache = await this.assessmentStateService.getWorkingAssessment(stateKey)
      const completeAssessment = (await this.rpService.completeAssessment(
        prisonerData.personalDetails.prisonerNumber as string,
        pathway as string,
        assessmentFromCache.assessment,
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
      prisonerNumber: prisonerData.personalDetails.prisonerNumber,
      userId: req.user.username,
      pathway,
      assessmentType,
    }

    try {
      // If this is a post-submit edit, initialise cache
      if (submitted) {
        const version = (await this.rpService.getLatestAssessmentVersion(prisonerNumber, assessmentType, pathway)) ?? 1
        const apiAssessmentPage = await this.rpService.getAssessmentPage(
          prisonerData.personalDetails.prisonerNumber as string,
          pathway as string,
          CHECK_ANSWERS_PAGE_ID,
          assessmentType,
          version,
        )
        await this.assessmentStateService.initialiseCache(stateKey, version, apiAssessmentPage.questionsAndAnswers)
      }
      await this.assessmentStateService.startEdit(stateKey, pageId)
      const submittedParam = submitted ? '&submitted=true' : ''
      res.redirect(
        `/ImmediateNeedsReport/pathway/${pathway}/page/${pageId}?prisonerNumber=${prisonerNumber}&edit=true&type=${assessmentType}${submittedParam}`,
      )
    } catch (error) {
      next(error)
    }
  }
}
