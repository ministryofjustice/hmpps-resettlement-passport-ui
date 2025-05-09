import { Router } from 'express'
import { Services } from '../../services'
import HealthStatusController from './healthStatusController'
import { getValidationForPathwayQuery } from '../validation'

export default (router: Router, services: Services) => {
  const healthController = new HealthStatusController(services.rpService, services.prisonerDetailsService)

  router.get('/health-status', getValidationForPathwayQuery(), [healthController.getView])
}
