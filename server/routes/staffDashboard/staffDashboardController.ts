import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import StaffDashboardView from './staffDashboardView'
import { ErrorMessage } from '../view'
import RpService from '../../services/rpService'
import { checkSupportNeedsSet, getFeatureFlagBoolean, getPaginationPages } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'
import { handleWhatsNewBanner } from '../whatsNewBanner'
import { badRequestError } from '../../errorHandler'

export default class StaffDashboardController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const supportNeedsEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.SUPPORT_NEEDS)
      const pageSize = 20
      const { userActiveCaseLoad } = res.locals

      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        // Validation failed
        return next(badRequestError('Invalid query parameters'))
      }

      const {
        searchInput = '',
        releaseTime = '0',
        page: currentPage = '0',
        lastReportCompleted = '',
        sortField = 'releaseDate',
        sortDirection = 'ASC',
        reportType = 'pathway-summary',
        watchList = '',
      } = req.query as {
        searchInput: string
        releaseTime: string
        page: string
        lastReportCompleted: string
        sortField: string
        sortDirection: string
        reportType: string
        watchList: string
      }

      let { pathwayView = '', pathwayStatus = '' } = req.query as {
        pathwayView: string
        pathwayStatus: string
      }

      // Ignore pathway status query params if supportNeeds enabled
      if (supportNeedsEnabled) {
        pathwayView = ''
        pathwayStatus = ''
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
        let pagination = null
        if (res.locals.user.authSource === 'nomis') {
          const includePastReleaseDates = await getFeatureFlagBoolean(FEATURE_FLAGS.INCLUDE_PAST_RELEASE_DATES)
          prisonersList = await this.rpService.getListOfPrisoners(
            userActiveCaseLoad.caseLoadId,
            parseInt(currentPage, 10),
            pageSize,
            <string>sortField,
            <string>sortDirection,
            <string>searchInput,
            <string>releaseTime,
            <string>pathwayView,
            <string>modifiedPathwayStatus,
            <string>watchList,
            includePastReleaseDates,
            '',
            lastReportCompleted,
          )
          const { page, totalElements } = prisonersList
          pagination = getPaginationPages(page, pageSize, totalElements)
        }

        const updatedPrisonersList = prisonersList ? checkSupportNeedsSet(prisonersList) : prisonersList

        const view = new StaffDashboardView(
          updatedPrisonersList,
          errors,
          searchInput,
          releaseTime,
          pagination,
          pathwayView,
          modifiedPathwayStatus,
          sortField,
          sortDirection,
          reportType,
          watchList,
          lastReportCompleted,
        )
        return res.render('pages/staff-dashboard', { ...view.renderArgs })
      } catch (err) {
        return next(err)
      }
    } catch (err) {
      return next(err)
    }
  }
}
