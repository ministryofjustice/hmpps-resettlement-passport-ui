import { Router } from 'express'
import { Services } from '../../services'
import LicenceImageController from './licenceImageController'

export default (router: Router, services: Services) => {
  const licenceImageController = new LicenceImageController(services.rpService, services.prisonerDetailsService)

  router.get('/licence-image', [licenceImageController.getView])
}
