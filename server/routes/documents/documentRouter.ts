import { Router } from 'express'
import { Services } from '../../services'
import DocumentController from './documentController'

export default (router: Router, services: Services) => {
  const staffDashboardController = new DocumentController(services.documentService)

  router.post('/document/:prisonerNumber/:documentType', [staffDashboardController.uploadDocument])
  router.get('/document/:prisonerNumber/:documentType', [staffDashboardController.viewDocument])
}
