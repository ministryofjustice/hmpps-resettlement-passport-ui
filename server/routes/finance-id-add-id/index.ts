import { Router } from 'express'
import { Services } from '../../services'
import FinanceIdAddIdController from './financeIdAddIdController'
import asyncWrapper from '../asyncWrapper'

export default (router: Router, services: Services) => {
  const financeIdAddIdController = new FinanceIdAddIdController(services.rpService, services.prisonerDetailsService)

  router.post('/finance-and-id/id-submit', [asyncWrapper(financeIdAddIdController.postIdSubmitView)])
  router.post('/finance-and-id/id-update', [asyncWrapper(financeIdAddIdController.postIdUpdateView)])
  router.get('/finance-and-id/add-an-id', [asyncWrapper(financeIdAddIdController.getAddAnIdView)])
  router.get('/finance-and-id/confirm-add-an-id', [asyncWrapper(financeIdAddIdController.getConfirmAddAnIdView)])
  router.get('/finance-and-id/add-an-id-further', [asyncWrapper(financeIdAddIdController.getAddAnIdFurtherView)])
  router.get('/finance-and-id/update-id-status', [asyncWrapper(financeIdAddIdController.getUpdateIdStatusView)])
  router.get('/finance-and-id/confirm-add-an-id-status', [
    asyncWrapper(financeIdAddIdController.getConfirmAddAnIdStatusView),
  ])
}
