import { Router } from 'express'
import { Services } from '../../services'
import CaseNoteController from './caseNoteController'

export default (router: Router, services: Services) => {
  const caseNoteController = new CaseNoteController(services.rpService, services.prisonerDetailsService)
  router.get('/add-case-note', [caseNoteController.getView])
}
