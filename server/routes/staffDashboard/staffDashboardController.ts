import { RequestHandler } from 'express'
import StaffDashboardView from './staffDashboardView'
import { ErrorMessage } from '../view'
import RpService from '../../services/rpService'
import { getFeatureFlagBoolean } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'
import { handleWhatsNewBanner } from '../whatsNewBanner'

export default class StaffDashboardController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { userActiveCaseLoad } = res.locals
      const {
        searchInput = '',
        releaseTime = '0',
        page = '0',
        pathwayView = '',
        pathwayStatus = '',
        assessmentRequired = '',
        sortField = 'releaseDate',
        sortDirection = 'ASC',
        reportType = 'pathway-summary',
        watchList = '',
      } = req.query as {
        searchInput: string
        releaseTime: string
        page: string
        pathwayView: string
        pathwayStatus: string
        assessmentRequired: string
        sortField: string
        sortDirection: string
        reportType: string
        watchList: string
      }

      // Only submit pathway status if pathwayView is applied
      let modifiedPathwayStatus = pathwayStatus
      if (pathwayView === '') {
        modifiedPathwayStatus = ''
      }

      const errors: ErrorMessage[] = []
      let prisonersList = null

      try {
        handleWhatsNewBanner(req, res)
        // Only NOMIS users can access the list prisoners functionality at present
        if (res.locals.user.authSource === 'nomis') {
          const includePastReleaseDates = await getFeatureFlagBoolean(FEATURE_FLAGS.INCLUDE_PAST_RELEASE_DATES)
          prisonersList = await this.rpService.getListOfPrisoners(
            userActiveCaseLoad.caseLoadId,
            parseInt(page, 10),
            20,
            <string>sortField,
            <string>sortDirection,
            <string>searchInput,
            <string>releaseTime,
            <string>pathwayView,
            <string>modifiedPathwayStatus,
            <string>assessmentRequired,
            <string>watchList,
            includePastReleaseDates,
          )
        }
        const view = new StaffDashboardView(
          prisonersList,
          errors,
          searchInput,
          releaseTime,
          page,
          pathwayView,
          modifiedPathwayStatus,
          sortField,
          sortDirection,
          reportType,
          assessmentRequired,
          watchList,
        )
        res.render('pages/staff-dashboard', { ...view.renderArgs })
      } catch (err) {
        next(err)
      }
    } catch (err) {
      next(err)
    }
  }
}
