import { Router } from 'express'
import { body } from 'express-validator'
import { Services } from '../../services'
import SupportNeedUpdateController from './supportNeedUpdateController'
import { validatePathwayAndFeatureFlag } from '../supportNeedsCommonMiddleware'

export default (router: Router, services: Services) => {
  const supportNeedUpdateController = new SupportNeedUpdateController(
    services.prisonerDetailsService,
    services.rpService,
  )

  router.get('/support-needs/:pathway/update/:prisonerNeedId', [
    validatePathwayAndFeatureFlag,
    supportNeedUpdateController.getSupportNeedUpdateForm,
  ])

  router.post(
    '/support-needs/:pathway/update/:prisonerNeedId',
    [
      body('updateStatus', 'Select a update status').notEmpty(),
      body('responsibleStaff', 'Select who is responsible for this support need').isArray({ min: 1 }),
      body('additionalDetails', 'Additional details must be 3,000 characters or less').isLength({ max: 3000 }),
    ],
    validatePathwayAndFeatureFlag,
    supportNeedUpdateController.postSupportNeedUpdateForm,
  )
}
