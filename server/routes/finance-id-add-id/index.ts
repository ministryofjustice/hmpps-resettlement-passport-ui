import { Router } from 'express'
import { Services } from '../../services'
import FinanceIdAddIdController from './financeIdAddIdController'

export default (router: Router, services: Services) => {
  const financeIdAddIdController = new FinanceIdAddIdController(services.rpService)

  router.post('/finance-and-id/id-submit', [financeIdAddIdController.postIdSubmitView])
  router.post('/finance-and-id/id-update', [financeIdAddIdController.postIdUpdateView])
  router.get('/finance-and-id/add-an-id', [financeIdAddIdController.getAddAnIdView])
  router.get('/finance-and-id/confirm-add-an-id', [financeIdAddIdController.getConfirmAddAnIdView])
  router.get('/finance-and-id/add-an-id-further', [financeIdAddIdController.getAddAnIdFurtherView])
  router.get('/finance-and-id/update-id-status', [financeIdAddIdController.getUpdateIdStatusView])
  router.get('/finance-and-id/confirm-add-an-id-status', [financeIdAddIdController.getConfirmAddAnIdStatusView])
}
