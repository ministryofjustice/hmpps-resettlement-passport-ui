import { Router } from 'express'
import AssessmentSkipController from './assessmentSkipController'
import { Services } from '../../services'

export default (router: Router, services: Services) => {
  const assessmentSkipController = new AssessmentSkipController(services.rpService)

  router.get('/assessment-skip', [assessmentSkipController.getView])
  router.post('/assessment-skip', [assessmentSkipController.submitForm])
}
