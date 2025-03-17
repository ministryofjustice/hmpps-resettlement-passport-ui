import { Router } from 'express'
import { query } from 'express-validator'
import { Services } from '../../services'
import PrisonerOverviewController from './prisonerOverviewController'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (router: Router, services: Services) => {
  const controller = new PrisonerOverviewController(
    services.documentService,
    services.rpService,
    services.prisonerDetailsService,
  )

  router.get(
    '/prisoner-overview',
    [
      query('page').isInt({ min: 0 }).optional(),
      query('sort').isIn(['pathway,ASC', 'occurenceDateTime,DESC']).optional(),
      query('days').isInt({ min: 0 }).optional(),
    ],
    [controller.getPrisoner],
  )
}
