import { Router } from 'express'
import { Services } from '../../services'
import AssignCaseController from './assignCaseController'

export default (router: Router, services: Services) => {
  const assignCase = new AssignCaseController(services.rpService)

  router.get('/assign-a-case', [assignCase.getView])
}
