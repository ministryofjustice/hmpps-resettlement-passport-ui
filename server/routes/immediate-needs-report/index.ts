import { Router } from 'express'
import { Services } from '../../services'
import ImmediateNeedsReportController from './immediateNeedsReportController'
import { CHECK_ANSWERS_PAGE_ID } from '../../utils/constants'

export default (router: Router, services: Services) => {
  const immediateNeedsReportController = new ImmediateNeedsReportController(
    services.rpService,
    services.assessmentStateService,
  )

  router.get('/ImmediateNeedsReport-next-page', [immediateNeedsReportController.getFirstPage])
  router.post('/ImmediateNeedsReport-next-page', [immediateNeedsReportController.saveAnswerAndGetNextPage])
  router.get('/ImmediateNeedsReport/pathway/:pathway/page/:pageId/start-edit', [
    immediateNeedsReportController.startEdit,
  ])
  router.get(`/ImmediateNeedsReport/pathway/:pathway/page/${CHECK_ANSWERS_PAGE_ID}`, [
    immediateNeedsReportController.getCheckYourAnswers,
  ])
  router.get('/ImmediateNeedsReport/pathway/:pathway/page/:currentPageId', [immediateNeedsReportController.getView])
  router.post('/ImmediateNeedsReport/pathway/:pathway/complete', [immediateNeedsReportController.completeAssessment])
}
