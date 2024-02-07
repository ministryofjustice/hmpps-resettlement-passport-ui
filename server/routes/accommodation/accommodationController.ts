import { RequestHandler } from 'express'
import AccommodationView from './accommodationView'
import RpService from '../../services/rpService'

export default class AccommodationController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData, BCST2Submitted } = req
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

    const view = new AccommodationView(prisonerData, BCST2Submitted, crsReferrals, accommodation)
    res.render('pages/accommodation', { ...view.renderArgs })
  }
}
