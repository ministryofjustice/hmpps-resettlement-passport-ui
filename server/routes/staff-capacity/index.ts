import { Router } from 'express'
import { Services } from '../../services'
import StaffCapacityController from './staffCapacityController'

export default (router: Router, services: Services) => {
  const staffCapacity = new StaffCapacityController(services.rpService)

  router.get('/staff-capacity', [staffCapacity.getView])
}
