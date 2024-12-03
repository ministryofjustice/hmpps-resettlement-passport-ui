import { Router } from 'express'
import ServiceUpdatesController from './serviceUpdatesController'

export default (router: Router) => {
  const serviceUpdatesController = new ServiceUpdatesController()

  router.get('/service-updates', serviceUpdatesController.getServiceUpdatesView)
  router.get('/service-updates/:page', serviceUpdatesController.getServiceUpdatesDetailsView)
}
