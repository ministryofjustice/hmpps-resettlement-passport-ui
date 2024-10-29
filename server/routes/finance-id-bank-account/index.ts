import { Router } from 'express'
import { Services } from '../../services'
import FinanceIdBankAccountController from './financeIdBankAccountController'

export default (router: Router, services: Services) => {
  const financeIdBankAccountController = new FinanceIdBankAccountController(services.rpService)

  router.post('/finance-and-id/bank-account-submit', [financeIdBankAccountController.postBankAccountSubmitView])
  router.post('/finance-and-id/bank-account-update', [financeIdBankAccountController.postBankAccountUpdateView])
  router.get('/finance-and-id/add-a-bank-account', [financeIdBankAccountController.getAddABankAccountView])
  router.get('/finance-and-id/update-bank-account-status', [
    financeIdBankAccountController.getUpdateBankAccountStatusView,
  ])
  router.get('/finance-and-id/confirm-add-a-bank-account', [
    financeIdBankAccountController.getConfirmAddABankAccountView,
  ])
}
