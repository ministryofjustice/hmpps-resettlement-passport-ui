import { RequestHandler } from 'express'
import { query, validationResult } from 'express-validator'
import AccommodationView from './accommodationView'
import RpService from '../../services/rpService'
import { handleWhatsNewBanner } from '../whatsNewBanner'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import { getFeatureFlagBoolean } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'
import { badRequestError } from '../../errorHandler'

export default class AccommodationController {
  constructor(private readonly rpService: RpService, private readonly prisonerDetailsService: PrisonerDetailsService) {
    // no op
  }

  // Validation for query parameters
  validateQuery = [
    query('supportNeedUpdateFilter')
      .optional()
      .custom(value => value === '' || /^[0-9]+$/.test(value)) // Check if it's either an empty string or a string with a number
      .withMessage('supportNeedUpdateFilter must be a number or empty'),

    query('supportNeedUpdateSort')
      .optional()
      .isIn(['createdDate,DESC', 'createdDate,ASC'])
      .withMessage('supportNeedUpdateSort must be createdDate,DESC or createdDate,ASC'),
  ]

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      // Load prisoner data
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, true)
      const supportNeedsEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.SUPPORT_NEEDS)

      handleWhatsNewBanner(req, res)

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // Validation failed
        return next(badRequestError('Invalid query parameters'))
      }

      const pageSize = '10'
      const sort = 'occurenceDateTime%2CDESC'
      const days = '0'
      const { page = '0', createdByUserId = '0' } = req.query

      // Fetch data from services
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

      let pathwaySupportNeedsSummary = null
      let supportNeedsUpdates = null
      const { supportNeedUpdateSort = 'createdDate,DESC' } = req.query

      if (supportNeedsEnabled) {
        const pathwaySupportNeedsResponse = await this.rpService.getPathwaySupportNeedsSummary(
          prisonerData.personalDetails.prisonerNumber as string,
          'ACCOMMODATION',
        )
        pathwaySupportNeedsSummary = {
          ...pathwaySupportNeedsResponse,
          supportNeedsSet: pathwaySupportNeedsResponse.prisonerNeeds.length > 0,
        }

        supportNeedsUpdates = await this.rpService.getPathwayNeedsUpdates(
          prisonerData.personalDetails.prisonerNumber as string,
          'ACCOMMODATION',
          0,
          1000, // TODO - add pagination, for now just get the first 1000
          supportNeedUpdateSort as string,
          '',
        )
      }

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
        supportNeedsUpdates,
        supportNeedUpdateSort as string,
      )
      return res.render('pages/accommodation', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}
