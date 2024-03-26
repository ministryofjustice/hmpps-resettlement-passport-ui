import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AssessmentCompleteView from './assessmentCompleteView'
import { AssessmentType } from '../../data/model/assessmentInformation'
import { parseAssessmentType } from '../../utils/utils'

export default class AssessmentCompleteController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = (req, res, _) => {
    const { prisonerData } = req
    const assessmentType = parseAssessmentType(req.query.type)
    const view = new AssessmentCompleteView(prisonerData, assessmentType)
    res.render('pages/assessment-complete', { ...view.renderArgs })
  }

  postView: RequestHandler = async (req, res, next) => {
    try {
      const { prisonerData } = req
      const assessmentType: AssessmentType = parseAssessmentType(req.body.assessmentType)
      const prisonerNumber = prisonerData.personalDetails.prisonerNumber as string
      const response = await this.rpService.submitAssessment(
        req.user.token,
        req.sessionID,
        prisonerNumber,
        assessmentType,
      )
      if (response.error) {
        next(new Error())
      } else {
        res.redirect(`/assessment-complete?prisonerNumber=${prisonerNumber}&type=${assessmentType}`)
      }
    } catch (err) {
      next(err)
    }
  }
}
