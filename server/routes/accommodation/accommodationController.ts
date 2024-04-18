import { RequestHandler } from 'express'
import AccommodationView from './accommodationView'
import RpService from '../../services/rpService'

export default class AccommodationController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { token } = req.user
      const {
        page = '0',
        pageSize = '10',
        sort = 'occurenceDateTime%2CDESC',
        days = '0',
        createdByUserId = '0',
      } = req.query

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

      const caseNotesData = await this.rpService.getCaseNotesHistory(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        'ACCOMMODATION',
        createdByUserId as string,
        pageSize as string,
        page as string,
        sort as string,
        days as string,
      )

      const caseNotesCreators = await this.rpService.getCaseNotesCreators(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        'ACCOMMODATION',
      )

      const view = new AccommodationView(
        prisonerData,
        crsReferrals,
        accommodation,
        assessmentData,
        caseNotesData,
        caseNotesCreators,
        createdByUserId as string,
        pageSize as string,
        page as string,
        sort as string,
        days as string,
      )
      res.render('pages/accommodation', { ...view.renderArgs })
    } catch (err) {
      next(err)
    }
  }
}
