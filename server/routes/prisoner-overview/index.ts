import { Router } from 'express'
import { Services } from '../../services'
import PrisonerOverviewController from './prisonerOverviewController'

export default (router: Router, services: Services) => {
  const prisonerOverviewController = new PrisonerOverviewController(services.rpService)

  router.get('/prisoner-overview', [prisonerOverviewController.getView])
}
