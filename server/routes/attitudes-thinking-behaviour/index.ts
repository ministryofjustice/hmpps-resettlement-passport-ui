import { Router } from 'express'
import { Services } from '../../services'
import AttitudesThinkingBehaviourController from './attitudesThinkingBehaviourController'

export default (router: Router, services: Services) => {
  const attitudesThinkingBehaviourController = new AttitudesThinkingBehaviourController(services.prisonService)

  router.get('/attitudes-thinking-and-behaviour', [attitudesThinkingBehaviourController.getView])
}
