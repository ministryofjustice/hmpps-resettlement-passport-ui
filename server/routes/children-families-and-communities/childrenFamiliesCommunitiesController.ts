import { RequestHandler } from 'express'
import { query, validationResult } from 'express-validator'
import RpService from '../../services/rpService'
import ChildrenFamiliesCommunitiesView from './childrenFamiliesCommunitiesView'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import { handleWhatsNewBanner } from '../whatsNewBanner'
import { getFeatureFlagBoolean } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'

export default class ChildrenFamiliesCommunitiesController {
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
      handleWhatsNewBanner(req, res)
      const supportNeedsEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.SUPPORT_NEEDS)

      const {
        page = '0',
        pageSize = '10',
        sort = 'occurenceDateTime%2CDESC',
        days = '0',
        createdByUserId = '0',
      } = req.query

      const crsReferrals = await this.rpService.getCrsReferrals(
        prisonerData.personalDetails.prisonerNumber as string,
        'CHILDREN_FAMILIES_AND_COMMUNITY',
      )

      const assessmentData = await this.rpService.getAssessmentInformation(
        prisonerData.personalDetails.prisonerNumber as string,
        'CHILDREN_FAMILIES_AND_COMMUNITY',
      )

      const caseNotesData = await this.rpService.getCaseNotesHistory(
        prisonerData.personalDetails.prisonerNumber as string,
        'CHILDREN_FAMILIES_AND_COMMUNITY',
        createdByUserId as string,
        pageSize as string,
        page as string,
        sort as string,
        days as string,
      )

      const caseNotesCreators = await this.rpService.getCaseNotesCreators(
        prisonerData.personalDetails.prisonerNumber as string,
        'CHILDREN_FAMILIES_AND_COMMUNITY',
      )

      let pathwaySupportNeedsSummary = null
      let supportNeedsUpdates = null
      const { supportNeedUpdateFilter = '', supportNeedUpdateSort = 'createdDate,DESC' } = req.query

      if (supportNeedsEnabled) {
        const pathwaySupportNeedsResponse = await this.rpService.getPathwaySupportNeedsSummary(
          prisonerData.personalDetails.prisonerNumber as string,
          'CHILDREN_FAMILIES_AND_COMMUNITY',
        )
        pathwaySupportNeedsSummary = {
          ...pathwaySupportNeedsResponse,
          supportNeedsSet: pathwaySupportNeedsResponse.prisonerNeeds.length > 0,
        }
        supportNeedsUpdates = await this.rpService.getPathwayNeedsUpdates(
          prisonerData.personalDetails.prisonerNumber as string,
          'CHILDREN_FAMILIES_AND_COMMUNITY',
          0,
          1000, // TODO - add pagination, for now just get the first 1000
          supportNeedUpdateSort as string,
          supportNeedUpdateFilter as string,
        )
      }

      const view = new ChildrenFamiliesCommunitiesView(
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
      return res.render('pages/children-families-communities', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}
