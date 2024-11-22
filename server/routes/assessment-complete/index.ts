import { Router } from 'express'
import { Services } from '../../services'
import AssessmentCompleteController from './assessmentCompleteController'
import asyncWrapper from '../asyncWrapper'

export default (router: Router, services: Services) => {
  const assessmentCompleteController = new AssessmentCompleteController(
    services.rpService,
    services.assessmentStateService,
    services.appInsightsClient,
    services.prisonerDetailsService,
  )

  router.get('/assessment-complete', [asyncWrapper(assessmentCompleteController.getView)])
  router.post('/assessment-complete', [asyncWrapper(assessmentCompleteController.postView)])
}
