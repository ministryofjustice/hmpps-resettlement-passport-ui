import { Router } from 'express'
import { Services } from '../../services'
import SupportNeedsController from './supportNeedsController'

export default (router: Router, services: Services) => {
  const supportNeedsController = new SupportNeedsController(
    services.supportNeedStateService,
    services.prisonerDetailsService,
  )

  router.get('/support-needs/:pathway/reset', [supportNeedsController.resetSupportNeedsCache])
  router.get('/support-needs/:pathway', [supportNeedsController.getSupportNeeds])
  router.post('/support-needs/:pathway', [supportNeedsController.submitSupportNeeds])
  router.get('/support-needs/:pathway/status', [supportNeedsController.getSupportNeedsStatus])
  router.post('/support-needs/:pathway/status', [supportNeedsController.submitSupportNeedsStatus])
  router.post('/support-needs/:pathway/complete', [supportNeedsController.finaliseSupportNeeds])
}
