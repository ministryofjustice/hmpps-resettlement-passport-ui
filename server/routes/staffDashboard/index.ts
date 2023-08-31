import { Router } from 'express'
import { Services } from '../../services'
import StaffDashboardController from './staffDashboardController'

export default (router: Router, services: Services) => {
  const staffDashboardController = new StaffDashboardController(services.prisonService, services.userService)

  router.get('/', [staffDashboardController.getView])
}
