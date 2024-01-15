import { Router } from 'express'
import { Services } from '../../services'
import BCST2FormController from './BCST2FormController'

export default (router: Router, services: Services) => {
  const bcst2FormController = new BCST2FormController(services.rpService)

  router.get('/BCST2-form', [bcst2FormController.getView])
}
