import { Router } from 'express'
import { oneOf, query } from 'express-validator'
import { Services } from '../../services'
import AssignCaseController from './assignCaseController'
import asyncWrapper from '../asyncWrapper'
import { readOnlyGuard } from '../readOnlyGuard'

export default (router: Router, services: Services) => {
  const assignCase = new AssignCaseController(services.rpService)

  router.get(
    '/assign-a-case',
    [
      query('sortField').isIn(['name', 'releaseDate', 'assignedWorkerLastname']).optional(),
      query('sortDirection').isIn(['ASC', 'DESC']).optional(),
      query('releaseTime').isInt({ min: 0 }).optional(),
    ],
    oneOf([
      query('workerId').isInt({ min: 0 }).optional(), // assigned to a specific worker
      query('workerId').equals('none').optional(), // no worker assigned
      query('workerId').isEmpty().optional(), // all workers
    ]),
    oneOf([query('currentPage').isInt({ min: 0 }).optional(), query('currentPage').isEmpty().optional()]),
    [readOnlyGuard, asyncWrapper(assignCase.getView)],
  )
  router.post('/assign-a-case', [readOnlyGuard, asyncWrapper(assignCase.assignCases)])
}
