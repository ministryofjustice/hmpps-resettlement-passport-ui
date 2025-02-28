import { Router } from 'express'
import { Services } from '../../services'
import SupportNeedsController from './supportNeedsController'

export default (router: Router, services: Services) => {
  const supportNeedsController = new SupportNeedsController(
    services.rpService,
    services.supportNeedStateService,
    services.prisonerDetailsService,
  )

  router.get('/support-needs/:pathway/start', [
    supportNeedsController.checkLegacyProfile,
    supportNeedsController.startForm,
  ])
  router.get('/support-needs/:pathway', [
    supportNeedsController.checkLegacyProfile,
    supportNeedsController.getSupportNeeds,
  ])
  router.post('/support-needs/:pathway', [
    supportNeedsController.checkLegacyProfile,
    supportNeedsController.submitSupportNeeds,
  ])
  router.get('/support-needs/:pathway/status/:uuid', [
    supportNeedsController.checkLegacyProfile,
    supportNeedsController.getSupportNeedsStatus,
  ])
  router.post('/support-needs/:pathway/status/:uuid', [
    supportNeedsController.checkLegacyProfile,
    supportNeedsController.submitSupportNeedsStatus,
  ])
  router.get('/support-needs/:pathway/check-answers', [
    supportNeedsController.checkLegacyProfile,
    supportNeedsController.getCheckAnswers,
  ])
  router.post('/support-needs/:pathway/complete', [
    supportNeedsController.checkLegacyProfile,
    supportNeedsController.finaliseSupportNeeds,
  ])
}
