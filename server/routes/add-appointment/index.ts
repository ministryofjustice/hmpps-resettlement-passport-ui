import { Router } from 'express'
import { Services } from '../../services'
import AddAppointmentController from './addAppointmentController'
import asyncWrapper from '../asyncWrapper'

export default (router: Router, services: Services) => {
  const addAppointmentController = new AddAppointmentController(services.prisonerDetailsService)

  router.get('/add-appointment', [asyncWrapper(addAppointmentController.getAddAppointmentView)])
  router.get('/add-appointment-confirm', [asyncWrapper(addAppointmentController.getConfirmAppointmentView)])
  router.post('/add-appointment-submit', [asyncWrapper(addAppointmentController.postAppointmentView)])
}
