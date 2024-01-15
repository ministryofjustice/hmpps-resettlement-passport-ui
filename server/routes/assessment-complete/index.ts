import { Router } from 'express'
import { Services } from '../../services'
import AssessmentCompleteController from './assessmentCompleteController'

export default (router: Router, services: Services) => {
  const assessmentCompleteController = new AssessmentCompleteController(services.rpService)

  router.get('/assessment-complete', [assessmentCompleteController.getView])
}
