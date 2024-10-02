import { Router } from 'express'
import { Services } from '../../services'
import ResetProfileController from './resetProfileController'

export default (router: Router, services: Services) => {
  const resetProfileController = new ResetProfileController(services.rpService)
  router.get('/resetProfile', [resetProfileController.resetProfile])
  router.get('/resetProfile/reason', [resetProfileController.resetProfileReason])
  router.post('/resetProfile/reason', [resetProfileController.submitResetProfileReason])
}
