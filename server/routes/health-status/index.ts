import { Router } from 'express'
import { Services } from '../../services'
import HealthStatusController from './healthStatusController'
import { getValidationForPathwayQuery } from '../../utils/utils'

export default (router: Router, services: Services) => {
  const healthController = new HealthStatusController(services.rpService, services.prisonerDetailsService)

  router.get('/health-status', healthController.validateQuery.concat(getValidationForPathwayQuery()), [
    healthController.getView,
  ])
}
