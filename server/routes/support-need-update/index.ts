import { Router } from 'express'
import { Services } from '../../services'
import SupportNeedUpdateController from './supportNeedUpdateController'

export default (router: Router, services: Services) => {
  const supportNeedUpdateController = new SupportNeedUpdateController(
    services.prisonerDetailsService,
    services.rpService,
  )

  router.get('/support-needs/:pathway/update/:prisonerNeedId', [supportNeedUpdateController.getSupportNeedUpdateForm])
  router.post('/support-needs/:pathway/update/:prisonerNeedId', [supportNeedUpdateController.postSupportNeedUpdateForm])
}
