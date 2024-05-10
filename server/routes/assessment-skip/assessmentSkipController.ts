import { RequestHandler } from 'express'
import { ValidationErrors } from '../../data/model/BCST2Form'

const validSkipChoices = ['completedInOASys', 'completedInAnotherPrison', 'earlyRelease', 'transfer', 'other']

export default class AssessmentSkipController {
  constructor() {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
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
    const { prisonerNumber } = req.body
    const validationErrors = validateAssessmentSkipForm(req.body)
    if (validationErrors) {
      return res.redirect(
        `/assessment-skip/?prisonerNumber=${prisonerNumber}&validationErrors=${encodeURIComponent(
          JSON.stringify(validationErrors),
        )}`,
      )
    }
    // TODO: Persist form in API
    return res.redirect(`/assessment-task-list?prisonerNumber=${prisonerNumber}&type=RESETTLEMENT_PLAN`)
  }
}

export function validateAssessmentSkipForm(body: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {}
  if (!validSkipChoices.includes(body.whySkipChoice)) {
    result.whySkipChoice = 'This field is required'
  }
  return Object.keys(result).length > 0 ? result : null
}
