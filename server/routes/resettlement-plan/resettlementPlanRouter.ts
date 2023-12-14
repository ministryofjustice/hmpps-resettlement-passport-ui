import { Router } from 'express'
import { Services } from '../../services'
import ResettlementPlanAccomodationController from './accomodation'

export default (router: Router) => {
  const financeIdController = new ResettlementPlanAccomodationController()

  router.post('/plan', [financeIdController.postView])
}