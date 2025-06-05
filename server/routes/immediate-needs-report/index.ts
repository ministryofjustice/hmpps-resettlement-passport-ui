import { Router } from 'express'
import { Services } from '../../services'
import ImmediateNeedsReportController from './immediateNeedsReportController'
import { readOnlyGuard } from '../readOnlyGuard'

export default (router: Router, services: Services) => {
  const immediateNeedsReportController = new ImmediateNeedsReportController(
    services.rpService,
    services.assessmentStateService,
    services.prisonerDetailsService,
  )

  router.get('/ImmediateNeedsReport-next-page', [readOnlyGuard, immediateNeedsReportController.getFirstPage])
  router.post('/ImmediateNeedsReport-next-page', [
    readOnlyGuard,
    immediateNeedsReportController.saveAnswerAndGetNextPage,
  ])
  router.get('/ImmediateNeedsReport/pathway/:pathway/page/:pageId/start-edit', [
    readOnlyGuard,
    immediateNeedsReportController.startEdit,
  ])
  router.get('/ImmediateNeedsReport/pathway/:pathway/page/:currentPageId', [
    readOnlyGuard,
    immediateNeedsReportController.getView,
  ])
  router.post('/ImmediateNeedsReport/pathway/:pathway/complete', [
    readOnlyGuard,
    immediateNeedsReportController.completeAssessment,
  ])
}
