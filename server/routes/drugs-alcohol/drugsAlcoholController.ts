import { RequestHandler } from 'express'
import { query, validationResult } from 'express-validator'
import RpService from '../../services/rpService'
import DrugsAlcoholView from './drugsAlcoholView'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import { handleWhatsNewBanner } from '../whatsNewBanner'
import { getFeatureFlagBoolean } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'

export default class DrugsAlcoholController {
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
      // Perform validation checks for query parameters
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error(`Validation failed: ${JSON.stringify(errors.array())}`)
      }

      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, true)
      const supportNeedsEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.SUPPORT_NEEDS)

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
        'DRUGS_AND_ALCOHOL',
      )

      const assessmentData = await this.rpService.getAssessmentInformation(
        prisonerData.personalDetails.prisonerNumber as string,
        'DRUGS_AND_ALCOHOL',
      )

      const caseNotesData = await this.rpService.getCaseNotesHistory(
        prisonerData.personalDetails.prisonerNumber as string,
        'DRUGS_AND_ALCOHOL',
        createdByUserId as string,
        pageSize as string,
        page as string,
        sort as string,
        days as string,
      )

      const caseNotesCreators = await this.rpService.getCaseNotesCreators(
        prisonerData.personalDetails.prisonerNumber as string,
        'DRUGS_AND_ALCOHOL',
      )

      let pathwaySupportNeedsSummary = null
      let supportNeedsUpdates = null
      const { supportNeedUpdateFilter = '', supportNeedUpdateSort = 'createdDate,DESC' } = req.query

      if (supportNeedsEnabled) {
        const pathwaySupportNeedsResponse = await this.rpService.getPathwaySupportNeedsSummary(
          prisonerData.personalDetails.prisonerNumber as string,
          'DRUGS_AND_ALCOHOL',
        )
        pathwaySupportNeedsSummary = {
          ...pathwaySupportNeedsResponse,
          supportNeedsSet: pathwaySupportNeedsResponse.prisonerNeeds.length > 0,
        }
        supportNeedsUpdates = await this.rpService.getPathwayNeedsUpdates(
          prisonerData.personalDetails.prisonerNumber as string,
          'DRUGS_AND_ALCOHOL',
          0,
          1000, // TODO - add pagination, for now just get the first 1000
          supportNeedUpdateSort as string,
          supportNeedUpdateFilter as string,
        )
      }

      const view = new DrugsAlcoholView(
        prisonerData,
        crsReferrals,
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
        supportNeedUpdateFilter as string,
      )
      return res.render('pages/drugs-alcohol', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}
