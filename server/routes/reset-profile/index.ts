import { Router } from 'express'
import { Services } from '../../services'
import ResetProfileController from './resetProfileController'
import { readOnlyGuard } from '../readOnlyGuard'

export default (router: Router, services: Services) => {
  const resetProfileController = new ResetProfileController(
    services.rpService,
    services.appInsightsService,
    services.prisonerDetailsService,
  )
  router.get('/resetProfile', [readOnlyGuard, resetProfileController.resetProfile])
  router.get('/resetProfile/reason', [readOnlyGuard, resetProfileController.resetProfileReason])
  router.post('/resetProfile/reason', [readOnlyGuard, resetProfileController.submitResetProfileReason])
  router.get('/resetProfile/success', [readOnlyGuard, resetProfileController.resetProfileSuccess])
}
