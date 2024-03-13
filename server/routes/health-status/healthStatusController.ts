import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import HealthStatusView from './healthStatusView'

export default class HealthStatusController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { token } = req.user
      const crsReferrals = await this.rpService.getCrsReferrals(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        'HEALTH',
      )

      const assessmentData = await this.rpService.getAssessmentInformation(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        'HEALTH',
      )

      const view = new HealthStatusView(prisonerData, crsReferrals, assessmentData)
      res.render('pages/health', { ...view.renderArgs })
    } catch (err) {
      next(err)
    }
  }
}
