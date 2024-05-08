import { Router } from 'express'
import AssessmentSkipController from './assessmentSkipController'

export default (router: Router) => {
  const assessmentTaskListController = new AssessmentSkipController()

  router.get('/assessment-skip', [assessmentTaskListController.getView])
  router.post('/assessment-skip', [assessmentTaskListController.submitForm])
}
