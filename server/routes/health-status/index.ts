import { Router } from 'express'
import { Services } from '../../services'
import HealthStatusController from './healthStatusController'

export default (router: Router, services: Services) => {
  const healthController = new HealthStatusController(services.rpService)

  router.get('/health-status', [healthController.getView])
}
