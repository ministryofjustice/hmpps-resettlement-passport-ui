import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import HealthStatusView from './healthStatusView'

export default class HealthStatusController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData, BCST2Submitted } = req
    const { token } = req.user
    const crsReferrals = await this.rpService.getCrsReferrals(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      'HEALTH',
    )

    const view = new HealthStatusView(prisonerData, BCST2Submitted, crsReferrals)
    res.render('pages/health', { ...view.renderArgs })
  }
}
