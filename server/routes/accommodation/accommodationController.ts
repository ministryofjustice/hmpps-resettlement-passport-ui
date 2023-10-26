import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AccommodationView from './accommodationView'

export default class AccommodationController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { token } = req.user
    const crsReferrals = await this.rpService.getCrsReferrals(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      'ACCOMMODATION',
    )

    const accommodation = await this.rpService.getAccommodation(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
    )

    const view = new AccommodationView(prisonerData, crsReferrals, accommodation)
    res.render('pages/accommodation', { ...view.renderArgs })
  }
}
