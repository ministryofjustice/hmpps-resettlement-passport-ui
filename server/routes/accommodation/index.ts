import { Router } from 'express'
import { Services } from '../../services'
import AccommodationController from './accommodationController'
import { getValidationForPathwayQuery } from '../../utils/utils'

export default (router: Router, services: Services) => {
  const accommodationController = new AccommodationController(services.rpService, services.prisonerDetailsService)
  router.get('/accommodation', accommodationController.validateQuery.concat(getValidationForPathwayQuery()), [
    accommodationController.getView,
  ])
}
