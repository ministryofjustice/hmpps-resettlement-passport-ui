import { Router } from 'express'
import { body } from 'express-validator'
import { Services } from '../../services'
import SupportNeedUpdateController from './supportNeedUpdateController'

export default (router: Router, services: Services) => {
  const supportNeedUpdateController = new SupportNeedUpdateController(
    services.prisonerDetailsService,
    services.rpService,
  )

  router.get('/support-needs/:pathway/update/:prisonerNeedId', [supportNeedUpdateController.getSupportNeedUpdateForm])

  router.post(
    '/support-needs/:pathway/update/:prisonerNeedId',
    [body('additionalDetails', 'This field must be 3,000 characters or less').isLength({ min: 0, max: 3000 })],
    supportNeedUpdateController.postSupportNeedUpdateForm,
  )
}
