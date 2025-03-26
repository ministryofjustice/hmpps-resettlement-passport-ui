import { Router } from 'express'
import { Services } from '../../services'
import FinanceIdController from './financeIdController'
import { getValidationForPathwayQuery } from '../../utils/utils'

export default (router: Router, services: Services) => {
  const financeIdController = new FinanceIdController(services.rpService, services.prisonerDetailsService)

  router.get('/finance-and-id', financeIdController.validateQuery.concat(getValidationForPathwayQuery()), [
    financeIdController.getView,
  ])
  router.post('/finance-and-id/bank-account-delete', [financeIdController.postBankAccountDelete])
  router.post('/finance-and-id/id-delete', [financeIdController.postIdDelete])
}
