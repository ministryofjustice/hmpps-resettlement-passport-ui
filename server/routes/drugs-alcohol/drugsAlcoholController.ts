import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import DrugsAlcoholView from './drugsAlcoholView'

export default class DrugsAlcoholController {
  constructor(private readonly prisonService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { token } = req.user
    const crsReferrals = await this.prisonService.getCrsReferrals(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      'DRUGS_AND_ALCOHOL',
    )

    const view = new DrugsAlcoholView(prisonerData, crsReferrals)
    res.render('pages/drugs-alcohol', { ...view.renderArgs })
  }
}
