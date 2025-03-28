import { RequestHandler } from 'express'
import { ValidationErrors } from '../../data/model/immediateNeedsReport'
import { AssessmentSkipReason, assessmentSkipReasons } from '../../data/model/assessmentInformation'
import RpService from '../../services/rpService'
import logger from '../../../logger'
import PrisonerDetailsService from '../../services/prisonerDetailsService'

export default class AssessmentSkipController {
  constructor(private readonly rpService: RpService, private readonly prisonerDetailsService: PrisonerDetailsService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)
      const validationErrorsString = req.query.validationErrors as string
      const validationErrors: ValidationErrors = validationErrorsString
        ? JSON.parse(decodeURIComponent(validationErrorsString))
        : null

      res.render('pages/assessment-skip', { prisonerData, validationErrors })
    } catch (err) {
      next(err)
    }
  }

  submitForm: RequestHandler = async (req, res, next): Promise<void> => {
    const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromBody(req, res)
    const { prisonerNumber } = prisonerData.personalDetails
    const validationErrors = validateAssessmentSkipForm(req.body)
    if (validationErrors) {
      return res.redirect(
        `/assessment-skip/?prisonerNumber=${prisonerNumber}&validationErrors=${encodeURIComponent(
          JSON.stringify(validationErrors),
        )}`,
      )
    }
    try {
      await this.rpService.postAssessmentSkip(prisonerNumber, {
        reason: req.body.whySkipChoice,
        moreInfo: req.body.supportingInfo,
      })
      return res.redirect(`/assessment-task-list?prisonerNumber=${prisonerNumber}&type=RESETTLEMENT_PLAN`)
    } catch (err) {
      logger.warn(
        `Session: ${req.sessionID} Failed to skip assessment for prisoner: ${prisonerNumber} | ${err.status} ${err}`,
      )
      return next(err)
    }
  }
}

export function validateAssessmentSkipForm(body: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {}
  if (!assessmentSkipReasons.includes(body.whySkipChoice as AssessmentSkipReason)) {
    result.whySkipChoice = 'This field is required'
  }
  return Object.keys(result).length > 0 ? result : null
}
