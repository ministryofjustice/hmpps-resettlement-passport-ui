import { Router } from 'express'
import { Services } from '../../services'
import DrugsAlcoholController from './drugsAlcoholController'

export default (router: Router, services: Services) => {
  const drugsAlcoholController = new DrugsAlcoholController(services.rpService)

  router.get('/drugs-and-alcohol', [drugsAlcoholController.getView])
}
