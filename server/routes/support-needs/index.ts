import { Router } from 'express'
import { Services } from '../../services'
import SupportNeedsController from './supportNeedsController'
import { validatePathwayAndFeatureFlag } from '../supportNeedsCommonMiddleware'

export default (router: Router, services: Services) => {
  const supportNeedsController = new SupportNeedsController(
    services.rpService,
    services.supportNeedStateService,
    services.prisonerDetailsService,
  )

  router.get('/support-needs/:pathway/start', [
    supportNeedsController.setPrisonerData,
    validatePathwayAndFeatureFlag,
    supportNeedsController.startForm,
  ])
  router.get('/support-needs/:pathway', [
    supportNeedsController.setPrisonerData,
    validatePathwayAndFeatureFlag,
    supportNeedsController.getSupportNeeds,
  ])
  router.post('/support-needs/:pathway', [
    supportNeedsController.setPrisonerData,
    validatePathwayAndFeatureFlag,
    supportNeedsController.validateSupportNeeds,
    supportNeedsController.submitSupportNeeds,
  ])
  router.get('/support-needs/:pathway/status/:uuid', [
    supportNeedsController.setPrisonerData,
    validatePathwayAndFeatureFlag,
    supportNeedsController.getSupportNeedsStatus,
  ])
  router.post('/support-needs/:pathway/status/:uuid', [
    supportNeedsController.setPrisonerData,
    validatePathwayAndFeatureFlag,
    supportNeedsController.submitSupportNeedsStatus,
  ])
  router.get('/support-needs/:pathway/check-answers', [
    supportNeedsController.setPrisonerData,
    validatePathwayAndFeatureFlag,
    supportNeedsController.getCheckAnswers,
  ])
  router.post('/support-needs/:pathway/complete', [
    supportNeedsController.setPrisonerData,
    validatePathwayAndFeatureFlag,
    supportNeedsController.finaliseSupportNeeds,
  ])
  router.post('/support-needs/:pathway/status/:uuid/delete', [
    supportNeedsController.setPrisonerData,
    validatePathwayAndFeatureFlag,
    supportNeedsController.deleteSupportNeed,
  ])
}
