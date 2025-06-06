import { Router } from 'express'
import { Services } from '../../services'
import AssessmentTaskListController from './assessmentTaskListController'
import { readOnlyGuard } from '../readOnlyGuard'

export default (router: Router, services: Services) => {
  const assessmentTaskListController = new AssessmentTaskListController(
    services.rpService,
    services.prisonerDetailsService,
  )

  router.get('/assessment-task-list', [readOnlyGuard, assessmentTaskListController.getView])
}
