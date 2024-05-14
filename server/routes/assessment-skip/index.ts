import { Router } from 'express'
import AssessmentSkipController from './assessmentSkipController'
import { Services } from '../../services'

export default (router: Router, services: Services) => {
  const assessmentTaskListController = new AssessmentSkipController(services.rpService)

  router.get('/assessment-skip', [assessmentTaskListController.getView])
  router.post('/assessment-skip', [assessmentTaskListController.submitForm])
}
