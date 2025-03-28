import { Router } from 'express'
import { oneOf, query } from 'express-validator'
import { Services } from '../../services'
import StaffDashboardController from './staffDashboardController'

export default (router: Router, services: Services) => {
  const staffDashboardController = new StaffDashboardController(services.rpService)

  router.get(
    '/',
    [
      query('page').isInt({ min: 0 }).optional(),
      query('sortField')
        .isIn(['name', 'releaseDate', 'releaseEligibilityDate', 'releaseOnTemporaryLicenceDate', 'lastUpdatedDate'])
        .optional(),
      query('sortDirection').isIn(['ASC', 'DESC']).optional(),
      query('releaseTime').isInt({ min: 0 }).optional(),
      query('lastReportCompleted').isIn(['BCST2', 'RESETTLEMENT_PLAN', '', 'NONE']).optional(),
    ],
    oneOf([query('assessmentRequired').isBoolean().optional(), query('assessmentRequired').isEmpty().optional()]),
    [staffDashboardController.getView],
  )
}
