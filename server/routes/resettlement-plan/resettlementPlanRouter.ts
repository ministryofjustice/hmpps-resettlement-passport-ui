import { Router } from 'express'
import ResettlementPlanAccomodationController from './accomodation'

export default (router: Router) => {
  const financeIdController = new ResettlementPlanAccomodationController()

  router.post('/plan', [financeIdController.postView])
}
