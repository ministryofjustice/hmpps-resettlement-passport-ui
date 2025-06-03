import { Router } from 'express'
import { readOnlyGuard } from '../readOnlyGuard'
import { Services } from '../../services'
import StaffCapacityController from './staffCapacityController'

export default (router: Router, services: Services) => {
  const staffCapacity = new StaffCapacityController(services.rpService)

  router.get('/staff-capacity', [readOnlyGuard, staffCapacity.getView])
}
