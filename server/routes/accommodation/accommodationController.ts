import { RequestHandler } from 'express'
import AccommodationView from './accommodationView'
import RpService from '../../services/rpService'
import { handleWhatsNewBanner } from '../whatsNewBanner'
import PrisonerDetailsService from '../../services/prisonerDetailsService'

export default class AccommodationController {
  constructor(private readonly rpService: RpService, private readonly prisonerDetailsService: PrisonerDetailsService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, true)

      handleWhatsNewBanner(req, res)

      const {
        page = '0',
        pageSize = '10',
        sort = 'occurenceDateTime%2CDESC',
        days = '0',
        createdByUserId = '0',
      } = req.query

      const crsReferrals = await this.rpService.getCrsReferrals(
        prisonerData.personalDetails.prisonerNumber as string,
        'ACCOMMODATION',
      )

      const accommodation = await this.rpService.getAccommodation(prisonerData.personalDetails.prisonerNumber as string)

      const assessmentData = await this.rpService.getAssessmentInformation(
        prisonerData.personalDetails.prisonerNumber as string,
        'ACCOMMODATION',
      )

      const caseNotesData = await this.rpService.getCaseNotesHistory(
        prisonerData.personalDetails.prisonerNumber as string,
        'ACCOMMODATION',
        createdByUserId as string,
        pageSize as string,
        page as string,
        sort as string,
        days as string,
      )

      const caseNotesCreators = await this.rpService.getCaseNotesCreators(
        prisonerData.personalDetails.prisonerNumber as string,
        'ACCOMMODATION',
      )

      const pathwaySupportNeedsSummary = await this.rpService.getPathwaySupportNeedsSummary(
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
        pathwaySupportNeedsSummary,
      )
      return res.render('pages/accommodation', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}
