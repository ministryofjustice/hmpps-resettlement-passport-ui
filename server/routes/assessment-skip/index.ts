import { Router } from 'express'
import AssessmentSkipController from './assessmentSkipController'
import { Services } from '../../services'
import { readOnlyGuard } from '../readOnlyGuard'

export default (router: Router, services: Services) => {
  const assessmentSkipController = new AssessmentSkipController(services.rpService, services.prisonerDetailsService)

  router.get('/assessment-skip', [readOnlyGuard, assessmentSkipController.getView])
  router.post('/assessment-skip', [readOnlyGuard, assessmentSkipController.submitForm])
}
