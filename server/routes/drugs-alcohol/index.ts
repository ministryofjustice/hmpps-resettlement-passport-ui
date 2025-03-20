import { Router } from 'express'
import { Services } from '../../services'
import DrugsAlcoholController from './drugsAlcoholController'
import { getValidationForPathwayQuery } from '../../utils/utils'

export default (router: Router, services: Services) => {
  const drugsAlcoholController = new DrugsAlcoholController(services.rpService, services.prisonerDetailsService)

  router.get('/drugs-and-alcohol', getValidationForPathwayQuery(), [drugsAlcoholController.getView])
}
