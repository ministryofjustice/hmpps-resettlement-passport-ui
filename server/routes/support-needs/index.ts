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
    supportNeedsController.setPrisonerData,
    supportNeedsController.validatePathwayAndFeatureFlag,
    supportNeedsController.startForm,
  ])
  router.get('/support-needs/:pathway', [
    supportNeedsController.setPrisonerData,
    supportNeedsController.validatePathwayAndFeatureFlag,
    supportNeedsController.getSupportNeeds,
  ])
  router.post('/support-needs/:pathway', [
    supportNeedsController.setPrisonerData,
    supportNeedsController.validatePathwayAndFeatureFlag,
    supportNeedsController.validateSupportNeeds,
    supportNeedsController.submitSupportNeeds,
  ])
  router.get('/support-needs/:pathway/status/:uuid', [
    supportNeedsController.setPrisonerData,
    supportNeedsController.validatePathwayAndFeatureFlag,
    supportNeedsController.getSupportNeedsStatus,
  ])
  router.post('/support-needs/:pathway/status/:uuid', [
    supportNeedsController.setPrisonerData,
    supportNeedsController.validatePathwayAndFeatureFlag,
    supportNeedsController.submitSupportNeedsStatus,
  ])
  router.get('/support-needs/:pathway/check-answers', [
    supportNeedsController.setPrisonerData,
    supportNeedsController.validatePathwayAndFeatureFlag,
    supportNeedsController.getCheckAnswers,
  ])
  router.post('/support-needs/:pathway/complete', [
    supportNeedsController.setPrisonerData,
    supportNeedsController.validatePathwayAndFeatureFlag,
    supportNeedsController.finaliseSupportNeeds,
  ])
  router.post('/support-needs/:pathway/status/:uuid/delete', [
    supportNeedsController.setPrisonerData,
    supportNeedsController.validatePathwayAndFeatureFlag,
    supportNeedsController.deleteSupportNeed,
  ])
}
