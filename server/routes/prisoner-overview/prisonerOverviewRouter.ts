import { Router } from 'express'
import { Services } from '../../services'
import PrisonerOverviewController from './prisonerOverviewController'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (router: Router, services: Services) => {
  const controller = new PrisonerOverviewController(services.documentService, services.rpService)

  router.get('/prisoner-overview', [controller.getPrisoner])
}
