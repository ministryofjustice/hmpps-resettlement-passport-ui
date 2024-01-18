import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import DrugsAlcoholView from './drugsAlcoholView'

export default class DrugsAlcoholController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData, BCST2Completed } = req
    const { token } = req.user
    const crsReferrals = await this.rpService.getCrsReferrals(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      'DRUGS_AND_ALCOHOL',
    )

    const view = new DrugsAlcoholView(prisonerData, BCST2Completed, crsReferrals)
    res.render('pages/drugs-alcohol', { ...view.renderArgs })
  }
}
