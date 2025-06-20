import { Router } from 'express'
import { Services } from '../../services'
import FinanceIdController from './financeIdController'
import { getValidationForPathwayQuery } from '../validation'
import { readOnlyGuard } from '../readOnlyGuard'

export default (router: Router, services: Services) => {
  const financeIdController = new FinanceIdController(services.rpService, services.prisonerDetailsService)

  router.get('/finance-and-id', getValidationForPathwayQuery(), [financeIdController.getView])
  router.post('/finance-and-id/bank-account-delete', [readOnlyGuard, financeIdController.postBankAccountDelete])
  router.post('/finance-and-id/id-delete', [readOnlyGuard, financeIdController.postIdDelete])
}
