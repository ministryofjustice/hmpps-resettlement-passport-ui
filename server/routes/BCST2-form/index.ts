import { Router } from 'express'
import { Services } from '../../services'
import BCST2FormController from './BCST2FormController'
import { createAssessmentStateService } from '../../data/assessmentStateService'

export default (router: Router, services: Services) => {
  const bcst2FormController = new BCST2FormController(services.rpService, createAssessmentStateService())

  router.get('/BCST2-next-page', [bcst2FormController.getFirstPage])
  router.post('/BCST2-next-page', [bcst2FormController.saveAnswerAndGetNextPage])
  router.get('/BCST2/pathway/:pathway/page/:currentPageId', [bcst2FormController.getView])
  router.post('/BCST2/pathway/:pathway/complete', [bcst2FormController.completeAssessment])
}
