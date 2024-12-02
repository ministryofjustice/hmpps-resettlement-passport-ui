import { Router } from 'express'
import { Services } from '../../services'
import AssignCaseController from './assignCaseController'
import asyncWrapper from '../asyncWrapper'

export default (router: Router, services: Services) => {
  const assignCase = new AssignCaseController(services.rpService)

  router.get('/assign-a-case', [asyncWrapper(assignCase.getView)])
  router.post('/assign-a-case', [asyncWrapper(assignCase.assignCases)])
}
