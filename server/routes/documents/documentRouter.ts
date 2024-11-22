import { Router } from 'express'
import { Services } from '../../services'
import DocumentController from './documentController'
import asyncWrapper from '../asyncWrapper'

export default (router: Router, services: Services) => {
  const documentController = new DocumentController(services.documentService, services.prisonerDetailsService)

  router.get('/upload-documents', [asyncWrapper(documentController.viewUploadPage)])
  router.post('/document/:prisonerNumber', [asyncWrapper(documentController.uploadDocument)])
  router.get('/document/:prisonerNumber/:documentType', [asyncWrapper(documentController.viewDocument)])
}
