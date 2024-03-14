import { RequestHandler } from 'express'
import AccommodationView from './accommodationView'
import RpService from '../../services/rpService'

export default class AccommodationController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
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

      const assessmentData = await this.rpService.getAssessmentInformation(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        'ACCOMMODATION',
      )

      const view = new AccommodationView(prisonerData, crsReferrals, accommodation, assessmentData)
      res.render('pages/accommodation', { ...view.renderArgs })
    } catch (err) {
      next(err)
    }
  }
}
