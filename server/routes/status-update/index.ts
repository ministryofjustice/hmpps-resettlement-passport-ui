import { Router } from 'express'
import { Services } from '../../services'
import StatusUpdateController from './statusUpdateController'

export default (router: Router, services: Services) => {
  const statusUpdateController = new StatusUpdateController(
    services.rpService,
    services.appInsightsClient,
    services.prisonerDetailsService,
  )
  router.get('/status-update', [statusUpdateController.getStatusUpdate])
  router.post('/status-update', [statusUpdateController.postStatusUpdate])
}
