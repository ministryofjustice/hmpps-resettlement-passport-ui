import { Router } from 'express'
import { Services } from '../../services'
import FinanceIdController from './financeIdController'

export default (router: Router, services: Services) => {
  const financeIdController = new FinanceIdController(services.rpService)

  router.get('/finance-and-id', [financeIdController.getView])
  router.post('/finance-and-id/bank-account-delete', [financeIdController.postBankAccountDelete])
  router.post('/finance-and-id/id-delete', [financeIdController.postIdDelete])
  router.post('/finance-and-id/bank-account-submit', [financeIdController.postBankAccountSubmitView])
  router.post('/finance-and-id/bank-account-update', [financeIdController.postBankAccountUpdateView])
  router.get('/finance-and-id/add-a-bank-account', [financeIdController.getAddABankAccountView])
  router.get('/finance-and-id/update-bank-account-status', [financeIdController.getUpdateBankAccountStatusView])
  router.get('/finance-and-id/confirm-add-a-bank-account', [financeIdController.getConfirmAddABankAccountView])
}
