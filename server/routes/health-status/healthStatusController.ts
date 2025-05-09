import { RequestHandler } from 'express'
import { query, validationResult } from 'express-validator'
import RpService from '../../services/rpService'
import HealthStatusView from './healthStatusView'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import { handleWhatsNewBanner } from '../whatsNewBanner'
import { getFeatureFlagBoolean, getPaginationPages } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'
import { badRequestError } from '../../errorHandler'

export default class HealthStatusController {
  constructor(private readonly rpService: RpService, private readonly prisonerDetailsService: PrisonerDetailsService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, true)
      handleWhatsNewBanner(req, res)
      const supportNeedsEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.SUPPORT_NEEDS)

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // Validation failed
        return next(badRequestError('Invalid query parameters'))
      }

      const pageSize = '10'
      const sort = 'occurenceDateTime%2CDESC'
      const days = '0'
      const { page = '0', createdByUserId = '0' } = req.query

      const crsReferrals = await this.rpService.getCrsReferrals(
        prisonerData.personalDetails.prisonerNumber as string,
        'HEALTH',
      )

      const assessmentData = await this.rpService.getAssessmentInformation(
        prisonerData.personalDetails.prisonerNumber as string,
        'HEALTH',
      )

      const caseNotesData = await this.rpService.getCaseNotesHistory(
        prisonerData.personalDetails.prisonerNumber as string,
        'HEALTH',
        createdByUserId as string,
        pageSize as string,
        page as string,
        sort as string,
        days as string,
      )

      const caseNotesCreators = await this.rpService.getCaseNotesCreators(
        prisonerData.personalDetails.prisonerNumber as string,
        'HEALTH',
      )

      let pathwaySupportNeedsSummary = null
      let supportNeedUpdates = null
      let pagination = null

      const { supportNeedUpdateSort = 'createdDate,DESC', supportNeedsUpdatesPage = '0' } = req.query as {
        supportNeedUpdateSort: string
        supportNeedsUpdatesPage: string
      }

      if (supportNeedsEnabled) {
        const pathwaySupportNeedsResponse = await this.rpService.getPathwaySupportNeedsSummary(
          prisonerData.personalDetails.prisonerNumber as string,
          'HEALTH',
        )
        pathwaySupportNeedsSummary = {
          ...pathwaySupportNeedsResponse,
          supportNeedsSet: pathwaySupportNeedsResponse.prisonerNeeds.length > 0,
        }
        supportNeedUpdates = await this.rpService.getPathwayNeedsUpdates(
          prisonerData.personalDetails.prisonerNumber as string,
          'HEALTH',
          parseInt(supportNeedsUpdatesPage, 10),
          10,
          supportNeedUpdateSort as string,
          '',
        )

        const { page: updatesPage, totalElements } = supportNeedUpdates
        pagination = getPaginationPages(updatesPage, 10, totalElements)
      }

      const view = new HealthStatusView(
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
        supportNeedUpdates,
        supportNeedUpdateSort as string,
        supportNeedsUpdatesPage,
        pagination,
      )
      return res.render('pages/health', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}
