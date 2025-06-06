import { Router } from 'express'
import { Services } from '../../services'
import FinanceIdBankAccountController from './financeIdBankAccountController'
import asyncWrapper from '../asyncWrapper'
import { readOnlyGuard } from '../readOnlyGuard'

export default (router: Router, services: Services) => {
  const financeIdBankAccountController = new FinanceIdBankAccountController(
    services.rpService,
    services.prisonerDetailsService,
  )

  router.post('/finance-and-id/bank-account-submit', [
    readOnlyGuard,
    asyncWrapper(financeIdBankAccountController.postBankAccountSubmitView),
  ])
  router.post('/finance-and-id/bank-account-update', [
    readOnlyGuard,
    asyncWrapper(financeIdBankAccountController.postBankAccountUpdateView),
  ])
  router.get('/finance-and-id/add-a-bank-account', [
    readOnlyGuard,
    asyncWrapper(financeIdBankAccountController.getAddABankAccountView),
  ])
  router.get('/finance-and-id/update-bank-account-status', [
    readOnlyGuard,
    asyncWrapper(financeIdBankAccountController.getUpdateBankAccountStatusView),
  ])
  router.get('/finance-and-id/confirm-add-a-bank-account', [
    readOnlyGuard,
    asyncWrapper(financeIdBankAccountController.getConfirmAddABankAccountView),
  ])
}
