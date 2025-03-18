import { Router } from 'express'
import { body } from 'express-validator'
import { Services } from '../../services'
import SupportNeedsController from './supportNeedsController'
import { SupportNeedStatus } from '../../data/model/supportNeedStatus'

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
  router.post(
    '/support-needs/:pathway/status/:uuid',
    [
      body('status', 'Select a update status').isIn([
        SupportNeedStatus.NOT_STARTED,
        SupportNeedStatus.IN_PROGRESS,
        SupportNeedStatus.MET,
        SupportNeedStatus.DECLINED,
      ]),
      body('responsibleStaff', 'Select who is responsible for this support need')
        .toArray()
        .isArray({ min: 1 })
        .isIn(['PRISON', 'PROBATION']),
      body('updateText', 'Additional details must be 3,000 characters or less').isLength({ max: 3000 }),
    ],
    [
      supportNeedsController.setPrisonerData,
      supportNeedsController.validatePathwayAndFeatureFlag,
      supportNeedsController.submitSupportNeedsStatus,
    ],
  )

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
