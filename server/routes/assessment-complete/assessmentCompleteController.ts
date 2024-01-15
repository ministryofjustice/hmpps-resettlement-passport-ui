import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AssessmentCompleteView from './assessmentCompleteView'

export default class AssessmentCompleteController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const view = new AssessmentCompleteView(prisonerData)
    res.render('pages/assessment-complete', { ...view.renderArgs })
  }
}
