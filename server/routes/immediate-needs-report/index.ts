import { Router } from 'express'
import { Services } from '../../services'
import ImmediateNeedsReportController from './immediateNeedsReportController'
import { createAssessmentStateService } from '../../data/assessmentStateService'

export default (router: Router, services: Services) => {
  const immediateNeedsReportController = new ImmediateNeedsReportController(
    services.rpService,
    createAssessmentStateService(),
  )

  router.get('/ImmediateNeedsReport-next-page', [immediateNeedsReportController.getFirstPage])
  router.post('/ImmediateNeedsReport-next-page', [immediateNeedsReportController.saveAnswerAndGetNextPage])
  router.get('/ImmediateNeedsReport/pathway/:pathway/page/:pageId/start-edit', [
    immediateNeedsReportController.startEdit,
  ])
  router.get('/ImmediateNeedsReport/pathway/:pathway/page/:currentPageId', [immediateNeedsReportController.getView])
  router.post('/ImmediateNeedsReport/pathway/:pathway/complete', [immediateNeedsReportController.completeAssessment])
}
