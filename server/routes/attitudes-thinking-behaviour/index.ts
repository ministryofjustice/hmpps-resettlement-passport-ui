import { Router } from 'express'
import { Services } from '../../services'
import AttitudesThinkingBehaviourController from './attitudesThinkingBehaviourController'

export default (router: Router, services: Services) => {
  const attitudesThinkingBehaviourController = new AttitudesThinkingBehaviourController(
    services.rpService,
    services.prisonerDetailsService,
  )

  router.get('/attitudes-thinking-and-behaviour', [attitudesThinkingBehaviourController.getView])
}
