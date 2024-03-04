import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AssessmentCompleteView from './assessmentCompleteView'

export default class AssessmentCompleteController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = (req, res, next) => {
    const { prisonerData } = req
    const view = new AssessmentCompleteView(prisonerData)
    res.render('pages/assessment-complete', { ...view.renderArgs })
  }

  postView: RequestHandler = async (req, res, next) => {
    const { prisonerData } = req
    const prisonerNumber = prisonerData.personalDetails.prisonerNumber as string
    const response = await this.rpService.submitAssessment(req.user.token, req.sessionID, prisonerNumber)
    if (response.error) {
      next(new Error())
    } else {
      res.redirect(`/assessment-complete?prisonerNumber=${prisonerNumber}`)
    }
  }
}
