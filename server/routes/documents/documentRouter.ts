import { Router } from 'express'
import { Services } from '../../services'
import DocumentController from './documentController'

export default (router: Router, services: Services) => {
  const documentController = new DocumentController(services.documentService, services.prisonerDetailsService)

  router.get('/upload-documents', documentController.viewUploadPage)
  router.post('/document/:prisonerNumber', [documentController.uploadDocument])
  router.get('/document/:prisonerNumber/:documentType', [documentController.viewDocument])
}
