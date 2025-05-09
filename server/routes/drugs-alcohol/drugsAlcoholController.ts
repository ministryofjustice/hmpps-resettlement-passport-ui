import { RequestHandler } from 'express'
import { query, validationResult } from 'express-validator'
import RpService from '../../services/rpService'
import DrugsAlcoholView from './drugsAlcoholView'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import { handleWhatsNewBanner } from '../whatsNewBanner'
import { getFeatureFlagBoolean, getPaginationPages } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'
import { badRequestError } from '../../errorHandler'

export default class DrugsAlcoholController {
  constructor(private readonly rpService: RpService, private readonly prisonerDetailsService: PrisonerDetailsService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
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
      let pagination = null

      const { supportNeedUpdateSort = 'createdDate,DESC', supportNeedsUpdatesPage = '0' } = req.query as {
        supportNeedUpdateSort: string
        supportNeedsUpdatesPage: string
      }

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
          parseInt(supportNeedsUpdatesPage, 10),
          10,
          supportNeedUpdateSort as string,
          '',
        )

        const { page: updatesPage, totalElements } = supportNeedsUpdates
        pagination = getPaginationPages(updatesPage, 10, totalElements)
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
        supportNeedsUpdatesPage,
        pagination,
      )
      return res.render('pages/drugs-alcohol', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}
