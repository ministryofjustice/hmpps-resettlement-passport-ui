import { Router } from 'express'
import { Services } from '../../services'
import FinanceIdAddIdController from './financeIdAddIdController'
import asyncWrapper from '../asyncWrapper'
import { readOnlyGuard } from '../readOnlyGuard'

export default (router: Router, services: Services) => {
  const financeIdAddIdController = new FinanceIdAddIdController(services.rpService, services.prisonerDetailsService)

  router.post('/finance-and-id/id-submit', [readOnlyGuard, asyncWrapper(financeIdAddIdController.postIdSubmitView)])
  router.post('/finance-and-id/id-update', [readOnlyGuard, asyncWrapper(financeIdAddIdController.postIdUpdateView)])
  router.get('/finance-and-id/add-an-id', [readOnlyGuard, asyncWrapper(financeIdAddIdController.getAddAnIdView)])
  router.get('/finance-and-id/confirm-add-an-id', [
    readOnlyGuard,
    asyncWrapper(financeIdAddIdController.getConfirmAddAnIdView),
  ])
  router.get('/finance-and-id/add-an-id-further', [
    readOnlyGuard,
    asyncWrapper(financeIdAddIdController.getAddAnIdFurtherView),
  ])
  router.get('/finance-and-id/update-id-status', [
    readOnlyGuard,
    asyncWrapper(financeIdAddIdController.getUpdateIdStatusView),
  ])
  router.get('/finance-and-id/confirm-add-an-id-status', [
    readOnlyGuard,
    asyncWrapper(financeIdAddIdController.getConfirmAddAnIdStatusView),
  ])
}
