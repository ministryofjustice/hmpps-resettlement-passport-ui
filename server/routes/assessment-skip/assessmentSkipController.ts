import { RequestHandler } from 'express'

export default class AssessmentSkipController {
  constructor() {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req

      res.render('pages/assessment-skip', { prisonerData })
    } catch (err) {
      next(err)
    }
  }

  submitForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerNumber } = req.body

    res.redirect(`/assessment-task-list?prisonerNumber=${prisonerNumber}&type=RESETTLEMENT_PLAN`)
  }
}
