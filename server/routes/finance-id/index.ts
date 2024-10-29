import { Router } from 'express'
import { Services } from '../../services'
import FinanceIdController from './financeIdController'

export default (router: Router, services: Services) => {
  const financeIdController = new FinanceIdController(services.rpService)

  router.get('/finance-and-id', [financeIdController.getView])
  router.post('/finance-and-id/assessment-submit', [financeIdController.postAssessmentSubmitView])
  router.post('/finance-and-id/id-submit', [financeIdController.postIdSubmitView])
  router.post('/finance-and-id/id-update', [financeIdController.postIdUpdateView])
  router.get('/finance-and-id/add-an-id', [financeIdController.getAddAnIdView])
  router.get('/finance-and-id/confirm-assessment', [financeIdController.getConfirmAssessmentView])
  router.get('/finance-and-id/confirm-add-an-id', [financeIdController.getConfirmAddAnIdView])
  router.get('/finance-and-id/assessment', [financeIdController.getAssessmentView])
  router.get('/finance-and-id/add-an-id-further', [financeIdController.getAddAnIdFurtherView])
  router.get('/finance-and-id/update-id-status', [financeIdController.getUpdateIdStatusView])
  router.get('/finance-and-id/confirm-add-an-id-status', [financeIdController.getConfirmAddAnIdStatusView])
}
