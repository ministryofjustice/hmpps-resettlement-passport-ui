import { Router } from 'express'
import { Services } from '../../services'
import AddAppointmentController from './addAppointmentController'

export default (router: Router, services: Services) => {
  const addAppointmentController = new AddAppointmentController(services.rpService)

  router.get('/add-appointment', [addAppointmentController.getAddAppointmentView])
}
