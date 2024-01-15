import { Router } from 'express'
import { Services } from '../../services'
import AssessmentTaskListController from './assessmentTaskListController'

export default (router: Router, services: Services) => {
  const assessmentTaskListController = new AssessmentTaskListController(services.rpService)

  router.get('/assessment-task-list', [assessmentTaskListController.getView])
}
